import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Flag,
  Globe2,
  LockKeyhole,
  Play,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { useAuth } from '@/context/AuthContext';
import type { LearningModule, LearningPath } from '@/types/auth';

const levelStyle: Record<LearningPath['level'], string> = {
  Fundamental: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  Intermedio: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  Avanzado: 'border-violet-400/25 bg-violet-400/10 text-violet-200',
};

const pathVisuals = [
  { icon: Terminal, tone: 'text-emerald-300', surface: 'bg-emerald-400/10' },
  { icon: ServerCog, tone: 'text-sky-300', surface: 'bg-sky-400/10' },
  { icon: Globe2, tone: 'text-cyan-300', surface: 'bg-cyan-400/10' },
  { icon: ShieldCheck, tone: 'text-violet-300', surface: 'bg-violet-400/10' },
];

const moduleType = (module: LearningModule) => {
  if (module.labSlug) return { label: 'Laboratorio', icon: Flag };
  if (module.guide) return { label: 'Lectura guiada', icon: BookOpen };
  return { label: 'Práctica', icon: Sparkles };
};

const moduleDestination = (path: LearningPath, module: LearningModule) =>
  module.status === 'coming_soon' ? null : module.labSlug ? `/lab/${module.labSlug}` : module.guide ? `/learn/${path.slug}/${module.id}` : null;

