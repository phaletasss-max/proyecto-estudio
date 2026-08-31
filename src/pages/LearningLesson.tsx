import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Lightbulb, Target } from 'lucide-react';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { useTheme } from '@/context/ThemeContext';

export const LearningLesson: React.FC = () => {
  const { pathSlug, moduleId } = useParams<{ pathSlug: string; moduleId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const path = LEARNING_PATHS.find((item) => item.slug === pathSlug);
  const module = path?.modules.find((item) => item.id === moduleId);

  if (!path || !module || !module.guide) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <BookOpen className="mx-auto h-10 w-10 text-purple-400" />
          <h1 className={`mt-4 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Lección no disponible</h1>
          <p className="mt-2 text-sm text-slate-500">Esta actividad se completa directamente desde un laboratorio o todavía está en preparación.</p>
          <Link to="/paths" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-bold text-white">Volver a rutas <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  const { guide } = module;

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link to="/paths" className={`inline-flex min-h-11 items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="h-4 w-4" /> Volver a rutas
        </Link>

        <header className={`mt-5 rounded-[2rem] border p-6 sm:p-9 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-600">{path.title}</span>
            <span className="inline-flex items-center gap-1 text-slate-500"><Clock3 className="h-3.5 w-3.5" /> {module.durationMinutes} min</span>
          </div>
          <h1 className={`mt-5 text-3xl font-black tracking-tight sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{module.title}</h1>
          <p className={`mt-4 max-w-2xl text-base leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{module.description}</p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className={`rounded-3xl border p-6 sm:p-8 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
            <div className="flex items-center gap-2 text-purple-500"><Target className="h-5 w-5" /><span className="text-xs font-bold tracking-[0.14em]">OBJETIVO</span></div>
            <p className={`mt-3 text-lg font-bold leading-7 ${isDark ? 'text-white' : 'text-slate-900'}`}>{guide.objective}</p>

            <h2 className={`mt-8 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ideas que debes llevarte</h2>
            <ul className="mt-4 space-y-3">
              {guide.keyIdeas.map((idea) => (
                <li key={idea} className={`flex gap-3 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{idea}</li>
              ))}
            </ul>
          </article>

          <aside className={`rounded-3xl border p-6 ${isDark ? 'border-purple-500/20 bg-purple-500/5' : 'border-purple-200 bg-purple-50/60'}`}>
            <div className="flex items-center gap-2 text-purple-500"><Lightbulb className="h-5 w-5" /><span className="text-xs font-bold tracking-[0.14em]">PRÁCTICA BREVE</span></div>
            <p className={`mt-4 text-sm leading-7 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{guide.practice}</p>
          </aside>
        </div>

        <article className={`mt-6 rounded-3xl border p-6 sm:p-8 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-2 text-cyan-500"><BookOpen className="h-5 w-5" /><span className="text-xs font-bold tracking-[0.14em]">PASO A PASO</span></div>
          <ol className="mt-6 space-y-4">
            {guide.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-black text-cyan-600">{index + 1}</span>
                <p className={`pt-0.5 text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
};

export default LearningLesson;
