import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Search, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { LabCustodyEvent, LabEvidence, LabWorkspaceDefinition } from '@/types/labWorkspace';

interface Props {
  workspace: LabWorkspaceDefinition;
  authenticated: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onVerified: (event: LabCustodyEvent) => void;
  onCite: (evidence: LabEvidence, line: number, content: string) => void;
}

export function EvidencePanel({ workspace, authenticated, selectedId, onSelect, onVerified, onCite }: Props) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; text: string; error: string }>({ status: 'idle', text: '', error: '' });
  const [retry, setRetry] = useState(0);
  const [citation, setCitation] = useState('');
  const onVerifiedRef = useRef(onVerified);
  onVerifiedRef.current = onVerified;
  const selected = workspace.evidence.find(item => item.id === selectedId);

  useEffect(() => {
    setQuery(''); setCitation('');
    if (!selected || !authenticated || !isSupabaseConfigured()) { setState({ status: 'idle', text: '', error: '' }); return; }
    let active = true;
    setState({ status: 'loading', text: '', error: '' });
    void (async () => {
      try {
        const { data, error } = await supabase.storage.from('ctf-zips').download(selected.storagePath);
        if (error || !data) throw new Error('No se pudo abrir el archivo. Comprueba tu sesión y vuelve a intentarlo.');
        if (data.size !== selected.byteLength || data.size > 100000) throw new Error('El tamaño no coincide con la evidencia original. No se mostrará una copia diferente.');
        const bytes = await data.arrayBuffer();
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(byte => byte.toString(16).padStart(2, '0')).join('');
        if (digest !== selected.sha256) throw new Error('La huella SHA-256 no coincide. No se mostrará una copia diferente del archivo original.');
        const content = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        if (!active) return;
        setState({ status: 'ready', text: content, error: '' });
        onVerifiedRef.current({ evidenceId: selected.id, observedAt: new Date().toISOString(), sha256: digest, verified: true });
      } catch (error) {
        if (active) setState({ status: 'error', text: '', error: error instanceof Error ? error.message : 'No se pudo verificar el archivo. Inténtalo nuevamente.' });
      }
    })();
    return () => { active = false; };
  }, [selected, authenticated, retry]);

  const lines = state.text.split(/\r?\n/).map((content, index) => ({ content, number: index + 1 })).filter(line => !query || line.content.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <section className="lab-panel" aria-labelledby="evidence-title">
    <p className="lab-eyebrow">Observa antes de concluir</p><h2 id="evidence-title" className="lab-title">Evidencias del caso</h2>
    <p className="mt-3 text-sm leading-7 text-muted">Abre un registro, busca un término y usa el número de línea para citarlo en tus notas. Solo se leen archivos de texto; no se ejecutan comandos.</p>
    <div className="my-5 grid gap-2 sm:grid-cols-3">{workspace.evidence.map(item => <button type="button" key={item.id} onClick={() => onSelect(item.id)} aria-pressed={selectedId === item.id} className="lab-evidence-choice"><FileText size={17} /><span className="font-semibold">{item.title}<small className="mt-1 block font-normal text-muted">{(item.byteLength / 1024).toFixed(1)} KB · TXT</small></span></button>)}</div>
    {!authenticated ? <div className="rounded-lg border border-border bg-background p-5"><h3 className="font-semibold">Inicia sesión para abrir las evidencias</h3><p className="mt-2 text-sm leading-7 text-muted">Usa «Ingresar» en la navegación. Podrás analizar los registros aquí y guardar las respuestas del reto.</p></div> : !selected ? <p className="text-sm text-muted">Selecciona un archivo para comenzar.</p> : <>
      <h3 className="text-base font-semibold">{selected.title}</h3><p className="mt-1 text-sm leading-6 text-muted">{selected.description}</p>
      <p className="mt-2 break-all font-mono text-xs text-muted">{selected.filename}</p>
      {state.status === 'loading' && <p role="status" className="py-8 text-sm text-muted">Abriendo y verificando la integridad del archivo…</p>}
      {state.status === 'error' && <div role="alert" className="mt-4 rounded-lg border border-danger/30 p-4"><p className="text-sm text-danger">{state.error}</p><button type="button" onClick={() => setRetry(value => value + 1)} className="lab-button lab-button-secondary mt-3">Reintentar lectura</button></div>}
      {state.status === 'ready' && <>
        <div className="mt-4 flex items-center gap-2 text-xs text-success"><ShieldCheck size={15} /> Integridad verificada contra la copia original</div>
        <label htmlFor="evidence-search" className="mt-5 mb-2 block text-sm font-semibold">Buscar en este archivo</label>
        <div className="relative"><Search size={16} className="absolute left-3 top-3.5 text-muted" /><input id="evidence-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Por ejemplo: default, DNS o interfaz" className="lab-input pl-10" /></div>
        <p className="my-2 text-xs text-muted" aria-live="polite">{query ? `${lines.length} líneas coincidentes` : `${lines.length} líneas · Pulsa un número para añadir la cita a tus notas`}</p>
        <div className="lab-log-viewer" role="region" aria-label={`Contenido de ${selected.filename}`} tabIndex={0}>
          {lines.map(line => <div key={line.number} className="lab-log-line"><button type="button" title={`Citar línea ${line.number}`} aria-label={`Añadir línea ${line.number} a mis notas`} onClick={() => { onCite(selected, line.number, line.content); setCitation(`Línea ${line.number} añadida a tus notas de hallazgos.`); }}>{line.number}</button><code>{line.content || ' '}</code></div>)}
          {!lines.length && <p className="p-5 text-sm text-muted">Sin coincidencias. Prueba con otra palabra o borra la búsqueda.</p>}
        </div>
        <p role="status" className="mt-2 min-h-6 text-xs text-info">{citation}</p>
      </>}
    </>}
    <details className="mt-5 rounded-lg border border-border p-4"><summary className="cursor-pointer text-sm font-semibold">Procedencia e integridad de los archivos</summary><p className="mt-3 text-sm leading-7 text-muted">{workspace.source.note}</p><p className="mt-2 text-sm">{workspace.source.label}</p><p className="mt-1 break-all font-mono text-xs text-muted">{workspace.source.archive}<br />SHA-256: {workspace.source.sha256}</p></details>
  </section>;
}

export function ChainOfCustody({ evidence, events }: { evidence: LabEvidence[]; events: LabCustodyEvent[] }) {
  return <section className="lab-panel mt-5" aria-labelledby="custody-title"><h2 id="custody-title" className="text-base font-semibold">Registro de integridad y consulta</h2><p className="mt-2 text-sm leading-7 text-muted">Registra cuándo este navegador verificó cada archivo. Es un registro personal editable en el dispositivo, no una cadena de custodia certificada.</p>
    {!events.length ? <p className="mt-4 text-sm text-muted">Al abrir una evidencia, aparecerá aquí la comprobación de su huella digital.</p> : <ol className="mt-4 grid gap-3">{events.map((event, index) => <li key={`${event.evidenceId}-${event.observedAt}-${index}`} className="rounded-lg border border-border bg-background p-4"><p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 size={15} className="text-success" /> {evidence.find(item => item.id === event.evidenceId)?.title || event.evidenceId}</p><p className="mt-2 text-xs text-muted">Lectura verificada · <time dateTime={event.observedAt}>{new Date(event.observedAt).toLocaleString('es-PE')}</time></p><p className="mt-2 break-all font-mono text-[11px] text-muted">SHA-256 {event.sha256}</p></li>)}</ol>}
  </section>;
}
