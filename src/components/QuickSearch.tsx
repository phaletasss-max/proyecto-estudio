import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { moduleHref, searchContent, type SearchEntry } from '@/lib/learningProgress';

const entries: SearchEntry[] = [
  { title: 'Preparar el entorno WSL', detail: 'Windows Linux Kali Ubuntu VPN', href: '/setup/wsl', kind: 'Herramienta' },
  { title: 'Referencia de comandos', detail: 'Cheatsheets terminal PowerShell Linux SQL', href: '/cheatsheets', kind: 'Referencia' },
  { title: 'CTF de acceso', detail: 'Membresía y admisión', href: '/admission', kind: 'Comunidad' },
  { title: 'Catálogo de laboratorios', detail: 'Retos publicados y filtros', href: '/labs', kind: 'Catálogo' },
  ...LEARNING_PATHS.flatMap((path) => [
    { title: path.title, detail: path.tags.join(' '), href: `/paths/${path.slug}`, kind: 'Ruta' },
    ...path.modules.flatMap((module) => {
      const href = moduleHref(path, module);
      return href ? [{ title: module.title, detail: path.title, href, kind: module.labSlug ? 'Laboratorio' : 'Lección' }] : [];
    }),
  ]),
];

export default function QuickSearch({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchContent(entries, query), [query]);
  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => { element.close(); previousFocus?.focus(); };
  }, []);

  return <dialog ref={dialog} className="sb-search sb-workspace" aria-labelledby="search-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="sb-search-head"><Search size={20} /><label id="search-title" htmlFor="quick-search-input" className="sr-only">Buscar en ShadowBytes</label><input id="quick-search-input" autoFocus type="search" placeholder="Rutas, laboratorios, comandos…" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" /><button type="button" onClick={onClose} aria-label="Cerrar búsqueda"><X size={19} /></button></div>
    <div className="sb-search-summary" role="status">{query ? `${results.length} resultados` : 'Accesos y contenido disponible'}</div>
    <ul className="sb-search-results">{results.map((entry) => <li key={`${entry.kind}:${entry.href}`}><Link to={entry.href} onClick={onClose}><div><span className="sb-meta">{entry.kind}</span><strong>{entry.title}</strong><p>{entry.detail}</p></div><ArrowUpRight size={17} /></Link></li>)}</ul>
    {!results.length && <p className="sb-search-empty">No encontramos coincidencias. Prueba con Linux, redes, Windows o metodología.</p>}
    <div className="sb-search-bottom"><span><kbd>Tab</kbd> recorrer · <kbd>Enter</kbd> abrir</span><span><kbd>Esc</kbd> cerrar</span></div>
  </dialog>;
}
