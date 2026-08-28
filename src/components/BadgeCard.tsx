import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Sparkles } from 'lucide-react';
import type { Badge } from '@/types/auth';
import { useTheme } from '@/context/ThemeContext';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isUnlocked, unlockedAt }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categoryColors: Record<string, string> = {
    Milestone: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Specialty: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    Community: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Mastery: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
      className={`relative rounded-2xl border p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isUnlocked
          ? isDark
            ? 'bg-slate-900/80 border-purple-500/30 shadow-lg shadow-purple-900/10'
            : 'bg-white border-purple-200 shadow-md'
          : isDark
            ? 'bg-slate-950/60 border-slate-800 opacity-60 grayscale-[40%]'
            : 'bg-slate-50 border-slate-200 opacity-60'
      }`}
    >
      {/* Glow highlight for unlocked */}
      {isUnlocked && (
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
      )}

      <div>
        {/* Top bar: Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${categoryColors[badge.category] || 'text-slate-400'}`}>
            {badge.category}
          </span>
          <div className="flex items-center gap-1">
            {isUnlocked ? (
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Desbloqueado
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded">
                <Lock className="w-3 h-3" />
                Bloqueado
              </span>
            )}
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`text-3xl p-2.5 rounded-2xl border ${
            isUnlocked
              ? isDark ? 'bg-slate-800 border-purple-500/40 shadow-inner' : 'bg-purple-50 border-purple-200'
              : isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {badge.icon}
          </div>
          <div>
            <h3 className={`font-bold text-base font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {badge.title}
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              +{badge.pointsBonus} pts
            </span>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs leading-relaxed mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {badge.description}
        </p>
      </div>

      {unlockedAt && (
        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
          Obtenido el {new Date(unlockedAt).toLocaleDateString('es-PE')}
        </div>
      )}
    </motion.div>
  );
};
