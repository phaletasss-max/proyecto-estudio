import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Lock, MessageSquare, Terminal, Unlock } from 'lucide-react';
import { LabHeader } from '@/components/lab/LabHeader';
import { LabSidebar } from '@/components/lab/LabSidebar';
import { LabBriefing, LabTopology } from '@/components/lab/LabBriefing';
import { EvidencePanel, ChainOfCustody } from '@/components/lab/EvidencePanel';
import { LabIndicators, LabReportForm, LabCompletion, downloadNotebookReport } from '@/components/lab/LabNotebookPanels';
import { useAuth } from '@/context/AuthContext';
import { useLabDetail } from '@/hooks/useLabDetail';
import { useLabNotebook } from '@/hooks/useLabNotebook';
import { getLabWorkspace } from '@/data/labWorkspaces';
import { reportChecklist } from '@/lib/labNotebook';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Badge } from '@/types/auth';
import type { CTFLab } from '@/types/ctf';
import type { LabSection } from '@/types/labWorkspace';
import '@/components/lab/lab.css';

const FlagInput = lazy(() => import('@/components/FlagInput').then(module => ({ default: module.FlagInput })));
const WriteupRenderer = lazy(() => import('@/components/WriteupRenderer').then(module => ({ default: module.WriteupRenderer })));
const AchievementModal = lazy(() => import('@/components/AchievementModal').then(module => ({ default: module.AchievementModal })));
const CyberTerminal = lazy(() => import('@/components/CyberTerminal').then(module => ({ default: module.CyberTerminal })));
const TaskSection = lazy(() => import('@/components/TaskSection').then(module => ({ default: module.TaskSection })));
const LabDiscussion = lazy(() => import('@/components/LabDiscussion').then(module => ({ default: module.LabDiscussion })));
const panelLoading = <p role="status" className="lab-panel text-sm text-muted">Preparando contenido…</p>;

type SupportPanel = 'writeup' | 'terminal' | 'discussion';

export function LabDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  // A different lab or account must never inherit the previous lab's private content.
  return <LabDetailContent key={`${slug}:${user?.id || 'guest'}:${user?.accessStatus || ''}`} />;
}

function LabDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { lab, loading, error } = useLabDetail(slug || '');
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted" role="status"><div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" /> Cargando laboratorio…</div>;
  if (error || !lab) return <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5"><p className="text-sm text-danger" role="alert">{error || 'Laboratorio no encontrado'}</p><Link to="/labs" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-text"><ArrowLeft size={16} /> Volver al catálogo</Link></div>;
  return <LabWorkspace key={lab.id} lab={lab} />;
}