export const LearningPaths: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [expandedPath, setExpandedPath] = useState<string | null>(LEARNING_PATHS[0].id);
  const solvedSlugs = useMemo(() => new Set(user?.solvedLabs.map((solve) => solve.labSlug) || []), [user?.solvedLabs]);

  const academyStats = useMemo(() => {
    const modules = LEARNING_PATHS.flatMap((path) => path.modules);
    const labs = modules.filter((module) => module.labSlug);
    return {
      totalLabs: labs.length,
      completedLabs: labs.filter((module) => module.labSlug && solvedSlugs.has(module.labSlug)).length,
      totalModules: modules.length,
    };
  }, [solvedSlugs]);

  const academyProgress = academyStats.totalLabs ? Math.round((academyStats.completedLabs / academyStats.totalLabs) * 100) : 0;

  return (
    <section className="academy-grid min-h-screen bg-[#0a0f19] pb-20 pt-24 text-slate-100 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-center lg:p-11">
            <div>
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> SHADOWBYTES ACADEMY
              </span>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Formación práctica en ciberseguridad</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Aprende con una ruta clara y práctica.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Cada ruta mezcla conceptos esenciales, tareas breves y laboratorios controlados. Avanza a tu ritmo, con contexto suficiente para entender lo que haces.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#learning-paths" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200">
                  Ver rutas disponibles <ArrowRight className="h-4 w-4" />
                </a>
                {!isAuthenticated && <Link to="/admission" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-bold text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800">Solicitar acceso</Link>}
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">Tu progreso</p>
                  <p className="mt-1 text-sm font-bold text-white">{isAuthenticated ? user?.username : 'Explorador invitado'}</p>
                  <p className="mt-1 text-xs text-slate-400">{isAuthenticated ? user?.rank : 'Crea una cuenta para guardar avances.'}</p>
                </div>
                <div className="relative h-16 w-16 shrink-0">
                  <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90" aria-label={`${academyProgress}% de laboratorios completados`}>
                    <circle cx="21" cy="21" r="16" fill="transparent" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
                    <circle cx="21" cy="21" r="16" fill="transparent" stroke="#67e8f9" strokeLinecap="round" strokeWidth="3" pathLength="100" strokeDasharray={`${academyProgress} 100`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">{academyProgress}%</span>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-800 pt-4">
                <p className="text-sm font-bold text-slate-100">{academyStats.completedLabs} de {academyStats.totalLabs} laboratorios resueltos</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">El progreso se guarda automáticamente al resolver una flag.</p>
              </div>
              {isAuthenticated && <p className="mt-4 text-xs font-semibold text-amber-200">{user?.points ?? 0} puntos acumulados</p>}
            </aside>
          </div>

          <div className="grid border-t border-slate-800 sm:grid-cols-3">
            {[
              ['01', 'Lee el objetivo', 'Empieza por la explicación corta para saber qué vas a practicar.'],
              ['02', 'Completa el módulo', 'Sigue la secuencia o abre el laboratorio que prefieras.'],
              ['03', 'Consolida lo aprendido', 'Una flag correcta guarda el avance y suma puntos.'],
            ].map(([number, title, copy]) => (
              <div key={number} className="flex gap-4 border-b border-slate-800 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-8 sm:last:border-r-0">
                <span className="text-xs font-black text-cyan-300">{number}</span>
                <div><p className="text-sm font-bold text-slate-200">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p></div>
              </div>
            ))}
          </div>
        </header>

        <section id="learning-paths" className="mt-11" aria-labelledby="paths-title">
          <div className="flex flex-col gap-3 border-b border-slate-700/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Catálogo de formación</p>
              <h2 id="paths-title" className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Rutas de aprendizaje</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">Tienes {academyStats.totalModules} módulos disponibles. Las rutas recomiendan un orden, pero no bloquean tu exploración.</p>
          </div>

          <div className="mt-6 space-y-5">
            {LEARNING_PATHS.map((path, pathIndex) => {
              const isExpanded = expandedPath === path.id;
              const visual = pathVisuals[pathIndex % pathVisuals.length];
              const PathIcon = visual.icon;
              const labModules = path.modules.filter((module) => module.labSlug);
              const completedLabs = labModules.filter((module) => module.labSlug && solvedSlugs.has(module.labSlug)).length;
              const progress = labModules.length ? Math.round((completedLabs / labModules.length) * 100) : 0;
              const nextModuleIndex = path.modules.findIndex((module) => !module.labSlug || !solvedSlugs.has(module.labSlug));
              const currentModuleIndex = nextModuleIndex === -1 ? path.modules.length - 1 : nextModuleIndex;
              const currentModule = path.modules[currentModuleIndex];
              const currentDestination = moduleDestination(path, currentModule);

              return (
                <article key={path.id} className="overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/80 transition-colors hover:border-slate-600">
                  <button
                    type="button"
                    onClick={() => setExpandedPath((current) => current === path.id ? null : path.id)}
                    aria-expanded={isExpanded}
                    className="w-full p-5 text-left sm:p-7"
                  >
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_236px] lg:items-center">
                      <div className="flex items-start gap-4 sm:gap-5">
                        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${visual.surface} ${visual.tone}`}><PathIcon className="h-6 w-6" /></span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold tracking-[0.13em] text-slate-500">RUTA {String(pathIndex + 1).padStart(2, '0')}</span>
                            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide ${levelStyle[path.level]}`}>{path.level.toUpperCase()}</span>
                          </div>
                          <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">{path.title}</h3>
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{path.description}</p>
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {path.estimatedHours} h estimadas</span>
                            <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {path.modules.length} módulos</span>
                            <span>{path.tags.slice(0, 3).join(' · ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-700 bg-slate-950/45 p-4 lg:text-right">
                        <div className="flex items-center justify-between gap-3 lg:justify-end">
                          <span className="text-[10px] font-bold tracking-[0.13em] text-slate-500">PROGRESO</span>
                          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <p className="mt-2 text-xl font-black text-white">{progress}% <span className="text-xs font-medium text-slate-500">· {completedLabs}/{labModules.length} labs</span></p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><span className="block h-full rounded-full bg-cyan-300" style={{ width: `${progress}%` }} /></div>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">{isExpanded ? 'Ocultar módulos' : 'Ver módulos'} <ArrowRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} /></span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/35 px-5 py-6 sm:px-7">
                      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">RECOMENDADO PARA CONTINUAR</p>
                          <p className="mt-1 text-sm font-bold text-white">{currentModule.title}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/paths/${path.slug}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 text-sm font-bold text-slate-200 hover:border-slate-500">Ver ruta completa</Link>
                          {currentDestination && <Link to={currentDestination} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-200"><Play className="h-4 w-4 fill-current" /> Continuar</Link>}
                        </div>
                      </div>

                      <ol className="relative space-y-1 before:absolute before:bottom-8 before:left-[23px] before:top-8 before:w-px before:bg-slate-700 sm:before:left-[27px]">
                        {path.modules.map((module, moduleIndex) => {
                          const kind = moduleType(module);
                          const destination = moduleDestination(path, module);
                          const solved = Boolean(module.labSlug && solvedSlugs.has(module.labSlug));
                          const current = moduleIndex === currentModuleIndex && !solved;
                          const Icon = kind.icon;
                          const actionText = solved ? 'Revisar' : module.status === 'coming_soon' ? 'Próximamente' : module.labSlug ? 'Abrir lab' : module.guide ? 'Leer' : 'Abrir';
                          const item = (
                            <>
                              <span className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-black sm:h-14 sm:w-14 ${solved ? 'border-emerald-300/40 bg-emerald-400 text-slate-950' : current ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-400'}`}>
                                {solved ? <Check className="h-5 w-5 stroke-[3]" /> : current ? <Play className="h-4 w-4 fill-current" /> : String(moduleIndex + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0 flex-1 py-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.11em] text-slate-500"><Icon className="h-3.5 w-3.5" /> {kind.label.toUpperCase()}</span>
                                  {solved && <span className="inline-flex items-center gap-1 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-emerald-300"><CheckCircle2 className="h-3 w-3" /> COMPLETADO</span>}
                                  {current && module.status !== 'coming_soon' && <span className="rounded bg-cyan-300/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-cyan-200">SIGUIENTE</span>}
                                  {module.status === 'coming_soon' && <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-slate-300">PRÓXIMAMENTE</span>}
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-white sm:text-base">{module.title}</h4>
                                <p className="mt-1 text-sm leading-6 text-slate-400">{module.description}</p>
                                <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {module.durationMinutes} min</span><span className="text-amber-200">+{module.points} puntos</span></div>
                              </div>
                              {destination ? <span className={`hidden min-h-10 shrink-0 items-center gap-1.5 self-center rounded-lg border px-3 text-xs font-bold sm:inline-flex ${solved ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200' : 'border-slate-700 bg-slate-900 text-slate-200'}`}>{actionText} <ArrowRight className="h-3.5 w-3.5" /></span> : <span className="hidden self-center text-slate-600 sm:inline-flex"><LockKeyhole className="h-4 w-4" /></span>}
                            </>
                          );

                          return <li key={module.id} className={`relative rounded-2xl ${current ? 'bg-slate-900/60' : 'hover:bg-white/[0.02]'}`}>{destination ? <Link to={destination} className="flex gap-4 p-3.5 sm:gap-5 sm:p-4">{item}</Link> : <div className="flex gap-4 p-3.5 sm:gap-5 sm:p-4">{item}</div>}</li>;
                        })}
                      </ol>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <aside className="mt-7 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-300"><ShieldCheck className="h-5 w-5" /></span>
            <div><p className="text-sm font-bold text-white">Aprendizaje seguro y responsable.</p><p className="mt-1 text-sm leading-6 text-slate-400">Practica únicamente en laboratorios propios o autorizados. La prioridad es comprender, documentar y aplicar buenas decisiones técnicas.</p></div>
          </div>
          {isAuthenticated ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200"><Check className="h-4 w-4" /> Progreso sincronizado</span> : <Link to="/admission" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 text-sm font-bold text-slate-200 transition-colors hover:border-slate-400 hover:bg-slate-800">Conocer admisión <ArrowRight className="h-4 w-4" /></Link>}
        </aside>
      </div>
    </section>
  );
};

export default LearningPaths;
