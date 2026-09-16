import { ArrowRight, FileText, Globe, Network, Monitor, Server } from 'lucide-react';
import type { CTFLab } from '@/types/ctf';
import type { LabWorkspaceDefinition } from '@/types/labWorkspace';

export function LabBriefing({ lab, workspace, onContinue }: { lab: CTFLab; workspace?: LabWorkspaceDefinition; onContinue: () => void }) {
  return <section className="lab-panel" aria-labelledby="briefing-title">
    <p className="lab-eyebrow">Primero, entiende el objetivo</p>
    <h2 id="briefing-title" className="lab-title">Tu misión</h2>
    <p className="mt-4 text-base leading-7">{workspace?.objective || lab.description}</p>
    {workspace && <p className="mt-4 text-sm leading-7 text-muted">{workspace.context}</p>}
    <div className="my-6 rounded-lg border border-border bg-background p-4">
      <h3 className="text-sm font-semibold">Qué vas a entregar</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{workspace?.deliverable || 'Resuelve las actividades disponibles y envía la flag en el formato indicado. Puedes documentar tu razonamiento en el informe personal.'}</p>
    </div>
    <h3 className="text-sm font-semibold">Antes de comenzar</h3>
    <ul className="mt-3 space-y-2 pl-5 text-sm leading-7 text-muted list-disc">
      {(workspace?.prerequisites || ['Lee todas las instrucciones antes de enviar una respuesta.', 'Las pistas indican su coste antes de revelarse. Los puntos se acreditan una sola vez al resolver la flag.']).map(item => <li key={item}>{item}</li>)}
    </ul>
    {workspace && <details className="mt-6 rounded-lg border border-border p-4">
      <summary className="min-h-6 cursor-pointer text-sm font-semibold">Conceptos, explicados desde cero</summary>
      <dl className="mt-4 grid gap-4">{workspace.glossary.map(item => <div key={item.term}><dt className="text-sm font-semibold text-info">{item.term}</dt><dd className="mt-1 text-sm leading-7 text-muted">{item.meaning}</dd></div>)}</dl>
    </details>}
    <button type="button" onClick={onContinue} className="lab-button mt-6">Entendido, continuar <ArrowRight size={16} /></button>
  </section>;
}

export function LabTopology({ workspace, onEvidence, onContinue }: { workspace: LabWorkspaceDefinition; onEvidence: (id: string) => void; onContinue: () => void }) {
  const icons = { client: Monitor, server: Server, gateway: Network, internet: Globe };
  return <section className="lab-panel" aria-labelledby="topology-title">
    <p className="lab-eyebrow">Ubica las piezas</p><h2 id="topology-title" className="lab-title">Mapa de la red</h2>
    <p className="mt-3 text-sm leading-7 text-muted">{workspace.topology.caption}</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {workspace.topology.nodes.map(node => { const Icon = icons[node.id as keyof typeof icons] || Network; return <article key={node.id} className="rounded-lg border border-border bg-background p-4">
        <Icon size={22} className="mb-4 text-info" /><h3 className="font-semibold">{node.title}</h3><p className="mt-1 text-sm text-muted">{node.role}</p>
        {node.evidenceId && <button type="button" onClick={() => onEvidence(node.evidenceId!)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-text"><FileText size={15} /> Abrir registro</button>}
      </article>; })}
    </div>
    <h3 className="mt-6 text-sm font-semibold">Relaciones por comprobar</h3>
    <ul className="mt-3 grid gap-3">{workspace.topology.links.map(link => <li key={`${link.from}-${link.to}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm"><span>{workspace.topology.nodes.find(node => node.id === link.from)?.title}</span><ArrowRight size={14} className="text-info" aria-label="hacia" /><span>{workspace.topology.nodes.find(node => node.id === link.to)?.title}</span><span className="ml-auto text-xs text-muted">{link.label}</span></li>)}</ul>
    <button type="button" onClick={onContinue} className="lab-button mt-6">Revisado, leer evidencias <ArrowRight size={16} /></button>
  </section>;
}
