import { Check, FileSearch, Flag, Network, NotebookPen, ScanLine, ScrollText, Target } from 'lucide-react';
import type { LabSection } from '@/types/labWorkspace';

export const LAB_SECTIONS = [
  { id: 'briefing', title: 'Entender el caso', icon: Target },
  { id: 'topology', title: 'Mapa de la red', icon: Network },
  { id: 'evidence', title: 'Leer evidencias', icon: FileSearch },
  { id: 'questions', title: 'Resolver el reto', icon: ScanLine },
  { id: 'indicators', title: 'Registrar hallazgos', icon: NotebookPen },
  { id: 'report', title: 'Redactar informe', icon: ScrollText },
  { id: 'completion', title: 'Revisar resultado', icon: Flag },
] satisfies { id: LabSection; title: string; icon: typeof Check }[];

export function LabSidebar({ active, available, reviewed, solved, onSelect }: {
  active: LabSection; available: LabSection[]; reviewed: LabSection[]; solved: boolean; onSelect: (id: LabSection) => void;
}) {
  const steps = LAB_SECTIONS.filter(section => available.includes(section.id));
  return <nav aria-label="Pasos del laboratorio" className="lab-sidebar">
    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Mesa de análisis</p>
    <ol className="grid gap-1.5">
      {steps.map((step, index) => {
        const marked = step.id === 'questions' || step.id === 'completion' ? solved : reviewed.includes(step.id);
        const Icon = step.icon;
        return <li key={step.id}><button type="button" onClick={() => onSelect(step.id)} aria-current={active === step.id ? 'step' : undefined} className="lab-step">
          <span className={`lab-step-number ${marked ? 'text-success' : 'text-muted'}`} aria-hidden="true">{marked ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span>
          <span className="flex-1">{step.title}<span className="sr-only">{marked ? ' · revisado' : ''}</span></span><Icon size={15} aria-hidden="true" />
        </button></li>;
      })}
    </ol>
    <p className="mt-4 text-xs leading-6 text-muted">Avanza a tu ritmo. Los marcadores de lectura son locales; la flag acredita el laboratorio.</p>
  </nav>;
}
