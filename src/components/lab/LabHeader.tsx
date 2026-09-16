import { ArrowLeft, CheckCircle2, Clock, Download, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import type { CTFLab } from '@/types/ctf';

interface Props {
  lab: CTFLab;
  solved: boolean;
  authenticated: boolean;
  downloadState: 'idle' | 'loading' | 'error';
  onDownload: () => void;
}

export function LabHeader({ lab, solved, authenticated, downloadState, onDownload }: Props) {
  return <header className="rounded-xl border border-border bg-panel p-5 sm:p-7">
    <Link to="/labs" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-foreground"><ArrowLeft size={16} /> Catálogo de laboratorios</Link>
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
      <DifficultyBadge difficulty={lab.difficulty} />
      <span className="rounded-md border border-border px-2.5 py-1 text-muted">{lab.category}</span>
      {lab.is_admission_challenge && <span className="rounded-md border border-border px-2.5 py-1 text-accent-text">Reto de acceso</span>}
      {solved && <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 px-2.5 py-1 text-success"><CheckCircle2 size={14} /> Resuelto · validado por el servidor</span>}
    </div>
    <h1 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{lab.title}</h1>
    <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{lab.description}</p>
    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted">
      <span className="inline-flex items-center gap-2"><User size={14} /> {lab.author}</span>
      <span className="inline-flex items-center gap-2"><Clock size={14} /> Aproximadamente {lab.estimatedMinutes || 60} min</span>
      <span>Hasta {lab.points ?? 100} puntos</span>
      {lab.framework && <span>{lab.framework}</span>}
    </div>
    {lab.zip_url && <div className="mt-5">
      <button type="button" onClick={onDownload} disabled={!authenticated || downloadState === 'loading'} className="lab-button lab-button-secondary"><Download size={16} /> {downloadState === 'loading' ? 'Preparando descarga…' : 'Descargar paquete de evidencias'}</button>
      {!authenticated && <p className="mt-2 flex items-center gap-2 text-xs text-muted"><Lock size={12} /> Inicia sesión para descargar los archivos.</p>}
      {downloadState === 'error' && <p className="mt-2 text-sm text-danger" role="alert">No se pudo autorizar la descarga. Comprueba tu sesión e inténtalo nuevamente.</p>}
    </div>}
  </header>;
}
