import { Activity, ArrowRight, CalendarDays, Clock3, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudyActivity } from '@/hooks/useStudyActivity';

const WEEKLY_GOAL = 150;

export function StudyActivitySummary() {
  const { hasAccess, loading, error, summary } = useStudyActivity();
  if (!hasAccess) return null;
  const maxDayMinutes = Math.max(1, ...summary.lastSevenDays.map(day => day.minutes));

  return <section className="mt-6 rounded-card border border-border bg-panel p-6" aria-labelledby="study-activity-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-text"><Activity className="h-4 w-4" /> Ritmo de práctica</p>
        <h2 id="study-activity-title" className="mt-3 text-xl font-semibold">Tu semana de estudio</h2>
        <p className="mt-2 text-sm leading-6 text-muted">La meta base es {WEEKLY_GOAL} minutos de práctica deliberada por semana.</p>
      </div>
      <Link to="/library" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-text">Abrir biblioteca <ArrowRight size={16} /></Link>
    </div>

    {error ? <p role="status" className="mt-5 rounded-control border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p> : <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-busy={loading}>
        <Metric icon={Clock3} label="Esta semana" value={loading ? '—' : `${summary.minutesThisWeek} min`} />
        <Metric icon={Target} label="Sesiones" value={loading ? '—' : String(summary.sessionsThisWeek)} />
        <Metric icon={CalendarDays} label="Días activos" value={loading ? '—' : String(summary.activeDaysThisWeek)} />
        <Metric icon={Flame} label="Racha actual" value={loading ? '—' : `${summary.currentStreak} ${summary.currentStreak === 1 ? 'día' : 'días'}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.65fr)]">
        <div>
          <div className="flex items-center justify-between text-xs"><span className="font-semibold">Meta semanal</span><span className="font-mono text-muted">{summary.weeklyGoalPercent}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated" role="progressbar" aria-label="Progreso de la meta semanal" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.weeklyGoalPercent}><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${summary.weeklyGoalPercent}%` }} /></div>
          <div className="mt-5 grid h-24 grid-cols-7 items-end gap-2" aria-label="Minutos estudiados durante los últimos siete días">
            {summary.lastSevenDays.map(day => <div key={day.day} className="flex h-full flex-col items-center justify-end gap-2" title={`${day.minutes} minutos`}><div className="w-full max-w-8 rounded-t bg-accent/75" style={{ height: `${day.minutes ? Math.max(12, Math.round((day.minutes / maxDayMinutes) * 64)) : 3}px` }} /><span className="text-[10px] uppercase text-muted">{day.label}</span></div>)}
          </div>
        </div>
        <div className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Último resultado</p>
          {loading ? <p className="mt-3 text-sm text-muted">Cargando actividad…</p> : summary.recentSession ? <><p className="mt-3 line-clamp-3 text-sm leading-6">{summary.recentSession.outcome}</p><p className="mt-3 text-xs text-muted">{summary.recentSession.duration_minutes} min · {new Date(summary.recentSession.started_at).toLocaleDateString()}</p></> : <p className="mt-3 text-sm leading-6 text-muted">Completa tu primer bloque en la biblioteca. Su resultado aparecerá aquí.</p>}
        </div>
      </div>
    </>}
  </section>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) {
  return <div className="rounded-control border border-border bg-background/45 p-4"><Icon className="h-4 w-4 text-accent-text" /><p className="mt-3 text-xs text-muted">{label}</p><p className="mt-1 font-mono text-lg font-semibold">{value}</p></div>;
}
