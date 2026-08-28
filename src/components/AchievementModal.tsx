import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Sparkles, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Badge } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RANKS } from '@/types/auth';
import { cyberAudio } from '@/utils/audio';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  labTitle: string;
  pointsEarned: number;
  newBadges: Badge[];
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  labTitle,
  pointsEarned,
  newBadges,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isOpen) {
      cyberAudio.playSolveFanfare();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentRank = user ? RANKS[user.rank] : RANKS['Script Kiddie'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 shadow-2xl overflow-hidden text-center ${
            isDark ? 'bg-slate-950 border-purple-500/40 text-white' : 'bg-white border-purple-200 text-slate-900'
          }`}
        >
          {/* Confetti / Cyber glow effect */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-b from-purple-500/30 via-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl border transition-colors ${
              isDark ? 'border-slate-800 text-slate-400 hover:text-white bg-slate-900' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Trophy Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-xl shadow-purple-500/25 flex items-center justify-center text-4xl"
          >
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              🏆
            </div>
          </motion.div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            FLAG CAPTURADA CON ÉXITO
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[Orbitron] mb-1">
            ¡LAB RESUELTO!
          </h2>

          <p className={`text-xs font-mono max-w-sm mx-auto mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Has conquistado <span className="text-cyan-400 font-bold">"{labTitle}"</span>
          </p>

          {/* Rewards Card */}
          <div className={`p-4 rounded-2xl border mb-6 text-left ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">Puntos de resolución:</span>
              <span className="text-base font-mono font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                +{pointsEarned} PTS
              </span>
            </div>

            {user && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs font-mono text-slate-400">Puntuación Total:</span>
                <span className="text-sm font-mono font-bold text-purple-400">
                  {user.points.toLocaleString()} PTS ({currentRank.icon} {user.rank})
                </span>
              </div>
            )}
          </div>

          {/* New Badges Section (if any) */}
          {newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                <span>¡Nuevo Logro Desbloqueado!</span>
              </div>

              <div className="space-y-2">
                {newBadges.map((b) => (
                  <div
                    key={b.code}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <p className="text-xs font-bold font-mono">{b.title}</p>
                        <p className="text-[10px] text-slate-400">{b.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                      +{b.pointsBonus} pts
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/labs"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-600/20"
            >
              <span>Explorar más Labs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className={`py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-colors ${
                isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Ver mi Perfil
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
