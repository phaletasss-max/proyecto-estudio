import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/auth';
import { useTheme } from '@/context/ThemeContext';
import { RANKS } from '@/types/auth';
import { Link } from 'react-router-dom';

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[];
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topThree }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!topThree || topThree.length < 3) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="relative pt-8 pb-4 mb-12">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-gradient-to-r from-amber-500/10 via-purple-500/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-2xl mx-auto items-end">
        {/* 2nd Place (Silver) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-lg shadow-slate-400/20 p-0.5 bg-slate-800">
              <img src={second.avatarUrl} alt={second.username} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs flex items-center justify-center border-2 border-slate-950 shadow">
              2
            </div>
          </div>

          <Link to={`/profile/${second.username}`} className="hover:underline">
            <h4 className={`text-xs sm:text-sm font-bold font-mono truncate max-w-[100px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {second.username}
            </h4>
          </Link>
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[90px]">{second.specialty}</span>
          <span className="text-xs font-mono font-bold text-slate-300 mt-1">
            {second.points.toLocaleString()} pts
          </span>

          {/* Pedestal */}
          <div className={`w-full h-20 sm:h-24 mt-3 rounded-t-2xl border-t-2 border-x border-slate-300/40 flex flex-col items-center justify-center ${
            isDark ? 'bg-gradient-to-b from-slate-800/80 to-slate-950/90' : 'bg-gradient-to-b from-slate-200 to-slate-100'
          }`}>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-300">🥈 PLATA</span>
            <span className="text-[10px] font-mono text-slate-400">{second.solvedCount} labs</span>
          </div>
        </motion.div>

        {/* 1st Place (Gold) - Elevated */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center -mt-6 z-10"
        >
          {/* Crown */}
          <div className="text-2xl mb-1 animate-bounce">👑</div>

          <div className="relative mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-xl shadow-amber-500/30 p-0.5 bg-amber-950/50 ring-4 ring-amber-400/20">
              <img src={first.avatarUrl} alt={first.username} className="w-full h-full object-cover rounded-[20px]" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center border-2 border-slate-950 shadow-lg">
              1
            </div>
          </div>

          <Link to={`/profile/${first.username}`} className="hover:underline">
            <h4 className={`text-sm sm:text-base font-extrabold font-mono truncate max-w-[120px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {first.username}
            </h4>
          </Link>
          <span className="text-[11px] font-mono text-amber-400 font-semibold truncate max-w-[100px]">{first.specialty}</span>
          <span className="text-sm font-mono font-bold text-amber-400 mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {first.points.toLocaleString()} pts
          </span>

          {/* Pedestal */}
          <div className={`w-full h-28 sm:h-32 mt-3 rounded-t-2xl border-t-2 border-x border-amber-400/60 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10 ${
            isDark ? 'bg-gradient-to-b from-amber-900/40 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-amber-100 to-amber-50'
          }`}>
            <span className="text-sm sm:text-base font-mono font-extrabold text-amber-400">🥇 ORO</span>
            <span className="text-xs font-mono text-amber-300/80">{first.solvedCount} labs resueltos</span>
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400/70 mt-1">
              <Award className="w-3 h-3" />
              <span>{first.badgesCount} badges</span>
            </div>
          </div>
        </motion.div>

        {/* 3rd Place (Bronze) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-700 shadow-lg shadow-amber-800/20 p-0.5 bg-slate-800">
              <img src={third.avatarUrl} alt={third.username} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs flex items-center justify-center border-2 border-slate-950 shadow">
              3
            </div>
          </div>

          <Link to={`/profile/${third.username}`} className="hover:underline">
            <h4 className={`text-xs sm:text-sm font-bold font-mono truncate max-w-[100px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {third.username}
            </h4>
          </Link>
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[90px]">{third.specialty}</span>
          <span className="text-xs font-mono font-bold text-amber-600 mt-1">
            {third.points.toLocaleString()} pts
          </span>

          {/* Pedestal */}
          <div className={`w-full h-16 sm:h-20 mt-3 rounded-t-2xl border-t-2 border-x border-amber-700/40 flex flex-col items-center justify-center ${
            isDark ? 'bg-gradient-to-b from-amber-950/40 to-slate-950/90' : 'bg-gradient-to-b from-amber-100/50 to-slate-100'
          }`}>
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-600">🥉 BRONCE</span>
            <span className="text-[10px] font-mono text-slate-400">{third.solvedCount} labs</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
