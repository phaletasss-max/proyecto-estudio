import { useState } from 'react';
import type { LearningModule } from '@/types/auth';

export function KnowledgeCheck({ check }: { check: NonNullable<LearningModule['knowledgeCheck']> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  return <section className="sb-workspace mt-6 rounded-lg border border-slate-700 p-6" aria-labelledby="knowledge-title">
    <h2 id="knowledge-title" className="text-lg font-semibold">Comprueba lo que entendiste</h2>
    <p className="mt-2 text-sm text-slate-400">Esta práctica es local, puedes repetirla y no otorga puntos CTF.</p>
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <fieldset className="mt-5"><legend className="text-sm font-medium">{check.question}</legend><div className="mt-3 space-y-2">{check.choices.map((choice, index) => <label key={choice} className="flex min-h-12 cursor-pointer items-center gap-3 rounded border border-slate-600 p-3 text-sm"><input type="radio" name="knowledge-answer" checked={selected === index} onChange={() => { setSelected(index); setSubmitted(false); }} />{choice}</label>)}</div></fieldset>
      <button type="submit" disabled={selected === null} className="sb-button sb-button-primary mt-4 disabled:opacity-40">Comprobar respuesta</button>
      <div role="status" className="mt-4 text-sm leading-7">{submitted && (selected === check.correctIndex ? <p>Correcto. {check.explanation}</p> : <p>Revisa el ejemplo del paso a paso e inténtalo de nuevo. No pierdes puntos.</p>)}</div>
    </form>
  </section>;
}
