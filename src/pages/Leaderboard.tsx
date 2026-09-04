import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Search, Users, Sparkles, Award, ArrowRight, Shield, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LeaderboardPodium } from '@/components/LeaderboardPodium';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RANKS, type LeaderboardEntry, type RankTier } from '@/types/auth';

interface RemoteLeaderboardRow {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  points: number | null;
  rank: string | null;
  specialty: string | null;
  solved_count: number | string | null;
}

export const Leaderboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRank, setFilterRank] = useState<string>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .rpc('get_leaderboard');

          if (!error && data) {
            const mapped: LeaderboardEntry[] = (data as RemoteLeaderboardRow[]).map((p, idx) => ({
              rankPosition: idx + 1,
              userId: p.user_id,
              username: p.username || 'anon',
              fullName: p.full_name || p.username || 'Estudiante',
              avatarUrl: p.avatar_url || '/logo-shadowbytes.webp',
              points: p.points || 0,
              rank: (p.rank as RankTier) || 'Script Kiddie',
              specialty: p.specialty || 'Ciberseguridad',
              solvedCount: Number(p.solved_count || 0),
              badgesCount: 0,
            }));
            setLeaderboardData(mapped);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error al cargar tabla de posiciones desde Supabase:', err);
        }
      }

      // If in local/demo mode, only show the active user session without fabricated fake profiles
      if (currentUser) {
        setLeaderboardData([
          {
            rankPosition: 1,
            userId: currentUser.id,
            username: currentUser.username,
            fullName: currentUser.fullName || currentUser.username,
            avatarUrl: currentUser.avatarUrl,
            points: currentUser.points,
            rank: currentUser.rank,
            specialty: currentUser.specialty,
            solvedCount: currentUser.solvedLabs.length,
            badgesCount: currentUser.unlockedBadges.length,
          },
        ]);
      } else {
        setLeaderboardData([]);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, [currentUser]);

  const topThree = leaderboardData.slice(0, 3);

  const filteredList = leaderboardData.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesRank = filterRank === 'all' || item.rank === filterRank;
    return matchesSearch && matchesRank;
  });

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Ranking Oficial • Participantes del Grupo</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight font-[Orbitron] ${isDark ? 'text-white' : 'text-slate-900'}`}>
            HALL OF <span className="gradient-text-blue">HACKERS</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Clasificación oficial basada en los puntos reales obtenidos al resolver laboratorios CTF.
          </p>
        </motion.div>

        {/* Podium Top 3 if at least 3 exist */}
        {topThree.length >= 3 ? (
          <LeaderboardPodium topThree={topThree} />
        ) : null}

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-mono border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              onClick={() => setFilterRank('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors shrink-0 ${
                filterRank === 'all'
                  ? 'bg-purple-600 text-white font-bold'
                  : isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              Todos ({leaderboardData.length})
            </button>
            {Object.keys(RANKS).map((rank) => (
              <button
                key={rank}
                onClick={() => setFilterRank(rank)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors shrink-0 ${
                  filterRank === rank
                    ? 'bg-purple-600 text-white font-bold'
                    : isDark ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {RANKS[rank as keyof typeof RANKS].icon} {rank}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${
          isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-400" />
              <h3 className="text-base font-bold font-mono mb-1">Aún no hay estudiantes en la clasificación</h3>
              <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto mb-4">
                Conecta Supabase o resuelve tu primer laboratorio para figurar en la tabla de posiciones.
              </p>
              <Link to="/labs" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold">
                Ir a los Labs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-mono uppercase tracking-wider ${
                    isDark ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}>
                    <th className="py-3.5 px-4 text-center w-16">#</th>
                    <th className="py-3.5 px-4">Estudiante / Alias</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Especialidad</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Rango</th>
                    <th className="py-3.5 px-4 text-center">Labs Resueltos</th>
                    <th className="py-3.5 px-4 text-right">Puntos Totales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredList.map((entry) => {
                    const isCurrent = currentUser && entry.username.toLowerCase() === currentUser.username.toLowerCase();
                    const rankConfig = RANKS[entry.rank] || RANKS['Script Kiddie'];

                    return (
                      <tr
                        key={entry.userId}
                        className={`text-xs font-mono transition-colors ${
                          isCurrent
                            ? isDark ? 'bg-purple-950/30 font-semibold' : 'bg-purple-50 font-semibold'
                            : isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Rank Position */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          {entry.rankPosition === 1 ? (
                            <span className="text-amber-400">🥇</span>
                          ) : entry.rankPosition === 2 ? (
                            <span className="text-slate-300">🥈</span>
                          ) : entry.rankPosition === 3 ? (
                            <span className="text-amber-600">🥉</span>
                          ) : (
                            <span className="text-slate-500">#{entry.rankPosition}</span>
                          )}
                        </td>

                        {/* User Info */}
                        <td className="py-3.5 px-4">
                          <Link to={`/profile/${entry.username}`} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                              <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold block group-hover:text-purple-400 transition-colors">
                                {entry.fullName || entry.username}
                                {isCurrent && (
                                  <span className="ml-2 text-[10px] text-purple-400 font-normal bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                                    (Tú)
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-500">@{entry.username}</span>
                            </div>
                          </Link>
                        </td>

                        {/* Specialty */}
                        <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                          {entry.specialty}
                        </td>

                        {/* Rank Tier */}
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rankConfig.badgeBg} ${rankConfig.badgeColor} ${rankConfig.badgeBorder}`}>
                            <span>{rankConfig.icon}</span>
                            <span>{entry.rank}</span>
                          </span>
                        </td>

                        {/* Solves Count */}
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                          {entry.solvedCount}
                        </td>

                        {/* Total Points */}
                        <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                          {entry.points.toLocaleString()} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Leaderboard;
