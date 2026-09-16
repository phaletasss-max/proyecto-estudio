import { lazy, Suspense, useDeferredValue, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarPlus, Check, Circle, Download, Play, RotateCcw, Search, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStudyLibrary } from '@/hooks/useStudyLibrary';
import { addStudyDays, emptyStudyProgress, exportStudyWriteup, isReviewDue, localStudyDate, prioritizeStudy, restoreStudyDraft, studyCompletion, studyMilestones, studyProgressError, studyWriteupTemplate, suggestedStudyAction } from '@/lib/study';
import { supabase } from '@/lib/supabase';
import { STUDY_STATUSES, type StudyProgress, type StudyResource, type StudyStatus } from '@/types/study';
const WriteupRenderer = lazy(() => import('@/components/WriteupRenderer').then(module => ({ default: module.WriteupRenderer })));

const input = 'sb-study-input w-full min-h-11 rounded-control border border-border bg-background p-3 text-sm';
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border px-4 py-2 text-sm font-semibold hover:bg-elevated disabled:opacity-50';

export default function StudyLibrary() {
  const { user } = useAuth();
  // Remount on identity changes to discard another account's unsaved private draft.
  return <LibraryContent key={`${user?.id || 'guest'}:${user?.accessStatus}`} />;
}

function LibraryContent() {
  const { user } = useAuth();
  const { resources, progress, loading, error, refetch } = useStudyLibrary();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [withWriteup, setWithWriteup] = useState(false);
  const today = localStudyDate();
  const states = new Map(progress.map(item => [item.resource_id, item]));
  const ordered = prioritizeStudy(resources, progress, today);
  const visible = ordered.filter(resource => {
    const state = states.get(resource.id);
    return (status === 'all' || (status === 'due' ? isReviewDue(state, today) : (state?.status || 'queued') === status))
      && (category === 'all' || resource.category === category)
      && (!withWriteup || !!resource.writeup_path)
      && `${resource.title} ${resource.category} ${resource.objective}`.toLocaleLowerCase().includes(deferredSearch.toLocaleLowerCase());
  });
  const selected = resources.find(item => item.id === params.get('resource'));
  const canRead = user && ['admin', 'member'].includes(user.accessStatus);
  const recommended = ordered[0];
  const recommendedProgress = recommended ? states.get(recommended.id) : undefined;
  const activeCount = progress.filter(item => ['practicing', 'documenting', 'review'].includes(item.status)).length;
  const learnedCount = progress.filter(item => item.status === 'learned').length;

  return <section className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
    <header className="sb-section-header mb-7 pb-6"><p className="text-xs uppercase tracking-widest text-accent-text">Tu mesa de estudio</p><h1 className="mt-3 text-3xl font-semibold">Biblioteca y práctica</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">Organiza los archivos guardados, practica y escribe lo que has entendido. Los writeups de referencia pueden contener la solución completa. Tu avance aquí es personal; los puntos se obtienen en los laboratorios con validación.</p></header>
    {!canRead ? <div className="rounded-card border border-border bg-panel p-6"><h2 className="text-xl font-semibold">Material de la comunidad</h2><p className="my-3 text-sm text-muted">{user ? 'Completa la admisión para acceder a los archivos y guardar tu plan de estudio.' : 'Inicia sesión y completa la admisión para consultar la biblioteca privada.'}</p><Link className={button} to="/admission">Ir a admisión <ArrowRight size={16} /></Link></div>
      : loading ? <p role="status">Cargando materiales y tu progreso…</p>
      : error ? <div role="alert" className="rounded-card border border-border p-6"><p>{error}</p><button className={`${button} mt-4`} onClick={refetch}>Reintentar</button></div>
      : selected ? <StudyDeskLoader key={selected.id} resource={selected} onBack={() => { setParams({}); refetch(); }} />
      : <>
        {recommended && <section className="mb-6 grid gap-5 rounded-card border border-border bg-panel p-5 shadow-[var(--sb-shadow)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center sm:p-6">
          <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-text"><Sparkles size={15} /> Tu mejor siguiente paso</p><h2 className="mt-3 text-2xl font-semibold">{recommended.title}</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{recommendedProgress?.next_action || suggestedStudyAction(recommended, { status: recommendedProgress?.status || 'queued' })}</p><p className="mt-3 text-xs text-muted">{isReviewDue(recommendedProgress, today) ? 'Repaso vencido: conviene hacerlo antes de empezar material nuevo.' : recommendedProgress?.status && recommendedProgress.status !== 'queued' ? `Continúa desde «${STUDY_STATUSES[recommendedProgress.status]}».` : recommended.readiness === 'guided' ? 'Tiene laboratorio guiado para comenzar con menos fricción.' : 'Es el siguiente material disponible en tu cola.'}</p></div>
          <button className={`${button} sb-primary-button w-full md:w-auto`} onClick={() => setParams({ resource: recommended.id })}>Continuar ahora <ArrowRight size={16} /></button>
        </section>}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
          ['Materiales', resources.length], ['En curso', activeCount], ['Aprendidos', learnedCount], ['Repasos pendientes', progress.filter(item => isReviewDue(item, today)).length],
        ].map(([label, count]) => <div key={label} className="rounded-card border border-border bg-panel p-4"><p className="text-sm text-muted">{label}</p><strong className="mt-2 block text-2xl">{count}</strong></div>)}</div>
        <div className="mb-6 grid gap-4 rounded-card border border-border bg-panel p-5 sm:grid-cols-3">
          <label className="text-sm">Buscar material<div className="relative mt-2"><Search size={16} className="absolute right-3 top-4 text-muted" /><input className={`${input} pr-10`} value={search} onChange={event => setSearch(event.target.value)} placeholder="Nombre, objetivo o categoría" /></div></label>
          <label className="text-sm">Mi avance<select className={`${input} mt-2`} value={status} onChange={event => setStatus(event.target.value)}><option value="all">Todo el material</option><option value="due">Repaso pendiente hoy</option>{Object.entries(STUDY_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-sm">Especialidad<select className={`${input} mt-2`} value={category} onChange={event => setCategory(event.target.value)}><option value="all">Todas</option>{[...new Set(resources.map(item => item.category))].sort().map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="flex min-h-11 items-center gap-2 text-sm sm:col-span-3"><input type="checkbox" checked={withWriteup} onChange={event => setWithWriteup(event.target.checked)} /> Solo material con writeup de referencia</label>
        </div>
        <p role="status" className="mb-4 text-sm text-muted">{visible.length} materiales · Primero tus repasos y prácticas en curso</p>
        {!resources.length ? <p className="rounded-card border border-border p-6">Todavía no se han importado materiales. Los laboratorios publicados siguen disponibles en <Link className="text-accent-text underline" to="/labs">Laboratorios</Link>.</p>
          : !visible.length ? <p>No hay coincidencias. Amplía los filtros para ver más material.</p>
          : <div className="grid gap-4 md:grid-cols-2">{visible.map(resource => {
            const state = states.get(resource.id);
            return <article key={resource.id} className="sb-study-card flex flex-col rounded-card border border-border bg-panel p-5 transition-colors"><div className="flex flex-wrap justify-between gap-2 text-xs text-muted"><span>{resource.source} · {resource.category}</span><span className="text-accent-text">{STUDY_STATUSES[state?.status || 'queued']}</span></div><h2 className="mt-3 text-xl font-semibold">{resource.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{resource.objective}</p><p className="mt-3 text-xs text-muted">{resource.writeup_path ? 'Writeup de referencia disponible' : 'Writeup pendiente de elaborar'} · {(resource.archive_bytes / 1048576).toFixed(1)} MB</p>{state?.next_action && <p className="mt-3 text-sm"><strong>Siguiente acción:</strong> {state.next_action}</p>}{isReviewDue(state, today) && <p className="mt-3 text-sm text-warning">Repaso programado: {state?.review_on}</p>}<div className="mt-auto pt-5"><button className={button} onClick={() => setParams({ resource: resource.id })}>Abrir mesa de estudio <ArrowRight size={16} /></button></div></article>;
          })}</div>}
      </>}
  </section>;
}

function StudyDeskLoader({ resource, onBack }: { resource: StudyResource; onBack: () => void }) {
  const { user } = useAuth();
  const [state, setState] = useState<{ progress: StudyProgress | null; error: boolean }>({ progress: null, error: false });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ progress: null, error: false });
    if (!user) return () => controller.abort();
    void (async () => {
      try {
        const { data, error } = await supabase.from('study_progress')
          .select('resource_id,status,next_action,personal_writeup,review_on,updated_at')
          .eq('user_id', user.id).eq('resource_id', resource.id).abortSignal(controller.signal).maybeSingle();
        if (error) throw error;
        if (!controller.signal.aborted) setState({ progress: data || emptyStudyProgress(resource.id), error: false });
      } catch { if (!controller.signal.aborted) setState({ progress: null, error: true }); }
    })();
    return () => controller.abort();
  }, [user?.id, resource.id, retry]);
  if (state.error) return <div role="alert"><p>No se pudo cargar tu writeup. Reintenta antes de editar para conservar la versión guardada.</p><button className={`${button} mt-4`} onClick={() => setRetry(value => value + 1)}>Reintentar</button><button className={`${button} ml-3`} onClick={onBack}>Volver</button></div>;
  if (!state.progress) return <p role="status">Cargando tu mesa de estudio…</p>;
  return <StudyDesk resource={resource} saved={state.progress} onBack={onBack} />;
}

