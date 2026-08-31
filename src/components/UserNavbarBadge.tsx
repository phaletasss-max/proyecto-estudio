import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Trophy, Award, Sparkles, ChevronDown, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RANKS } from '@/types/auth';
import { AuthModal } from '@/components/AuthModal';

export const UserNavbarBadge: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold transition-all shadow-md active:scale-95"
        >
          <User className="w-3.5 h-3.5" />
          <span>Ingresar</span>
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </>
    );
  }

  const rankInfo = RANKS[user.rank] || RANKS['Script Kiddie'];
  const hasMembership = user.accessStatus === 'member' || user.accessStatus === 'admin';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Badge Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2.5 p-1 sm:pr-3 rounded-full border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50'
            : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
        }`}
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
          <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
        </div>

        {/* Info (Hidden on very small screens) */}
        <div className="hidden sm:flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`text-xs font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {user.username}
            </span>
            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${rankInfo.badgeBg} ${rankInfo.badgeColor}`}>
              {rankInfo.icon} {user.rank}
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 font-bold mt-0.5 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {user.points.toLocaleString()} pts
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDark ? 'text-slate-400' : 'text-slate-500'} ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* User mini-card */}
          <div className={`p-3 rounded-xl border mb-2 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <p className="text-xs font-bold truncate">{user.fullName || user.username}</p>
            <p className="text-[11px] font-mono text-slate-400 truncate">@{user.username}</p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Labs:</span>
              <span className="font-bold text-emerald-400">{user.solvedLabs.length} resueltos</span>
            </div>
            <Link
              to="/admission"
              onClick={() => setDropdownOpen(false)}
              className={`mt-2 flex items-center gap-1.5 text-[10px] font-mono font-bold ${hasMembership ? 'text-emerald-400' : 'text-amber-400 hover:text-amber-300'}`}
            >
              <ShieldCheck className="w-3 h-3" />
              {hasMembership ? 'Miembro activo' : 'Completar admisión'}
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Mi Perfil & Estadísticas</span>
            </Link>

            <Link
              to="/leaderboard"
              onClick={() => setDropdownOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Leaderboard (Ranking)</span>
            </Link>

            <Link
              to="/achievements"
              onClick={() => setDropdownOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Logros ({user.unlockedBadges.length})</span>
            </Link>

            <Link
              to="/paths"
              onClick={() => setDropdownOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-900' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rutas de Aprendizaje</span>
            </Link>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
