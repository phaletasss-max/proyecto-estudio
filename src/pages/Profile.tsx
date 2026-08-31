import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Trophy,
  Award,
  Calendar,
  Globe,
  Link2,
  MessageSquare,
  Sparkles,
  Edit3,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { RANKS, type UserProfile, type UserSolve } from '@/types/auth';
import { BADGES_CATALOG } from '@/data/badges';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BadgeCard } from '@/components/BadgeCard';
import { EditProfileModal } from '@/components/EditProfileModal';
import { CertificateModal } from '@/components/CertificateModal';

export const Profile: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'solved' | 'badges' | 'skills'>('solved');
  const [targetUser, setTargetUser] = useState<UserProfile | null>(currentUser);
  const [loadingUser, setLoadingUser] = useState(false);

  const isOwnProfile = !username || (currentUser && currentUser.username.toLowerCase() === username.toLowerCase());

  useEffect(() => {
    if (isOwnProfile) {
      setTargetUser(currentUser);
      return;
    }

    if (username && isSupabaseConfigured()) {
      setLoadingUser(true);
      supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setTargetUser({
              id: data.id,
              username: data.username,
              fullName: data.full_name,
              avatarUrl: data.avatar_url || '/logo-shadowbytes.png',
              bio: data.bio || '',
              specialty: data.specialty || 'Ciberseguridad',
              points: data.points || 0,
              rank: data.rank || 'Script Kiddie',
              accessStatus: data.access_status || 'applicant',
              githubUrl: data.github_url || '',
              discordTag: data.discord_tag || '',
              linkedinUrl: data.linkedin_url || '',
              solvedLabs: [],
              unlockedBadges: [],
              createdAt: data.created_at || new Date().toISOString(),
            });
          } else {
            setTargetUser(null);
          }
          setLoadingUser(false);
        });
    } else {
      setTargetUser(null);
    }
  }, [username, currentUser, isOwnProfile]);

  if (!targetUser) {
    return (
      <section className="pt-32 pb-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-mono text-slate-500 mb-4">Usuario no encontrado o no has iniciado sesión.</p>
          <Link to="/labs" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold">
            Explorar Labs
          </Link>
        </div>
      </section>
    );
  }

  const rankInfo = RANKS[targetUser.rank] || RANKS['Script Kiddie'];

  // Progress to next rank
  const rankList = Object.values(RANKS);
  const currentRankIdx = rankList.findIndex((r) => r.tier === targetUser?.rank);
  const nextRank = rankList[currentRankIdx + 1] || null;
  const progressPercent = nextRank
    ? Math.min(100, Math.max(0, ((targetUser.points - rankInfo.minPoints) / (nextRank.minPoints - rankInfo.minPoints)) * 100))
    : 100;

  // Category breakdown for skills
  const categoriesList = ['Forensics', 'Web', 'Network', 'Crypto', 'Pwn', 'Reversing', 'Misc'];
  const solvedByCategory: Record<string, number> = {};
  targetUser.solvedLabs.forEach((s) => {
    solvedByCategory[s.category] = (solvedByCategory[s.category] || 0) + 1;
  });

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative rounded-3xl border overflow-hidden shadow-2xl p-6 sm:p-8 mb-8 ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Cyber Glow */}
          <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-purple-600/20 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-purple-500/40 p-1 bg-slate-900 shadow-xl shadow-purple-500/20">
                  <img src={targetUser.avatarUrl} alt={targetUser.username} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-lg shadow">
                  {rankInfo.icon}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-[Orbitron] tracking-wide">
                    {targetUser.fullName || targetUser.username}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${rankInfo.badgeBg} ${rankInfo.badgeColor} ${rankInfo.badgeBorder}`}>
                    {targetUser.rank}
                  </span>
                </div>

                <p className="text-xs font-mono text-purple-400 font-semibold mb-2">@{targetUser.username} • {targetUser.specialty}</p>

                <p className={`text-xs max-w-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {targetUser.bio || 'Sin biografía.'}
                </p>

                {/* Social Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  {targetUser.githubUrl && (
                    <a
                      href={targetUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-[11px] font-mono transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {targetUser.discordTag && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{targetUser.discordTag}</span>
                    </span>
                  )}
                  {targetUser.linkedinUrl && (
                    <a
                      href={targetUser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-[11px] font-mono transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Points & Edit button */}
            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
              <div className={`p-4 rounded-2xl border text-center md:text-right w-full sm:w-auto ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  Puntuación Global
                </span>
                <span className="text-3xl font-extrabold font-mono text-amber-400 flex items-center justify-center md:justify-end gap-1.5">
                  <Sparkles className="w-6 h-6" />
                  {targetUser.points.toLocaleString()} PTS
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                  {targetUser.solvedLabs.length} Labs Resueltos • {targetUser.unlockedBadges.length} Badges
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {isOwnProfile && (
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                      isDark ? 'border-slate-700 hover:border-purple-500 hover:bg-slate-900 text-white' : 'border-slate-300 hover:border-purple-500 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Editar Perfil</span>
                  </button>
                )}

                <button
                  onClick={() => setCertModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-purple-600/20 active:scale-95"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  <span>Certificado</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rank Progress Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Flame className="w-4 h-4 text-purple-400" />
                Progreso de Rango: <strong className={rankInfo.badgeColor}>{targetUser.rank}</strong>
              </span>
              {nextRank ? (
                <span className="text-slate-400">
                  Próximo Rango: <strong className="text-cyan-400">{nextRank.tier}</strong> ({nextRank.minPoints} pts)
                </span>
              ) : (
                <span className="text-amber-400 font-bold">¡RANGO MÁXIMO ALCANZADO! 👑</span>
              )}
            </div>

            <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Profile Tabs */}
        <div className="flex border-b border-slate-800 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('solved')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-bold border-b-2 transition-all ${
              activeTab === 'solved'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🎯 Labs Resueltos ({targetUser.solvedLabs.length})
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-bold border-b-2 transition-all ${
              activeTab === 'badges'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            🏆 Insignias & Logros ({targetUser.unlockedBadges.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-bold border-b-2 transition-all ${
              activeTab === 'skills'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            📊 Matriz de Habilidades
          </button>
        </div>

        {/* Tab 1: Solved Labs */}
        {activeTab === 'solved' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {targetUser.solvedLabs.length === 0 ? (
              <div className={`p-12 text-center rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple-400" />
                <p className="text-xs font-mono text-slate-400 mb-4">Aún no has resuelto ningún reto CTF.</p>
                <Link to="/labs" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold">
                  Comenzar con un Lab
                </Link>
              </div>
            ) : (
              targetUser.solvedLabs.map((solve: UserSolve) => (
                <div
                  key={solve.labId}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${
                    isDark ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40' : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <Link to={`/lab/${solve.labSlug}`} className="hover:underline">
                        <h4 className="font-mono font-bold text-sm text-white hover:text-purple-300 transition-colors">
                          {solve.labTitle}
                        </h4>
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span className="text-cyan-400">[{solve.category}]</span>
                        <span>•</span>
                        <span>{solve.difficulty}</span>
                        <span>•</span>
                        <span>{new Date(solve.solvedAt).toLocaleDateString('es-PE')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{solve.pointsEarned} pts
                    </span>
                    <Link
                      to={`/lab/${solve.labSlug}`}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                      title="Ver writeup"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Tab 2: Badges Showcase */}
        {activeTab === 'badges' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES_CATALOG.map((badge) => {
              const isUnlocked = targetUser?.unlockedBadges.includes(badge.code) || false;
              return <BadgeCard key={badge.code} badge={badge} isUnlocked={isUnlocked} />;
            })}
          </motion.div>
        )}

        {/* Tab 3: Skills Matrix */}
        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-purple-400 mb-4">
                Progreso por Categoría de CTF
              </h3>
              <div className="space-y-4">
                {categoriesList.map((cat) => {
                  const count = solvedByCategory[cat] || 0;
                  const percent = Math.min(100, count * 35);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">{cat}</span>
                        <span className="text-purple-400 font-bold">{count} completados</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-cyan-400 mb-3">
                  Resumen de Carrera Hacker
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Tu perfil evoluciona conforme resuelves retos y aportas soluciones a la comunidad de SENATI.
                </p>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Tasa de Éxito</span>
                    <span className="text-base font-bold text-emerald-400">100%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Especialidad Top</span>
                    <span className="text-base font-bold text-cyan-400">{targetUser.specialty}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Badges Obtenidos</span>
                    <span className="text-base font-bold text-amber-400">{targetUser.unlockedBadges.length} / 10</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Miembro Desde</span>
                    <span className="text-base font-bold text-purple-400">
                      {new Date(targetUser.createdAt).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/paths"
                className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors"
              >
                <span>Explorar Rutas de Aprendizaje</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Edit Modal */}
        {isOwnProfile && <EditProfileModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} />}

        {/* Certificate Modal */}
        <CertificateModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} user={targetUser} />
      </div>
    </section>
  );
};

export default Profile;