function LabWorkspace({ lab }: { lab: CTFLab }) {
  const { user, submitFlag } = useAuth();
  const workspace = lab.workspace || getLabWorkspace(lab.slug);
  const evidence = workspace?.evidence || [];
  const { notebook, setNotebook, storageError } = useLabNotebook(lab.id, user?.id);
  const [activeSection, setActiveSection] = useState<LabSection>('briefing');
  const [supportPanel, setSupportPanel] = useState<SupportPanel | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState(evidence[0]?.id || '');
  const [writeupUnlocked, setWriteupUnlocked] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [awardedBadges, setAwardedBadges] = useState<Badge[]>([]);
  const [secureWriteup, setSecureWriteup] = useState<string | null>(null);
  const [writeupError, setWriteupError] = useState(false);
  const [writeupRetry, setWriteupRetry] = useState(0);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [exportError, setExportError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousSection = useRef(activeSection);
  const solve = user?.solvedLabs.find(item => item.labId === lab.id || item.labSlug === lab.slug);
  const isAlreadySolved = !!solve;
  const canViewWriteup = writeupUnlocked || isAlreadySolved;
  const available: LabSection[] = ['briefing', ...(workspace ? ['topology', 'evidence'] as LabSection[] : []), 'questions', 'indicators', 'report', 'completion'];

  const selectSection = (section: LabSection) => { setSupportPanel(null); setActiveSection(section); };
  const continueFrom = (from: LabSection, to: LabSection) => {
    setNotebook(previous => ({ ...previous, reviewed: [...new Set([...previous.reviewed, from])] }));
    selectSection(to);
  };
  const openEvidence = (id: string) => { setSelectedEvidence(id); selectSection('evidence'); };
  const exportReport = () => {
    try { downloadNotebookReport(lab.title, lab.slug, notebook, evidence, canViewWriteup); setExportError(false); }
    catch { setExportError(true); }
  };

  useEffect(() => {
    if (previousSection.current !== activeSection) contentRef.current?.focus({ preventScroll: false });
    previousSection.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    if (!canViewWriteup || !isSupabaseConfigured() || secureWriteup !== null || supportPanel !== 'writeup') return;
    let active = true;
    setWriteupError(false);
    supabase.rpc('get_challenge_writeup', { p_lab_id: lab.id })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { setWriteupError(true); return; }
        setSecureWriteup(typeof data === 'string' ? data : '');
      });
    return () => { active = false; };
  }, [lab.id, canViewWriteup, secureWriteup, writeupRetry, supportPanel]);

  const handleFlagSubmission = async (flag: string) => {
    const result = await submitFlag({ id: lab.id, slug: lab.slug, title: lab.title, category: lab.category, difficulty: lab.difficulty }, flag);
    if (result.accepted) {
      setWriteupUnlocked(true);
      if (!result.alreadySolved) {
        setPointsAwarded(result.pointsEarned);
        setAwardedBadges(result.newBadges);
        setAchievementModalOpen(true);
      }
    }
    return result;
  };

  const handleSecureDownload = async () => {
    if (!lab.zip_url || !user || !isSupabaseConfigured()) return;
    setDownloadState('loading');
    try {
      const { data, error } = await supabase.storage.from('ctf-zips').createSignedUrl(lab.zip_url, 60, { download: true });
      if (error || !data?.signedUrl) throw new Error('Download unavailable');
      window.location.assign(data.signedUrl);
      setDownloadState('idle');
    } catch { setDownloadState('error'); }
  };

  const reportReady = reportChecklist(notebook, evidence.map(item => item.id)).every(item => item.complete);
  const reviewed: LabSection[] = notebook.reviewed.filter(section => section !== 'report');
  if (reportReady) reviewed.push('report');

  return <section className="lab-workspace mx-auto w-full max-w-[1500px] px-4 py-6 text-foreground sm:px-6 sm:py-8">
    <LabHeader lab={lab} solved={canViewWriteup} authenticated={!!user} downloadState={downloadState} onDownload={handleSecureDownload} />
    <div className="lab-layout mt-5">
      <div className="lab-navigation-column"><LabSidebar active={activeSection} available={available} reviewed={reviewed} solved={canViewWriteup} onSelect={selectSection} />
        <aside className="mt-4 rounded-xl border border-border bg-panel p-4"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Tu cuaderno</h2><p className="mt-2 text-xs leading-6 text-muted">Notas e informe guardados en este navegador{user ? ', separados por cuenta' : ' como visitante'}. Exporta una copia antes de cambiar de dispositivo.</p><button type="button" onClick={exportReport} className="mt-2 min-h-11 text-sm font-semibold text-accent-text">Exportar informe</button></aside>
      </div>
      <div className="min-w-0" ref={contentRef} tabIndex={-1}><Suspense fallback={panelLoading}>
        {storageError && <p role="alert" className="mb-4 rounded-lg border border-warning/40 bg-panel p-4 text-sm leading-6 text-warning">Este navegador no permite guardar el cuaderno. Puedes trabajar durante esta sesión; exporta el informe para conservarlo.</p>}
        {exportError && <p role="alert" className="mb-4 rounded-lg border border-danger/40 p-4 text-sm text-danger">No se pudo exportar. Copia tu informe antes de cerrar esta página o vuelve a intentar la descarga.</p>}
        {activeSection === 'briefing' && <LabBriefing lab={lab} workspace={workspace} onContinue={() => continueFrom('briefing', workspace ? 'topology' : 'questions')} />}
        {activeSection === 'topology' && workspace && <LabTopology workspace={workspace} onEvidence={openEvidence} onContinue={() => continueFrom('topology', 'evidence')} />}
        {activeSection === 'evidence' && workspace && <>
          <EvidencePanel workspace={workspace} authenticated={!!user} selectedId={selectedEvidence} onSelect={setSelectedEvidence}
            onVerified={event => setNotebook(previous => ({ ...previous, custody: [...previous.custody, event].slice(-50) }))}
            onCite={(item, line, content) => setNotebook(previous => ({ ...previous, notes: `${previous.notes}${previous.notes ? '\n\n' : ''}${item.filename}, línea ${line}:\n${content}`.slice(0, 10000) }))} />
          <ChainOfCustody evidence={evidence} events={notebook.custody} />
          <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="lab-button" onClick={() => continueFrom('evidence', 'questions')}>Continuar al reto <ArrowRight size={16} /></button><button type="button" className="lab-button lab-button-secondary" onClick={() => selectSection('indicators')}>Ver notas y hallazgos</button></div>
        </>}
        {activeSection === 'questions' && <div className="space-y-5">
          <div className="lab-panel"><p className="lab-eyebrow">Comprueba tu análisis</p><h2 className="lab-title">Resolver el reto</h2><p className="mt-3 text-sm leading-7 text-muted">Lee cada pregunta, localiza la evidencia y responde en el formato indicado. Las pistas muestran su coste antes de revelarse.</p>{workspace && <button type="button" className="mt-3 min-h-11 text-sm font-semibold text-accent-text" onClick={() => selectSection('evidence')}>Volver a los registros</button>}</div>
          {lab.tasks && lab.tasks.length > 0 ? <TaskSection tasks={lab.tasks} /> : <div className="lab-panel"><p className="text-sm leading-7 text-muted">Este laboratorio utiliza una validación directa de flag. Sigue el objetivo y las instrucciones de su paquete de archivos para obtenerla.</p></div>}
          <section className="lab-panel" aria-labelledby="flag-title"><div className="flex flex-wrap items-center justify-between gap-3"><h3 id="flag-title" className="inline-flex items-center gap-2 text-base font-semibold">{canViewWriteup ? <Unlock size={18} className="text-success" /> : <Lock size={18} className="text-muted" />} Flag principal del reto</h3><span className="text-sm font-semibold text-warning">Hasta {lab.points ?? 100} puntos</span></div><p className="my-4 text-sm leading-7 text-muted">Completa las preguntas en orden y envía la flag encontrada. Los puntos se acreditan una sola vez al completar el laboratorio. Las pistas con coste reducen esa recompensa.</p><FlagInput onSubmit={handleFlagSubmission} disabled={canViewWriteup} /></section>
          <button type="button" className="lab-button lab-button-secondary" onClick={() => selectSection('indicators')}>Documentar mis hallazgos <ArrowRight size={16} /></button>
        </div>}
        {activeSection === 'indicators' && <LabIndicators notebook={notebook} evidence={evidence} onChange={setNotebook} onContinue={() => continueFrom('indicators', 'report')} />}
        {activeSection === 'report' && <LabReportForm notebook={notebook} evidence={evidence} onChange={setNotebook} onContinue={() => selectSection('completion')} onExport={exportReport} />}
        {activeSection === 'completion' && <LabCompletion notebook={notebook} evidence={evidence} solved={canViewWriteup} points={solve?.pointsEarned ?? (writeupUnlocked ? pointsAwarded : undefined)} onSelect={selectSection} onExport={exportReport} />}
        <section className="lab-panel mt-5" aria-label="Recursos de apoyo"><h2 className="text-sm font-semibold">Recursos de apoyo</h2><div className="mt-3 flex flex-wrap gap-2">{([{ id: 'terminal', label: 'Terminal de práctica', icon: Terminal }, { id: 'writeup', label: `Solución ${canViewWriteup ? 'disponible' : 'bloqueada'}`, icon: FileText }, { id: 'discussion', label: 'Comunidad', icon: MessageSquare }] as const).map(item => <button type="button" key={item.id} aria-expanded={supportPanel === item.id} aria-controls={`lab-support-${item.id}`} className="lab-button lab-button-secondary" onClick={() => setSupportPanel(previous => previous === item.id ? null : item.id)}><item.icon size={16} /> {item.label}</button>)}</div>
          {supportPanel === 'terminal' && <div id="lab-support-terminal" className="mt-5"><CyberTerminal labSlug={lab.slug} /></div>}
          {supportPanel === 'discussion' && <div id="lab-support-discussion" className="mt-5"><LabDiscussion labSlug={lab.slug} initialComments={lab.comments} /></div>}
          {supportPanel === 'writeup' && <div id="lab-support-writeup" className="mt-5 border-t border-border pt-5">{canViewWriteup ? writeupError ? <div role="alert"><p className="text-sm text-danger">No se pudo cargar la solución.</p><button type="button" className="lab-button lab-button-secondary mt-3" onClick={() => setWriteupRetry(value => value + 1)}>Reintentar</button></div> : secureWriteup === null ? <p className="text-sm text-muted" role="status">Cargando solución…</p> : secureWriteup ? <WriteupRenderer content={secureWriteup} /> : <p className="text-sm text-muted">La flag está validada. La solución editorial todavía no está disponible.</p> : <div><h3 className="flex items-center gap-2 text-base font-semibold"><Lock size={18} /> Solución bloqueada</h3><p className="mt-2 text-sm leading-7 text-muted">Envía la flag correcta para desbloquear la guía completa. Las pistas de cada pregunta están disponibles mientras resuelves el reto.</p><button type="button" className="lab-button mt-4" onClick={() => selectSection('questions')}>Ir al reto</button></div>}</div>}
        </section>
      </Suspense></div>
    </div>
    {achievementModalOpen && <Suspense fallback={<p role="status">Cargando resultado…</p>}><AchievementModal isOpen onClose={() => setAchievementModalOpen(false)} labTitle={lab.title} pointsEarned={pointsAwarded} newBadges={awardedBadges} /></Suspense>}
  </section>;
}

export default LabDetail;
