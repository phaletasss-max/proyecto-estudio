import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Clock, CheckCircle2, ArrowRight, Play, BookOpen, Trophy, Shield, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEARNING_PATHS } from '@/data/learningPaths';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import type { LearningPath } from '@/types/auth';

export const LearningPaths: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [expandedPath, setExpandedPath] = useState<string | null>(LEARNING_PATHS[0].id);

  const toggleExpand = (id: string) => {
    setExpandedPath(expandedPath === id ? null : id);
  };

  const solvedSlugs = new Set(user?.solvedLabs.map((s) => s.labSlug) || []);

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Rutas de Aprendizaje Guiadas</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            LEARNING <span className="gradient-text-cyan">PATHS</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Módulos estructurados paso a paso estilo TryHackMe diseñados para el 4.º ciclo y tu desarrollo como especialista en ciberseguridad.
          </p>
        </motion.div>

        {/* Paths List */}
        <div className="space-y-6">
          {LEARNING_PATHS.map((path: LearningPath, idx) => {
            const isExpanded = expandedPath === path.id;

            // Calculate path progress
            const labModules = path.modules.filter((m) => m.labSlug);
            const completedCount = labModules.filter((m) => m.labSlug && solvedSlugs.has(m.labSlug)).length;
            const progressPercent = labModules.length > 0 ? Math.round((completedCount / labModules.length) * 100) : 0;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`rounded-3xl border overflow-hidden transition-all duration-300 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Path Header */}
                <div
                  onClick={() => toggleExpand(path.id)}
                  className="p-6 sm:p-8 cursor-pointer hover:bg-slate-900/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                      {path.icon}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          path.level === 'Fundamental'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : path.level === 'Intermedio'
                              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                              : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                        }`}>
                          {path.level}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Clock className="w-3 h-3" />
                          ~{path.estimatedHours} horas
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          • {path.modules.length} módulos
                        </span>
                      </div>

                      <h3 className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {path.title}
                      </h3>

                      <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {path.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {path.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                              isDark ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Toggle */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Progreso de la Ruta</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {completedCount} / {labModules.length} Labs ({progressPercent}%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Modules */}
                {isExpanded && (
                  <div className={`p-6 sm:p-8 border-t ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-4">
                      Módulos de la Ruta:
                    </h4>

                    <div className="space-y-3">
                      {path.modules.map((mod, mIdx) => {
                        const isLab = !!mod.labSlug;
                        const isSolved = isLab && mod.labSlug ? solvedSlugs.has(mod.labSlug) : false;

                        return (
                          <div
                            key={mod.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-colors ${
                              isSolved
                                ? isDark ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
                                : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                                isSolved
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : mod.type === 'lab'
                                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                                    : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                              }`}>
                                {isSolved ? <CheckCircle2 className="w-4 h-4" /> : mIdx + 1}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className={`font-mono font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {mod.title}
                                  </h5>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                                    mod.type === 'lab' ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'
                                  }`}>
                                    {mod.type}
                                  </span>
                                </div>
                                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {mod.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              <span className="text-[11px] font-mono text-slate-400">
                                +{mod.points} pts
                              </span>

                              {mod.labSlug ? (
                                <Link
                                  to={`/lab/${mod.labSlug}`}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                                    isSolved
                                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                                  }`}
                                >
                                  <span>{isSolved ? 'Revisar Lab' : 'Iniciar Reto'}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              ) : (
                                <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Lectura ({mod.durationMinutes} min)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LearningPaths;
