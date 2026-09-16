import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Circle, Download, FileCheck2, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reportChecklist, renderNotebookReport } from '@/lib/labNotebook';
import type { LabEvidence, LabIndicator, LabNotebook, LabReport, LabSection } from '@/types/labWorkspace';

interface NotebookProps {
  notebook: LabNotebook;
  evidence: LabEvidence[];
  onChange: (update: (previous: LabNotebook) => LabNotebook) => void;
}

export function LabIndicators({ notebook, evidence, onChange, onContinue }: NotebookProps & { onContinue: () => void }) {
  const [draft, setDraft] = useState<Omit<LabIndicator, 'id'>>({ kind: 'ip', value: '', evidenceId: evidence[0]?.id || '', line: 1, interpretation: '' });
  const [feedback, setFeedback] = useState('');
  const add = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.value.trim() || draft.interpretation.trim().length < 15 || (evidence.length > 0 && !evidence.some(item => item.id === draft.evidenceId))) {
      setFeedback('Indica el valor, su archivo de origen y una explicación de al menos 15 caracteres.');
      return;
    }
    if (notebook.indicators.length >= 100) { setFeedback('Has alcanzado 100 hallazgos. Revisa o elimina uno antes de añadir otro.'); return; }
    onChange(previous => ({ ...previous, indicators: [...previous.indicators, { ...draft, value: draft.value.trim(), interpretation: draft.interpretation.trim(), id: crypto.randomUUID() }] }));
    setDraft(previous => ({ ...previous, value: '', interpretation: '' }));
    setFeedback('Hallazgo añadido al cuaderno. Su interpretación aún no ha sido evaluada.');
  };

  return <section className="lab-panel" aria-labelledby="indicators-title">
    <p className="lab-eyebrow">De la observación a la evidencia</p><h2 id="indicators-title" className="lab-title">Hallazgos e indicadores</h2>
    <p className="mt-3 text-sm leading-7 text-muted">Registra lo que has encontrado y explica por qué es relevante. Una IP o un nombre de equipo no implica actividad maliciosa: solo es un indicador de compromiso (IOC) cuando la evidencia sustenta esa interpretación.</p>
    <label htmlFor="lab-notes" className="mt-6 mb-2 block text-sm font-semibold">Notas de análisis</label>
    <textarea id="lab-notes" className="lab-input min-h-36" maxLength={10000} value={notebook.notes} onChange={event => onChange(previous => ({ ...previous, notes: event.target.value }))} placeholder="Escribe tus observaciones. Las citas que añadas desde Evidencias también aparecerán aquí." />
    <p className="mt-2 text-xs text-muted">Guardado local en este navegador. No escribas contraseñas ni información personal.</p>
    <form onSubmit={add} className="mt-6 rounded-lg border border-border bg-background p-4 sm:p-5">
      <h3 className="mb-4 text-base font-semibold">Añadir un hallazgo</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Tipo<select className="lab-input mt-2" value={draft.kind} onChange={event => setDraft(previous => ({ ...previous, kind: event.target.value as LabIndicator['kind'] }))}><option value="ip">Dirección IP</option><option value="host">Equipo</option><option value="domain">Dominio</option><option value="other">Otro</option></select></label>
        <label className="text-sm font-semibold">Valor observado<input required maxLength={500} className="lab-input mt-2 font-mono" value={draft.value} onChange={event => setDraft(previous => ({ ...previous, value: event.target.value }))} placeholder="Copia el dato exacto del registro" /></label>
        {evidence.length > 0 && <><label className="text-sm font-semibold">Archivo de origen<select required className="lab-input mt-2" value={draft.evidenceId} onChange={event => setDraft(previous => ({ ...previous, evidenceId: event.target.value }))}>{evidence.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><label className="text-sm font-semibold">Número de línea<input className="lab-input mt-2" type="number" min={1} max={100000} step={1} required value={draft.line} onChange={event => setDraft(previous => ({ ...previous, line: Number(event.target.value) }))} /></label></>}
      </div>
      <label className="mt-4 block text-sm font-semibold">Qué demuestra este dato<textarea required minLength={15} maxLength={2000} className="lab-input mt-2 min-h-28" value={draft.interpretation} onChange={event => setDraft(previous => ({ ...previous, interpretation: event.target.value }))} placeholder="Explica su relación con el objetivo y qué puedes concluir a partir de él." /></label>
      <button type="submit" className="lab-button lab-button-secondary mt-4"><Plus size={16} /> Añadir hallazgo</button><p role="status" className="mt-3 text-sm text-muted">{feedback}</p>
    </form>
    <h3 className="mt-6 text-base font-semibold">Tus hallazgos ({notebook.indicators.length})</h3>
    {!notebook.indicators.length ? <p className="mt-3 text-sm text-muted">Todavía no hay hallazgos. Empieza con un dato que puedas localizar en una evidencia.</p> : <ul className="mt-4 grid gap-3">{notebook.indicators.map(item => <li key={item.id} className="rounded-lg border border-border p-4"><div className="flex items-start justify-between gap-3"><p className="min-w-0 break-all font-mono text-sm text-info">{item.value}</p><button type="button" aria-label={`Eliminar hallazgo ${item.value}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-danger" onClick={() => onChange(previous => ({ ...previous, indicators: previous.indicators.filter(entry => entry.id !== item.id) }))}><Trash2 size={16} /></button></div><p className="mt-2 text-xs text-muted">{evidence.find(source => source.id === item.evidenceId)?.filename || 'Fuente documentada en las notas'}{item.evidenceId && ` · línea ${item.line}`}</p><p className="mt-3 whitespace-pre-wrap text-sm leading-7">{item.interpretation}</p></li>)}</ul>}
    <button type="button" onClick={onContinue} className="lab-button mt-6">Continuar al informe <ArrowRight size={16} /></button>
  </section>;
}

const reportFields: { key: keyof LabReport; label: string; help: string; minimum: number }[] = [
  { key: 'summary', label: 'Objetivo y alcance', help: '¿Qué pregunta tenías que responder y qué archivos revisaste?', minimum: 30 },
  { key: 'method', label: 'Método de análisis', help: 'Cuenta tus pasos en orden para que otra persona pueda repetirlos.', minimum: 30 },
  { key: 'conclusion', label: 'Conclusión', help: 'Responde al objetivo y cita los hallazgos que sostienen tu respuesta.', minimum: 30 },
  { key: 'limitations', label: 'Limitaciones', help: '¿Qué no puedes asegurar con los datos disponibles?', minimum: 15 },
  { key: 'nextSteps', label: 'Siguiente acción', help: '¿Qué comprobarías o recomendarías después?', minimum: 15 },
];

export function LabReportForm({ notebook, evidence, onChange, onContinue, onExport }: NotebookProps & { onContinue: () => void; onExport: () => void }) {
  const checklist = reportChecklist(notebook, evidence.map(item => item.id));
  return <section className="lab-panel" aria-labelledby="report-title"><p className="lab-eyebrow">Haz tu razonamiento reproducible</p><h2 id="report-title" className="lab-title">Informe de análisis</h2><p className="mt-3 text-sm leading-7 text-muted">El informe es tu borrador personal. Esta revisión comprueba que tenga estructura; no evalúa la exactitud de tus conclusiones ni concede puntos.</p>
    <div className="mt-6 grid gap-5">{reportFields.map(field => <div key={field.key}><label htmlFor={`report-${field.key}`} className="text-sm font-semibold">{field.label}</label><p id={`report-${field.key}-help`} className="mt-1 mb-2 text-sm leading-6 text-muted">{field.help}</p><textarea id={`report-${field.key}`} aria-describedby={`report-${field.key}-help`} className="lab-input min-h-32" maxLength={10000} value={notebook.report[field.key]} onChange={event => onChange(previous => ({ ...previous, report: { ...previous.report, [field.key]: event.target.value } }))} /><p className="mt-1 text-xs text-muted">{notebook.report[field.key].trim().length} caracteres · mínimo orientativo: {field.minimum}</p></div>)}</div>
    <ReportChecklist checklist={checklist} />
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={onExport} className="lab-button lab-button-secondary"><Download size={16} /> Exportar borrador (.md)</button><button type="button" onClick={onContinue} className="lab-button">Revisar resultado <ArrowRight size={16} /></button></div>
  </section>;
}

function ReportChecklist({ checklist }: { checklist: ReturnType<typeof reportChecklist> }) {
  return <div className="mt-6 rounded-lg border border-border bg-background p-4"><h3 className="text-sm font-semibold">Revisión de estructura</h3><ul className="mt-3 grid gap-2">{checklist.map(item => <li key={item.label} className="flex items-start gap-2 text-sm"><span className={item.complete ? 'text-success' : 'text-muted'} aria-hidden="true">{item.complete ? <Check size={17} /> : <Circle size={17} />}</span><span><span className="sr-only">{item.complete ? 'Completo: ' : 'Pendiente: '}</span>{item.label}</span></li>)}</ul></div>;
}

export function LabCompletion({ notebook, evidence, solved, points, onSelect, onExport }: { notebook: LabNotebook; evidence: LabEvidence[]; solved: boolean; points?: number; onSelect: (section: LabSection) => void; onExport: () => void }) {
  const checklist = reportChecklist(notebook, evidence.map(item => item.id));
  const reportReady = checklist.every(item => item.complete);
  return <section className="lab-panel" aria-labelledby="completion-title"><FileCheck2 size={28} className={solved ? 'text-success' : 'text-info'} /><h2 id="completion-title" className="lab-title mt-4">{solved ? 'Laboratorio resuelto' : 'Tu trabajo, paso a paso'}</h2><p className="mt-3 text-sm leading-7 text-muted">{solved ? 'La flag fue aceptada por el servidor y tu resultado se conserva en tu cuenta.' : 'La flag aún no tiene una validación registrada. Puedes seguir analizando las evidencias o volver a enviar tu respuesta.'}</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-lg border border-border bg-background p-4"><h3 className="text-sm font-semibold">Resultado del reto</h3><p className={`mt-2 text-sm ${solved ? 'text-success' : 'text-muted'}`}>{solved ? `Validado${points !== undefined ? ` · ${points} puntos obtenidos` : ''}` : 'Pendiente de validar la flag'}</p><button type="button" onClick={() => onSelect('questions')} className="mt-3 min-h-11 text-sm font-semibold text-accent-text">{solved ? 'Ver tareas' : 'Continuar el reto'}</button></div><div className="rounded-lg border border-border bg-background p-4"><h3 className="text-sm font-semibold">Informe personal</h3><p className="mt-2 text-sm text-muted">{reportReady ? 'Estructura completa · sin evaluación técnica' : 'Borrador en preparación'}</p><button type="button" onClick={() => onSelect('report')} className="mt-3 min-h-11 text-sm font-semibold text-accent-text">Revisar informe</button></div></div>
    <ReportChecklist checklist={checklist} /><p className="mt-4 text-xs leading-6 text-muted">Tus notas, hallazgos e informe se guardan solo en este navegador y para esta cuenta. Exporta una copia para conservarlos en otro dispositivo. Los marcadores de lectura no modifican tu puntuación.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={onExport} className="lab-button lab-button-secondary"><Download size={16} /> Exportar informe (.md)</button><Link to="/labs" className="lab-button">Explorar otro laboratorio <ArrowRight size={16} /></Link></div>
  </section>;
}

export function downloadNotebookReport(title: string, slug: string, notebook: LabNotebook, evidence: LabEvidence[], solved: boolean) {
  const blob = new Blob([renderNotebookReport(title, notebook, evidence, solved, new Date().toISOString())], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slug.replace(/[^a-zA-Z0-9_-]/g, '-')}-informe.md`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
