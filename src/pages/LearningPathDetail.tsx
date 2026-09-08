import { ArrowLeft, ArrowRight, BookOpen, Clock3, FlaskConical, LockKeyhole } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LEARNING_PATHS } from '@/data/learningPaths';

import { useAuth } from '@/context/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { pathProgress } from '@/lib/learningProgress';

export default function LearningPathDetail() {
  const { user } = useAuth();
  const learning = useLearningProgress();
  const { slug } = useParams<{ slug: string }>();
  const path = LEARNING_PATHS.find((item) => item.slug === slug);

  if (!path) {
    return <section className="min-h-screen bg-[#07090f] px-4 pb-20 pt-32 text-center text-white"><h1 className="text-3xl font-bold">Ruta no encontrada</h1><Link className="mt-6 inline-flex text-purple-400" to="/paths">Volver a rutas</Link></section>;
  }

  const progress = pathProgress(path, learning.completedLessons, user?.solvedLabs.map((solve) => solve.labSlug) ?? []);

  return (
    <section className="min-h-screen bg-[#07090f] pb-20 pt-28 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link to="/paths" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Todas las rutas</Link>
        <header className="mt-5 border border-[#222a39] bg-[#0d111a] p-6 sm:p-9">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">{path.level} · {path.estimatedHours} horas</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{path.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">{path.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{path.tags.map((tag) => <span key={tag} className="border border-[#222a39] bg-[#121826] px-3 py-1 font-mono text-xs text-slate-300">{tag}</span>)}</div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => learning.selectPath(path)} disabled={learning.activePath === path.slug} className="min-h-11 bg-purple-600 px-4 text-sm font-bold disabled:bg-emerald-800">{learning.activePath === path.slug ? 'Tu ruta activa' : 'Elegir esta ruta'}</button>
            <span className="text-sm text-slate-300">{progress.completed} de {progress.available.length} módulos disponibles completados · {progress.percent}%</span>
          </div>
          <p role="status" className="mt-3 text-xs text-slate-400">{learning.error || 'Ruta y lecturas guardadas en este navegador. Los labs requieren validación del servidor.'}</p>
        </header>

        <ol className="mt-6 space-y-3">
          {path.modules.map((module, index) => {
            const unavailable = module.status === 'coming_soon';
            const href = module.labSlug ? `/lab/${module.labSlug}` : `/learn/${path.slug}/${module.id}`;
            return (
              <li key={module.id} className="grid gap-4 border border-[#222a39] bg-[#0d111a] p-5 sm:grid-cols-[44px_1fr_auto] sm:items-center">
                <span className="flex h-10 w-10 items-center justify-center border border-[#222a39] bg-[#121826] font-mono text-sm font-bold text-purple-300">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-400">{module.type === 'lab' ? <FlaskConical className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}{module.type}</span><span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{module.durationMinutes} min</span></div>
                  <h2 className="mt-2 font-bold">{module.title}{progress.isComplete(module) && <span className="ml-2 text-xs text-emerald-400">Completado</span>}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{module.description}</p>
                </div>
                {unavailable ? <span className="inline-flex min-h-10 items-center gap-2 border border-amber-500/30 px-3 text-xs font-bold text-amber-300"><LockKeyhole className="h-4 w-4" /> Próximamente</span> : <Link to={href} className="inline-flex min-h-11 items-center justify-center gap-2 bg-purple-600 px-4 text-sm font-bold hover:bg-purple-500">Abrir <ArrowRight className="h-4 w-4" /></Link>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
