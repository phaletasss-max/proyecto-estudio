import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Sparkles, Filter, CheckCircle2, Lock } from 'lucide-react';
import { BADGES_CATALOG } from '@/data/badges';
import { BadgeCard } from '@/components/BadgeCard';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export const Achievements: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const unlockedSet = new Set(user?.unlockedBadges || []);
  const totalBadges = BADGES_CATALOG.length;
  const unlockedCount = user?.unlockedBadges.length || 0;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  const categories = ['all', 'Milestone', 'Specialty', 'Community', 'Mastery'];

  const filteredBadges = BADGES_CATALOG.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Sistema de Reconocimiento & Logros</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            INSIGNIAS & <span className="gradient-text-blue">LOGROS</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Desbloquea insignias especiales resolviendo retos CTF, colaborando con writeups y dominando ramas de la ciberseguridad.
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`rounded-3xl border p-6 sm:p-8 shadow-xl mb-8 ${
            isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono text-slate-400">Progreso Total de Colección</span>
              <h3 className="text-xl font-bold font-mono text-purple-400">
                {unlockedCount} de {totalBadges} Badges Desbloqueados ({progressPercent}%)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Bonus Puntos: +{BADGES_CATALOG.filter((b) => unlockedSet.has(b.code)).reduce((acc, b) => acc + b.pointsBonus, 0)} PTS
              </span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className={`w-4 h-4 mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Todos los Logros' : cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredBadges.map((badge) => {
            const isUnlocked = unlockedSet.has(badge.code);
            return <BadgeCard key={badge.code} badge={badge} isUnlocked={isUnlocked} />;
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Achievements;
