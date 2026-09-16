import { ArrowRight, Clock3, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStudyLibrary } from '@/hooks/useStudyLibrary';
import { localStudyDate, prioritizeStudy, studyPlanReason, suggestedSessionMinutes, suggestedStudyAction } from '@/lib/study';
import { STUDY_STATUSES } from '@/types/study';

const steps = ['Ahora', 'Después', 'Luego'];

export function StudyNextSession() {
  const { user } = useAuth();
  const { resources, progress, loading, error } = useStudyLibrary();
  if (!user || !['member', 'admin'].includes(user.accessStatus)) return null;

  const today = localStudyDate();
  const progressByResource = new Map(progress.map(item => [item.resource_id, item]));
  const plan = prioritizeStudy(resources, progress, today).slice(0, 3);

  return <section className="mt-6 rounded-card border border-border bg-panel p-6" aria-labelledby="study-plan-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-text"><ListChecks className="h-4 w-4" /> Plan de práctica</p>
        <h2 id="study-plan-title" className="mt-3 text-xl font-semibold">Tus próximos tres movimientos</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Primero los repasos vencidos y el trabajo en curso; después, el material que ofrece una entrada más clara.</p>
      </div>
      <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-text" to="/library">Ver toda la biblioteca <ArrowRight size={16} /></Link>
    </div>

    {loading ? <p role="status" className="mt-6 text-sm text-muted">Preparando tu plan de estudio…</p>
      : error ? <p role="status" className="mt-6 rounded-control border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p>
      : !plan.length ? <p className="mt-6 text-sm text-muted">La biblioteca todavía no tiene materiales disponibles.</p>
      : <ol className="mt-6 grid gap-3 lg:grid-cols-3">
        {plan.map((resource, index) => {
          const current = progressByResource.get(resource.id);
          const status = current?.status || 'queued';
          const nextAction = current?.next_action || suggestedStudyAction(resource, { status });
          return <li key={resource.id} className={`flex min-w-0 flex-col rounded-card border p-5 ${index === 0 ? 'border-accent/70 bg-accent/5' : 'border-border bg-background/35'}`}>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold uppercase tracking-wider text-accent-text">{steps[index]}</span>
              <span className="text-muted">{STUDY_STATUSES[status]}</span>
            </div>
            <h3 className="mt-4 line-clamp-2 text-lg font-semibold">{resource.title}</h3>
            <p className="mt-2 text-xs font-semibold text-warning">{studyPlanReason(resource, current, today)}</p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{nextAction}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="flex items-center gap-1 text-xs text-muted"><Clock3 size={14} /> {suggestedSessionMinutes(current)} min</span>
              <Link className={`inline-flex min-h-10 items-center gap-2 rounded-control px-3 text-sm font-semibold ${index === 0 ? 'sb-primary-button' : 'text-accent-text'}`} to={`/library?resource=${resource.id}`}>{index === 0 ? 'Empezar' : 'Abrir'} <ArrowRight size={15} /></Link>
            </div>
          </li>;
        })}
      </ol>}
  </section>;
}
