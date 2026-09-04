import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { BADGES_CATALOG } from '@/data/badges';

const ENTRY_STEPS = [
  {
    number: '01',
    title: 'Crea tu perfil',
    description: 'Guarda tus avances y construye tu historial de aprendizaje.',
    icon: Users,
  },
  {
    number: '02',
    title: 'Completa la admisión',
    description: 'Resuelve un reto guiado para activar tu acceso al grupo.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Avanza a tu ritmo',
    description: 'Sigue rutas, practica en labs y aprende junto a la comunidad.',
    icon: Trophy,
  },
];

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isDark = theme === 'dark';
  const isMember = user?.accessStatus === 'member' || user?.accessStatus === 'admin';
  const primaryAction = isMember ? { to: '/labs', label: 'Explorar labs' } : { to: '/admission', label: 'Empezar la admisión' };

  return (
    <>
      <section className="relative isolate overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className={`absolute inset-0 -z-10 ${isDark ? 'bg-[#070a12]' : 'bg-slate-50'}`} />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${
              isDark ? 'border-purple-400/20 bg-purple-400/10 text-purple-200' : 'border-purple-200 bg-white text-purple-700 shadow-sm'
            }`}>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              GRUPO DE ESTUDIO · SENATI
            </div>

            <h1 className={`mt-6 max-w-3xl text-4xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              Aprende ciberseguridad <span className="text-purple-500">haciendo.</span>
            </h1>

            <p className={`mt-6 max-w-2xl text-base leading-8 sm:text-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Un espacio claro para empezar, practicar retos reales y compartir lo que descubres. Sin competir por aparentar: aprende paso a paso y con acompañamiento.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryAction.to}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 text-sm font-bold text-white transition-colors hover:bg-purple-500"
              >
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/paths"
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-bold transition-colors ${
                  isDark ? 'border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-100'
                }`}
              >
                <Compass className="h-4 w-4 text-cyan-500" />
                Ver rutas guiadas
              </Link>
            </div>

            <div className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Retos con contexto</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Progreso guardado</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Comunidad de apoyo</span>
            </div>
          </div>

          <aside
            className={`relative overflow-hidden rounded-xl border p-6 sm:p-8 ${
              isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-purple-400">TU PUNTO DE PARTIDA</p>
                  <h2 className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Empieza sin perderte.
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 space-y-1">
                {ENTRY_STEPS.map((step, index) => (
                  <div key={step.number} className="relative flex gap-4 py-3">
                    {index < ENTRY_STEPS.length - 1 && <span className={`absolute left-5 top-12 h-7 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />}
                    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      isDark ? 'border-slate-700 bg-slate-900 text-purple-300' : 'border-purple-100 bg-purple-50 text-purple-600'
                    }`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-purple-400">{step.number}</span>
                        <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{step.title}</h3>
                      </div>
                      <p className={`mt-1 text-sm leading-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/admission"
                className={`mt-6 flex min-h-12 items-center justify-between rounded-2xl border px-4 text-sm font-bold transition-colors ${
                  isDark ? 'border-slate-700 bg-slate-900 text-white hover:border-purple-400/60' : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-purple-300 hover:bg-white'
                }`}
              >
                {isAuthenticated ? 'Ver estado de mi admisión' : 'Crear mi cuenta'}
                <ArrowRight className="h-4 w-4 text-purple-500" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className={`border-y py-5 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-white'}`}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: '2', label: 'Labs iniciales', icon: Terminal },
            { value: '7', label: 'Áreas CTF', icon: ShieldCheck },
            { value: 'Paso a paso', label: 'Rutas guiadas', icon: Compass },
            { value: 'En equipo', label: 'Comunidad', icon: Users },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <stat.icon className="h-4 w-4 shrink-0 text-purple-400" />
              <div>
                <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-500">RUTAS GUIADAS</p>
              <h2 className={`mt-2 text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>No tienes que adivinar qué sigue.</h2>
              <p className={`mt-3 max-w-2xl text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Elige una ruta y alterna conceptos breves con prácticas que puedes completar en tu propio ritmo.</p>
            </div>
            <Link to="/paths" className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-500 hover:text-purple-400">
              Ver todas las rutas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {LEARNING_PATHS.map((path) => (
              <Link
                key={path.id}
                to={`/paths/${path.slug}`}
                className={`group flex min-h-56 flex-col rounded-xl border p-5 transition-colors ${
                  isDark ? 'border-slate-800 bg-slate-950 hover:border-purple-500/50' : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{path.icon}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    path.level === 'Fundamental' ? 'bg-emerald-500/10 text-emerald-600' : path.level === 'Intermedio' ? 'bg-cyan-500/10 text-cyan-600' : 'bg-purple-500/10 text-purple-600'
                  }`}>{path.level}</span>
                </div>
                <h3 className={`mt-5 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{path.title}</h3>
                <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{path.description}</p>
                <div className={`mt-auto flex items-center justify-between border-t pt-4 text-sm ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <span>{path.modules.length} módulos</span>
                  <span className="font-bold text-purple-500 transition-transform group-hover:translate-x-1">Empezar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`border-t py-16 sm:py-20 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-white'}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-purple-500">PROGRESO VISIBLE</p>
              <h2 className={`mt-2 text-3xl font-black tracking-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Cada reto deja una huella.</h2>
            </div>
            <Link to="/achievements" className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-500 hover:text-purple-400">
              Ver mis logros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BADGES_CATALOG.slice(0, 4).map((badge) => (
              <div key={badge.code} className={`rounded-xl border p-5 ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{badge.icon}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-500"><Award className="h-3 w-3" /> +{badge.pointsBonus}</span>
                </div>
                <h3 className={`mt-5 text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{badge.title}</h3>
                <p className={`mt-2 text-sm leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{badge.description}</p>
              </div>
            ))}
          </div>

          <div className={`mt-8 flex flex-col items-start gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Tu avance se guarda de forma segura.</h3>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Las flags se validan sin exponer respuestas y los puntos quedan asociados a tu perfil.</p>
              </div>
            </div>
            <Link to="/admission" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-bold text-white transition-colors hover:bg-purple-500">
              {isAuthenticated ? 'Continuar' : 'Crear cuenta'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
