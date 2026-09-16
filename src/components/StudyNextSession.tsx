import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStudyLibrary } from '@/hooks/useStudyLibrary';
import { localStudyDate, prioritizeStudy } from '@/lib/study';

export function StudyNextSession() {
  const { user } = useAuth();
  const { resources, progress, loading, error } = useStudyLibrary();
  const resource = prioritizeStudy(resources, progress, localStudyDate())[0];
  const current = progress.find(item => item.resource_id === resource?.id);
  if (!user || !['member', 'admin'].includes(user.accessStatus)) return null;
  return <section className="mt-6 rounded-card border border-border bg-panel p-6"><p className="text-xs uppercase tracking-wider text-accent-text">Retoma tu práctica</p><h2 className="mt-3 text-xl font-semibold">{loading ? 'Cargando tu mesa de estudio…' : resource?.title || 'Organiza tu biblioteca'}</h2><p className="mt-3 text-sm leading-6 text-muted">{error || current?.next_action || resource?.objective || 'Máquinas, ejercicios, ZIP y writeups con tu siguiente acción y fecha de repaso.'}</p><Link className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-text" to={resource ? `/library?resource=${resource.id}` : '/library'}>Abrir biblioteca <ArrowRight size={16} /></Link></section>;
}
