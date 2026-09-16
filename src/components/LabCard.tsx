import { ArrowRight, Clock3, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentIcon } from '@/components/ContentIcon';
import { Badge, Card } from '@/components/ui/Primitives';
import { CATEGORY_ICONS, type CTFLab, type Difficulty } from '@/types/ctf';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  Easy: 'Inicial', Medium: 'Intermedio', Hard: 'Avanzado', Insane: 'Experto',
};
const tones = { Easy: 'success', Medium: 'info', Hard: 'warning', Insane: 'danger' } as const;
const defaultPoints: Record<Difficulty, number> = { Easy: 100, Medium: 250, Hard: 500, Insane: 1000 };

export function LabCard({ lab }: { lab: CTFLab }) {
  const points = lab.points ?? defaultPoints[lab.difficulty];
  return <Link to={`/lab/${lab.slug}`} className="group block h-full rounded-card" aria-label={`Abrir laboratorio: ${lab.title}`}>
    <Card className="flex h-full flex-col p-5 transition-colors group-hover:border-accent group-focus-visible:border-accent sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge tone={tones[lab.difficulty]}>{DIFFICULTY_LABELS[lab.difficulty]}</Badge>
        <Badge><ContentIcon name={CATEGORY_ICONS[lab.category]} />{lab.category}</Badge>
        {lab.is_members_only && !lab.is_admission_challenge && <Badge><LockKeyhole size={12} />Miembros</Badge>}
      </div>
      <h3 className="text-lg font-semibold leading-7 tracking-tight text-foreground group-hover:text-accent-text">{lab.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{lab.description}</p>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
        <span>{points} puntos base</span>
        {lab.estimatedMinutes && <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />{lab.estimatedMinutes} min aprox.</span>}
      </div>
      {(lab.tags.length > 0 || lab.framework) && <div className="mt-4 flex flex-wrap gap-2">
        {[...new Set([...(lab.framework ? [lab.framework] : []), ...lab.tags])].slice(0, 3).map((tag) => <span key={tag} className="text-xs text-muted">#{tag}</span>)}
      </div>}
      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-xs">
          <span className="truncate text-muted">{lab.author}</span>
          <span className="inline-flex shrink-0 items-center gap-2 font-semibold text-accent-text">Abrir laboratorio <ArrowRight size={15} /></span>
        </div>
      </div>
    </Card>
  </Link>;
}
