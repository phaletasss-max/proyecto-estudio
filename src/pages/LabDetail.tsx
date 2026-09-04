import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Lock,
  Unlock,
  User,
  Calendar,
  Tag,
  Sparkles,
  CheckCircle2,
  Terminal,
  FileText,
  MessageSquare,
  Layers,
  Clock,
} from 'lucide-react';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { FlagInput } from '@/components/FlagInput';
import { WriteupRenderer } from '@/components/WriteupRenderer';
import { AchievementModal } from '@/components/AchievementModal';
import { CyberTerminal } from '@/components/CyberTerminal';
import { TaskSection } from '@/components/TaskSection';
import { LabDiscussion } from '@/components/LabDiscussion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLabDetail } from '@/hooks/useLabDetail';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CATEGORY_ICONS } from '@/types/ctf';
import type { Badge } from '@/types/auth';

export const LabDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, submitFlag } = useAuth();
  const { lab, loading, error } = useLabDetail(slug || '');

  const [activeTab, setActiveTab] = useState<'tasks' | 'terminal' | 'writeup' | 'discussion'>('tasks');
  const [writeupUnlocked, setWriteupUnlocked] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [awardedBadges, setAwardedBadges] = useState<Badge[]>([]);
  const [secureWriteup, setSecureWriteup] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'error'>('idle');

  const isAlreadySolved = user?.solvedLabs.some((s) => s.labSlug === slug || (lab && s.labId === lab.id)) || false;
  const canViewWriteup = writeupUnlocked || isAlreadySolved;

  useEffect(() => {
    if (!lab || !canViewWriteup || !isSupabaseConfigured() || secureWriteup !== null) return;

    supabase.rpc('get_challenge_writeup', { p_lab_id: lab.id })
      .then(({ data, error: writeupError }) => {
        if (writeupError) {
          console.error('No se pudo cargar el writeup protegido:', writeupError.message);
          return;
        }
        setSecureWriteup(data || '');
      });
  }, [lab, canViewWriteup, secureWriteup]);

  const handleFlagSubmission = async (flag: string) => {
    if (!lab) {
      return { accepted: false, alreadySolved: false, message: 'Reto no disponible.' };
    }

    const result = await submitFlag({
        id: lab.id,
        slug: lab.slug,
        title: lab.title,
        category: lab.category,
        difficulty: lab.difficulty,
      }, flag);

    if (result.accepted) {
      setWriteupUnlocked(true);
      if (!result.alreadySolved) {
        setPointsAwarded(result.pointsEarned);
        setAwardedBadges(result.newBadges);
        setAchievementModalOpen(true);
      }
    }

    return result;
  };

  const handleQuestionSolved = (_questionId: string, _points: number) => {
    // When an individual task question is solved
  };

  const handleSecureDownload = async () => {
    const storagePath = lab?.zip_url;
    if (!storagePath || !isSupabaseConfigured()) return;
    setDownloadState('loading');
    const { data, error: signedUrlError } = await supabase.storage.from('ctf-zips').createSignedUrl(storagePath, 60);
    if (signedUrlError || !data?.signedUrl) {
      setDownloadState('error');
      return;
    }
    window.location.assign(data.signedUrl);
    setDownloadState('idle');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !lab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <p className={`font-mono text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error || 'Lab no encontrado'}
        </p>
        <Link to="/labs" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
          ← Volver a Labs
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(lab.created_at).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/labs"
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium mb-6 transition-colors ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo de Labs
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl border p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden ${
            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-purple-600/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <DifficultyBadge difficulty={lab.difficulty} />

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span>{CATEGORY_ICONS[lab.category]}</span>
                {lab.category}
              </span>

              {lab.framework && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                  <span>⚡</span>
                  <span>{lab.framework}</span>
                </span>
              )}
            </div>

            {isAlreadySolved && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PWNED / RESUELTO
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-[Orbitron] mb-3 relative z-10">
            {lab.title}
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed mb-5 relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {lab.description}
          </p>

          {/* Tags */}
          {lab.tags && (
            <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
              {lab.tags.map((t) => (
                <span
                  key={t}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isDark ? 'bg-slate-900 border border-slate-800 text-slate-400' : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Metadata info */}
          <div className={`flex flex-wrap items-center gap-4 text-xs font-mono pt-4 border-t border-slate-800/80 relative z-10 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              {lab.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              ~{lab.estimatedMinutes || 60} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {formattedDate}
            </span>
          </div>

          {/* ZIP Download Link */}
          {lab.zip_url && (
            <div className="mt-5 relative z-10">
              <button
                type="button"
                onClick={handleSecureDownload}
                disabled={downloadState === 'loading'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{downloadState === 'loading' ? 'Preparando enlace…' : 'Descargar archivos (enlace privado)'}</span>
              </button>
              {downloadState === 'error' && <p className="mt-2 text-xs text-red-400" role="alert">No se pudo autorizar la descarga. Comprueba tu sesión o membresía.</p>}
            </div>
          )}
        </motion.div>

        {/* Navigation Tabs (TryHackMe Style) */}
        <div role="tablist" aria-label="Secciones del reto" className={`flex items-center gap-2 p-1.5 rounded-2xl border mb-6 overflow-x-auto ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('tasks')}
            role="tab"
            aria-selected={activeTab === 'tasks'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-purple-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tareas ({lab.tasks?.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            role="tab"
            aria-selected={activeTab === 'terminal'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'terminal'
                ? 'bg-purple-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal guiada</span>
          </button>

          <button
            onClick={() => setActiveTab('writeup')}
            role="tab"
            aria-selected={activeTab === 'writeup'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'writeup'
                ? 'bg-purple-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Guía {canViewWriteup ? '🔓' : '🔒'}</span>
          </button>

          <button
            onClick={() => setActiveTab('discussion')}
            role="tab"
            aria-selected={activeTab === 'discussion'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
              activeTab === 'discussion'
                ? 'bg-purple-600 text-white shadow-md'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comunidad</span>
          </button>
        </div>

        {/* Tab 1: Tasks & Questions */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {lab.tasks && lab.tasks.length > 0 ? (
              <TaskSection tasks={lab.tasks} onQuestionSolved={handleQuestionSolved} />
            ) : (
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-xs font-mono text-slate-400">
                  Este laboratorio cuenta con validación directa de flag a continuación.
                </p>
              </div>
            )}

            {/* Root Flag Submission Box */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {canViewWriteup ? <Unlock className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                  <h3 className="text-sm font-bold font-mono">Flag principal del reto</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{lab.difficulty === 'Insane' ? 1000 : lab.difficulty === 'Hard' ? 500 : lab.difficulty === 'Medium' ? 250 : 100} pts
                </span>
              </div>

              <FlagInput onSubmit={handleFlagSubmission} disabled={canViewWriteup} />
            </div>
          </div>
        )}

        {/* Tab 2: AttackBox Terminal */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <CyberTerminal labSlug={lab.slug} />
          </div>
        )}

        {/* Tab 3: Writeup Guide */}
        {activeTab === 'writeup' && (
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            {canViewWriteup ? (
              <WriteupRenderer content={secureWriteup ?? 'Cargando writeup protegido…'} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Lock className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="text-base font-bold font-mono mb-1">Writeup Protegido con Cifrado</h4>
                <p className="text-xs font-mono text-slate-400 max-w-md mb-6">
                  Resuelve las tareas o ingresa la Flag del laboratorio en la pestaña "Tareas" para desbloquear la guía completa de resolución.
                </p>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold"
                >
                  Ir a Tareas & Flag
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Discussion */}
        {activeTab === 'discussion' && (
          <div className="space-y-4">
            <LabDiscussion labSlug={lab.slug} initialComments={lab.comments} />
          </div>
        )}

        {/* Achievement Modal */}
        <AchievementModal
          isOpen={achievementModalOpen}
          onClose={() => setAchievementModalOpen(false)}
          labTitle={lab.title}
          pointsEarned={pointsAwarded}
          newBadges={awardedBadges}
        />
      </div>
    </section>
  );
};

export default LabDetail;
