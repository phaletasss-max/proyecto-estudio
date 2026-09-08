import { ContentIcon } from '@/components/ContentIcon';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Search, Shield, Key, FileCode, Network, Box, Sparkles, Clock, ArrowRight } from 'lucide-react';
import type { CTFLab, CTFCategory } from '@/types/ctf';
import { DIFFICULTY_COLORS } from '@/types/ctf';
import { useTheme } from '@/context/ThemeContext';
import { DifficultyBadge } from './DifficultyBadge';

interface LabCardProps {
  lab: CTFLab;
}

const getCategoryIcon = (category: CTFCategory) => {
  switch (category) {
    case 'Web':
      return <Globe className="w-3.5 h-3.5" />;
    case 'Forensics':
      return <Search className="w-3.5 h-3.5" />;
    case 'Pwn':
      return <Shield className="w-3.5 h-3.5" />;
    case 'Crypto':
      return <Key className="w-3.5 h-3.5" />;
    case 'Reversing':
      return <FileCode className="w-3.5 h-3.5" />;
    case 'Network':
      return <Network className="w-3.5 h-3.5" />;
    case 'Misc':
    default:
      return <Box className="w-3.5 h-3.5" />;
  }
};

export const LabCard: React.FC<LabCardProps> = ({ lab }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const diffColors = DIFFICULTY_COLORS[lab.difficulty];

  const pointsMap: Record<string, number> = {
    Easy: 100,
    Medium: 250,
    Hard: 500,
    Insane: 1000,
  };
  const points = lab.points ?? pointsMap[lab.difficulty] ?? 100;

  return (
    <Link to={`/lab/${lab.slug}`} className="block h-full group">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={`h-full flex flex-col p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 shadow-xl shadow-purple-950/10'
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Subtle Ambient Hover Glow */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-purple-500 pointer-events-none`}
        />

        {/* Top Badges */}
        <div className="flex justify-between items-center gap-2 mb-3 relative z-10">
          <DifficultyBadge difficulty={lab.difficulty} size="sm" />

          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {getCategoryIcon(lab.category)}
              <span>{lab.category}</span>
            </span>

            <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {points} pts
            </span>
          </div>
        </div>

        {/* Framework Pill if applicable */}
        {lab.framework && (
          <div className="mb-2 relative z-10">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 border border-red-500/30">
              <span><ContentIcon name="zap" /></span>
              <span>{lab.framework}</span>
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className={`text-lg font-bold font-mono mb-2 relative z-10 group-hover:text-purple-400 transition-colors line-clamp-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {lab.title}
        </h3>

        {/* Description */}
        <p className={`text-xs mb-4 flex-grow relative z-10 line-clamp-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {lab.description}
        </p>

        {/* Tags */}
        {lab.tags && (
          <div className="flex flex-wrap gap-1 mb-4 relative z-10">
            {lab.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div
          className={`text-[11px] font-mono mt-auto pt-3 border-t flex items-center justify-between relative z-10 ${
            isDark ? 'text-slate-500 border-slate-800/80' : 'text-slate-500 border-slate-200'
          }`}
        >
          <span className="truncate max-w-[140px]">Por: {lab.author}</span>
          <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Resolver</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};
