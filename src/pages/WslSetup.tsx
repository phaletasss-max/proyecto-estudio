import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Clipboard, Info, ShieldAlert, Terminal } from 'lucide-react';
import { WSL_SETUP_STEPS } from '@/data/wslSetup';

const STORAGE_KEY = 'shadowbytes_wsl_setup_v1';

export const WslSetup: React.FC = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[]); } catch { return new Set(); }
  });
  const [expanded, setExpanded] = useState(WSL_SETUP_STEPS[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])), [completed]);
  const percent = useMemo(() => Math.round((completed.size / WSL_SETUP_STEPS.length) * 100), [completed]);

  const copyCommand = async (id: string, command: string) => {
    await navigator.clipboard.writeText(command);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section className="min-h-screen bg-[#07090f] pb-20 pt-28 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-slate-800 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Preparación del entorno</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Configura WSL 2 antes de practicar.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">Una guía verificable para Windows 10/11, Ubuntu o Kali y conexiones OpenVPN autorizadas. Tu avance se guarda en este navegador.</p>
        </header>

        <div className="mt-8 grid gap-7 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border border-slate-800 bg-[#0d111a] p-5 lg:sticky lg:top-28">
            <div className="flex items-end justify-between"><p className="text-sm font-bold">Progreso</p><strong className="text-2xl text-white">{percent}%</strong></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><span className="block h-full bg-violet-500" style={{ width: `${percent}%` }} /></div>
            <p className="mt-3 text-xs leading-5 text-slate-500">{completed.size} de {WSL_SETUP_STEPS.length} pasos marcados.</p>
            <nav className="mt-5 space-y-1" aria-label="Índice de preparación WSL">
              {WSL_SETUP_STEPS.map((step, index) => <button key={step.id} type="button" onClick={() => { setExpanded(step.id); document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-2 text-left text-xs ${completed.has(step.id) ? 'text-emerald-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><span className="w-5 text-center">{completed.has(step.id) ? <Check className="h-4 w-4" /> : index + 1}</span><span className="truncate">{step.title}</span></button>)}
            </nav>
          </aside>

          <div className="space-y-3">
            {WSL_SETUP_STEPS.map((step, index) => {
              const isOpen = expanded === step.id;
              const isDone = completed.has(step.id);
              return <article id={step.id} key={step.id} className="scroll-mt-28 overflow-hidden rounded-xl border border-slate-800 bg-[#0d111a]">
                <button type="button" onClick={() => setExpanded(isOpen ? '' : step.id)} aria-expanded={isOpen} className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-800/50">
                  <span className="flex items-center gap-4"><span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{isDone ? <Check className="h-4 w-4" /> : index + 1}</span><span><strong className="block text-sm text-white">{step.title}</strong><small className="mt-1 block text-xs text-cyan-300">{step.place}</small></span></span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className="border-t border-slate-800 p-5">
                  {step.command && <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-700 bg-[#07090f]"><code className="min-w-0 flex-1 overflow-x-auto p-3 font-mono text-sm text-slate-200">{step.command}</code><button type="button" onClick={() => void copyCommand(step.id, step.command!)} className="min-h-11 border-l border-slate-700 px-3 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label={`Copiar comando de ${step.title}`}><Clipboard className="h-4 w-4" /></button></div>}
                  <div className="mt-5 grid gap-4 sm:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-wide text-emerald-300">Resultado esperado</p><p className="mt-2 text-sm leading-6 text-slate-400">{step.expected}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-amber-300">Error frecuente</p><p className="mt-2 text-sm leading-6 text-slate-400">{step.commonError}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-cyan-300">Cómo resolverlo</p><p className="mt-2 text-sm leading-6 text-slate-400">{step.solution}</p></div></div>
                  {step.warning && <p className="mt-5 flex gap-2 rounded-lg border border-rose-400/20 bg-rose-400/5 p-3 text-sm leading-6 text-rose-200"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> {step.warning}</p>}
                  <div className="mt-5 flex items-center justify-between gap-3"><p aria-live="polite" className="text-xs text-slate-500">{copied === step.id ? 'Comando copiado.' : <><Info className="mr-1 inline h-3.5 w-3.5" /> Ejecuta comandos solo en tu propio equipo.</>}</p><button type="button" onClick={() => setCompleted((current) => { const next = new Set(current); isDone ? next.delete(step.id) : next.add(step.id); return next; })} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold ${isDone ? 'border border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-violet-600 text-white hover:bg-violet-500'}`}><Check className="h-4 w-4" /> {isDone ? 'Desmarcar' : 'Marcar completado'}</button></div>
                </div>}
              </article>;
            })}
            <div className="flex gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5"><Terminal className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><div><h2 className="font-bold text-white">Preparación final</h2><p className="mt-1 text-sm leading-6 text-slate-400">Cuando completes los 17 pasos, abre una ruta Fundamental y comienza por un laboratorio marcado como disponible.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WslSetup;