function StudyDesk({ resource, saved, onBack }: { resource: StudyResource; saved: StudyProgress; onBack: () => void }) {
  const { user } = useAuth();
  const today = localStudyDate();
  const draftKey = `shadowbytes:study-draft:${user?.id}:${resource.id}`;
  const [draft, setDraft] = useState(() => {
    try { return restoreStudyDraft(localStorage.getItem(draftKey), saved); } catch { return saved; }
  });
  const [draftStorageError, setDraftStorageError] = useState(false);
  const [lastSaved, setLastSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [failed, setFailed] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [fileBusy, setFileBusy] = useState(false);
  const [referenceError, setReferenceError] = useState('');
  const [showReference, setShowReference] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(lastSaved);
  const completion = studyCompletion(draft);
  const milestones = studyMilestones(draft);
  const suggestedAction = suggestedStudyAction(resource, draft);
  useEffect(() => {
    try {
      if (dirty) localStorage.setItem(draftKey, JSON.stringify(draft));
      else localStorage.removeItem(draftKey);
      setDraftStorageError(false);
    } catch { setDraftStorageError(true); }
  }, [draftKey, draft, dirty]);
  useEffect(() => {
    if (!dirty) return;
    const protectDraft = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', protectDraft);
    return () => window.removeEventListener('beforeunload', protectDraft);
  }, [dirty]);
  const patch = (update: Partial<StudyProgress>) => { setDraft(previous => ({ ...previous, ...update })); setNotice(''); };
  const save = async () => {
    const validation = studyProgressError(draft);
    if (validation) { setNotice(validation); setFailed(true); return; }
    if (!user) return;
    setSaving(true); setNotice('');
    try {
      const { error } = await supabase.from('study_progress').upsert({ ...draft, user_id: user.id, updated_at: new Date().toISOString() }, { onConflict: 'user_id,resource_id' });
      if (error) throw error;
      setLastSaved(draft); setFailed(false); setNotice('Progreso y writeup personal guardados en tu cuenta.');
    } catch { setFailed(true); setNotice('No se pudo guardar. Tu borrador sigue aquí; vuelve a intentar o expórtalo.'); }
    finally { setSaving(false); }
  };
  const download = async (path: string) => {
    setFileBusy(true); setReferenceError('');
    try {
      const { data, error } = await supabase.storage.from('study-library').createSignedUrl(path, 60, { download: true });
      if (error || !data) throw error;
      // A download link preserves the unsaved study form.
      const link = document.createElement('a'); link.href = data.signedUrl; link.target = '_blank'; link.rel = 'noopener'; link.click();
    } catch { setReferenceError('No se pudo descargar. Comprueba tu sesión y vuelve a intentarlo.'); }
    finally { setFileBusy(false); }
  };
  const reveal = async () => {
    if (reference !== null) { setShowReference(true); return; }
    if (!resource.writeup_path) return;
    setFileBusy(true); setReferenceError('');
    try {
      const { data, error } = await supabase.storage.from('study-library').download(resource.writeup_path);
      if (error || !data) throw error;
      if (data.size > 1048576) throw new Error('Writeup demasiado grande');
      setReference(await data.text()); setShowReference(true);
    } catch { setReferenceError('No se pudo cargar el writeup. Puedes volver a intentarlo.'); }
    finally { setFileBusy(false); }
  };
  const exportDraft = () => {
    const url = URL.createObjectURL(new Blob([exportStudyWriteup(resource.title, draft)], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${resource.id}-mi-writeup.md`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <>
    <button className={button} disabled={dirty || saving} onClick={onBack}>Volver a la biblioteca</button>{dirty && <p role="status" className="mt-2 text-sm text-warning">{draftStorageError ? 'No se pudo conservar el borrador en este navegador. Guarda o exporta antes de salir.' : 'Borrador conservado en este navegador. Pulsa Guardar mi progreso para sincronizarlo con tu cuenta.'}</p>}
    <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <article className="min-w-0 rounded-card border border-border bg-panel p-5 sm:p-7"><p className="text-xs text-muted">{resource.source} · {resource.category}</p><h2 className="mt-2 text-2xl font-semibold">{resource.title}</h2><p className="mt-4 text-sm leading-7">{resource.objective}</p><p className="mt-3 text-sm leading-7 text-muted"><strong>Entorno:</strong> {resource.environment}</p>{resource.import_note && <p className="mt-3 text-sm leading-7 text-muted">{resource.import_note}</p>}
        <section className="my-6 rounded-card border border-border bg-background p-5" aria-labelledby="session-progress-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-accent-text">Sesión enfocada</p><h3 id="session-progress-title" className="mt-2 text-lg font-semibold">Avance de esta práctica</h3></div><strong className="font-mono text-2xl text-accent-text">{completion}%</strong></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-elevated" role="progressbar" aria-label="Preparación de la práctica" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}><div className="h-full bg-accent transition-[width]" style={{ width: `${completion}%` }} /></div>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">{milestones.map(item => <li key={item.label} className={`flex items-center gap-2 ${item.complete ? 'text-success' : 'text-muted'}`}>{item.complete ? <Check size={16} /> : <Circle size={16} />} {item.label}</li>)}</ul>
          <div className="mt-5 flex flex-wrap gap-2"><button className={`${button} sb-primary-button`} onClick={() => patch({ status: draft.status === 'queued' ? 'practicing' : draft.status, next_action: suggestedAction })}><Play size={16} /> {draft.status === 'queued' ? 'Preparar mi sesión' : 'Sugerir siguiente paso'}</button>{!draft.personal_writeup.trim() && <button className={button} onClick={() => patch({ personal_writeup: studyWriteupTemplate(resource.title), status: draft.status === 'queued' ? 'documenting' : draft.status })}><BookOpen size={16} /> Crear estructura de writeup</button>}<button className={button} onClick={() => patch({ review_on: addStudyDays(today, 7), status: draft.status === 'learned' ? 'review' : draft.status })}><CalendarPlus size={16} /> Repasar en 7 días</button></div>
        </section>
        <ol className="my-6 list-decimal space-y-2 border-y border-border py-5 pl-5 text-sm leading-6"><li>Define qué quieres aprender y revisa los archivos.</li><li>Haz un intento y anota las hipótesis que funcionaron o fallaron.</li><li>Consulta la referencia si estás bloqueado y explica la solución con tus palabras.</li><li>Repite el procedimiento sin consultar la guía y programa un repaso.</li></ol>
        <fieldset disabled={saving} className="space-y-5">
          <label className="block text-sm font-semibold">Mi estado<select className={`${input} mt-2`} value={draft.status} onChange={event => patch({ status: event.target.value as StudyStatus })}>{Object.entries(STUDY_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
          <label className="block text-sm font-semibold">Siguiente acción concreta<input className={`${input} mt-2`} maxLength={500} value={draft.next_action} onChange={event => patch({ next_action: event.target.value })} placeholder="Ej.: identificar qué entrada controla el programa" /></label>
          <label className="block text-sm font-semibold">Mi writeup<textarea className={`${input} mt-2 min-h-80 font-mono leading-6`} maxLength={30000} value={draft.personal_writeup} onChange={event => patch({ personal_writeup: event.target.value })} placeholder={'## Objetivo\n¿Qué quiero entender?\n\n## Intentos y evidencias\n¿Qué probé y qué observé?\n\n## Método reproducible\n¿Qué pasos explican el resultado?\n\n## Lo que aprendí\n¿Qué haría diferente y cómo lo comprobaría?'} /></label>
          <label className="block text-sm font-semibold">Fecha de repaso<input type="date" className={`${input} mt-2`} value={draft.review_on || ''} onChange={event => patch({ review_on: event.target.value || null })} /></label>
          <div className="flex flex-wrap gap-3"><button className={`${button} sb-primary-button`} onClick={save} disabled={!dirty}>{saving ? 'Guardando…' : 'Guardar mi progreso'}</button><button className={button} onClick={exportDraft}><Download size={16} /> Exportar mi writeup</button>{dirty && <button className={button} onClick={() => { setDraft(lastSaved); setNotice('Cambios sin guardar descartados.'); setFailed(false); }}>Descartar cambios</button>}</div>
        </fieldset>
        {notice && <p role={failed ? 'alert' : 'status'} className={`mt-4 text-sm ${failed ? 'text-danger' : 'text-success'}`}>{notice}</p>}
      </article>
      <aside className="space-y-5"><section className="rounded-card border border-border bg-panel p-5"><h3 className="font-semibold">Archivos de práctica</h3><p className="my-3 text-xs leading-6 text-muted">Material original para un entorno de laboratorio. La importación no ejecutó los archivos.</p>{resource.archive_path && <button className={`${button} w-full`} disabled={fileBusy} onClick={() => download(resource.archive_path!)}><Download size={16} /> Descargar ZIP</button>}{resource.archive_parts.length > 0 && <><p className="mb-3 text-sm">ZIP dividido por tamaño. Descarga todas las partes y únelas en orden antes de extraerlo.</p>{resource.archive_parts.map((part, index) => <button key={part.path} className={`${button} mb-2 w-full`} disabled={fileBusy} onClick={() => download(part.path)}>Descargar parte {index + 1}/{resource.archive_parts.length}</button>)}<p className="mt-2 text-xs leading-6 text-muted">En WSL, en una carpeta que contenga solo estas partes:</p><pre className="mt-2 overflow-x-auto text-xs">{'cat *.zip.part-* > reto.zip\nsha256sum reto.zip'}</pre></>}
        <details className="mt-4 text-xs"><summary className="cursor-pointer">SHA-256 del ZIP original</summary><p className="mt-2 break-all font-mono">{resource.archive_sha256}</p></details></section>
        <section className="rounded-card border border-border bg-panel p-5"><BookOpen size={20} className="text-accent-text" /><h3 className="mt-3 font-semibold">Writeup de referencia</h3><p className="my-3 text-sm leading-6 text-muted">{resource.writeup_path ? 'Contiene spoilers y puede incluir la flag. Consultarlo no acredita una resolución. Comprueba los pasos en tu propio entorno.' : 'No se encontró una solución documentada. Usa tu writeup personal para construirla mientras practicas.'}</p>{resource.writeup_path && <button className={`${button} w-full`} disabled={fileBusy} onClick={reveal}>{fileBusy ? 'Cargando…' : 'Revelar solución de referencia'}</button>}</section>
        {resource.lab_slug && <Link className={button} to={`/lab/${resource.lab_slug}`}>Abrir laboratorio guiado <ArrowRight size={16} /></Link>}
        <p className="text-xs leading-6 text-muted"><RotateCcw size={16} className="mb-2" /> Marcar «Aprendido» expresa tu autoevaluación. No suma puntos ni sustituye una flag validada.</p>
        {referenceError && <p role="alert" className="text-sm text-danger">{referenceError}</p>}
      </aside>
    </div>
    {showReference && reference !== null && <section className="mt-6 min-w-0 rounded-card border border-border bg-panel p-5 sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Solución de referencia · {resource.title}</h2><button className={button} onClick={() => setShowReference(false)}>Ocultar solución</button></div><Suspense fallback={<p role="status">Preparando la solución…</p>}><WriteupRenderer content={reference} /></Suspense></section>}
  </>;
}
