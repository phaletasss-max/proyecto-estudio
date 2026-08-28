import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Shield, Users, Zap, Terminal, Compass, Award, Sparkles, BookOpen } from 'lucide-react';
import { DomainCTFModal } from '@/components/DomainCTFModal';
import { TerminalBackground } from '@/components/TerminalBackground';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { BADGES_CATALOG } from '@/data/badges';
import { REAL_LABS } from '@/data/mockLabs';

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const stats = [
    { label: 'Participantes', value: '22', icon: Users },
    { label: 'Labs Disponibles', value: `${REAL_LABS.length}`, icon: Terminal },
    { label: 'Categorías CTF', value: '7', icon: Shield },
    { label: 'Grupo de Estudio', value: 'SENATI', icon: Zap },
  ];

  return (
    <>
      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-transparent transform-gpu">
        <TerminalBackground />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-900/15 via-cyan-900/10 to-transparent blur-2xl pointer-events-none -z-10 transform-gpu" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-6 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-white/90 border-slate-200 shadow-md'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs sm:text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                SENATI 4.º Ciclo • 22 Participantes •{' '}
                <span className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  Instructor: Victor Kenky Rodriguez Lopez
                </span>
              </span>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`mb-8 max-w-2xl mx-auto px-6 py-3 rounded-2xl border text-center shadow-lg ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
              }`}
            >
              <p className={`text-xs sm:text-sm font-medium italic leading-relaxed ${
                isDark ? 'text-purple-200' : 'text-slate-600'
              }`}>
                "No tengas miedo de empezar sin saber; ten miedo de saber que no sabes y aun así no hacer nada para aprender."
              </p>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.08] ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Resuelve CTFs, sube{' '}
              <span className="gradient-text-blue inline-block">writeups</span>{' '}
              y sube en el{' '}
              <span className="gradient-text-cyan inline-block">ranking</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={`mt-6 text-lg sm:text-xl max-w-2xl font-normal leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Plataforma de entrenamiento técnico en ciberseguridad para el grupo de estudio de SENATI. Resuelve laboratorios prácticos, documenta writeups y comparte conocimiento.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/labs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base shadow-lg bg-purple-600 text-white hover:bg-purple-500 shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <Trophy className="w-5 h-5" />
                <span>Explorar Labs CTF</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/paths"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700'
                    : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Rutas de Aprendizaje</span>
              </Link>
            </motion.div>

            {/* CTF Modal */}
            <div className="mt-4">
              <DomainCTFModal />
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${
                    isDark
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-white/80 border-slate-200 shadow-sm'
                  }`}
                >
                  <stat.icon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Learning Paths Section */}
      <section className="py-16 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>RUTAS ESTRUCTURADAS</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rutas de Aprendizaje
              </h2>
            </div>
            <Link
              to="/paths"
              className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Ver todas las rutas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {LEARNING_PATHS.map((path) => (
              <Link
                key={path.id}
                to="/paths"
                className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-102 flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40 shadow-lg shadow-purple-950/10'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="text-3xl mb-3">{path.icon}</div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase mb-2 ${
                    path.level === 'Fundamental'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : path.level === 'Intermedio'
                        ? 'bg-cyan-500/15 text-cyan-400'
                        : 'bg-purple-500/15 text-purple-400'
                  }`}>
                    {path.level}
                  </span>
                  <h3 className={`font-bold font-mono text-sm mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {path.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {path.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{path.modules.length} módulos</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <span>Iniciar</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-16 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>GAMIFICACIÓN & RECONOCIMIENTOS</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Insignias del Programa
              </h2>
            </div>
            <Link
              to="/achievements"
              className="text-xs font-mono font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Ver todos los logros</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES_CATALOG.slice(0, 4).map((badge) => (
              <div
                key={badge.code}
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="text-3xl">{badge.icon}</div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-white">{badge.title}</h4>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">+{badge.pointsBonus} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
