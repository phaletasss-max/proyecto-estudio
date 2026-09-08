import { ArrowRight, BookOpen, CheckCircle2, Clock3, ShieldCheck, Target, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LEARNING_PATHS } from '@/data/learningPaths';

import { useLearningProgress } from '@/hooks/useLearningProgress';
import { moduleHref, pathProgress } from '@/lib/learningProgress';

export default function Dashboard() {
  const { user } = useAuth();
  const learning = useLearningProgress();
  const starterPath = LEARNING_PATHS.find((path) => path.slug === learning.activePath) ?? LEARNING_PATHS[0];
  const state = pathProgress(starterPath, learning.completedLessons, user?.solvedLabs.map((item) => item.labSlug) ?? []);
  const nextModule = state.next;
  const nextHref = nextModule ? moduleHref(starterPath, nextModule)! : '/paths';
  const progress = state.percent;

  return (
    <section className="min-h-screen bg-[#07090f] pb-20 pt-28 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-[#222a39] pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Panel de aprendizaje</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Continúa, {user?.fullName || user?.username || 'participante'}.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Tu siguiente objetivo, progreso reciente y preparación del entorno en un solo lugar.</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="border border-[#222a39] bg-[#0d111a] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300"><BookOpen className="h-4 w-4" /> Continuar aprendiendo</span>
                <h2 className="mt-4 text-2xl font-bold">{nextModule?.title ?? 'Módulos disponibles completados'}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{nextModule?.description ?? 'Explora otra ruta para continuar aprendiendo.'}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-4 w-4" /> {nextModule ? `${nextModule.durationMinutes} min` : 'Ruta al día'}</span>
            </div>
            <p className="mt-4 text-xs text-slate-400">Lecturas y ruta guardadas en este navegador. Solves y puntos sincronizados con tu cuenta.</p><div className="mt-7" aria-label={`Progreso de la ruta: ${progress}%`}>
              <div className="mb-2 flex justify-between text-xs"><span className="text-slate-400">{starterPath.title}</span><strong>{progress}%</strong></div>
              <div className="h-2 overflow-hidden bg-slate-800"><div className="h-full bg-purple-500" style={{ width: `${progress}%` }} /></div>
            </div>
            <Link to={nextHref} className="mt-7 inline-flex min-h-11 items-center gap-2 bg-purple-600 px-5 text-sm font-bold text-white hover:bg-purple-500">{nextModule ? 'Abrir siguiente módulo' : 'Explorar rutas'} <ArrowRight className="h-4 w-4" /></Link>
          </article>

          <aside className="border border-[#222a39] bg-[#0d111a] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resumen</p>
            <dl className="mt-5 space-y-4">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-sm text-slate-400"><Target className="h-4 w-4" /> Labs resueltos</dt><dd className="font-mono font-bold">{user?.solvedLabs.length ?? 0}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-sm text-slate-400"><ShieldCheck className="h-4 w-4" /> Estado</dt><dd className="font-mono text-xs font-bold text-emerald-400">{user?.accessStatus ?? 'visitante'}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="h-4 w-4" /> Puntos</dt><dd className="font-mono font-bold">{user?.points ?? 0}</dd></div>
            </dl>
          </aside>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link to="/setup/wsl" className="border border-[#222a39] bg-[#0d111a] p-5 hover:border-cyan-500/60"><Wrench className="h-5 w-5 text-cyan-400" /><h2 className="mt-4 font-bold">Preparar WSL</h2><p className="mt-2 text-sm text-slate-400">Configura Windows, Linux y VPN paso a paso.</p></Link>
          <Link to="/paths" className="border border-[#222a39] bg-[#0d111a] p-5 hover:border-purple-500/60"><BookOpen className="h-5 w-5 text-purple-400" /><h2 className="mt-4 font-bold">Explorar rutas</h2><p className="mt-2 text-sm text-slate-400">Consulta módulos disponibles y próximos contenidos.</p></Link>
          <Link to="/labs" className="border border-[#222a39] bg-[#0d111a] p-5 hover:border-emerald-500/60"><Target className="h-5 w-5 text-emerald-400" /><h2 className="mt-4 font-bold">Practicar</h2><p className="mt-2 text-sm text-slate-400">Entra a un laboratorio publicado y guarda tu avance.</p></Link>
        </div>
      </div>
    </section>
  );
}
