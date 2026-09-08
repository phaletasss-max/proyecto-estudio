import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, User, Sparkles } from 'lucide-react';
import type { LabComment } from '@/types/ctf';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface LabDiscussionProps {
  labSlug: string;
  initialComments?: LabComment[];
}

export const LabDiscussion: React.FC<LabDiscussionProps> = ({ labSlug, initialComments }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const defaultComments: LabComment[] = [];

  const [comments, setComments] = useState<LabComment[]>(initialComments && initialComments.length > 0 ? initialComments : defaultComments);
  const [newComment, setNewComment] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: LabComment = {
      id: `c_${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatarUrl,
      userRank: user.rank,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 1,
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleUpvote = (id: string) => {
    if (upvotedIds.has(id)) return;
    setUpvotedIds((prev) => new Set(prev).add(id));
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Post comment box */}
      <form
        onSubmit={handlePost}
        className={`p-5 rounded-2xl border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <label className="block text-xs font-mono font-bold mb-2 flex items-center gap-1.5 text-purple-400">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Discusión técnica</span>
        </label>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            user
              ? 'Comparte un tip, pista o pregunta sobre este laboratorio sin dar spoilers directos de la flag...'
              : 'Inicia sesión para participar en la discusión...'
          }
          disabled={!user}
          rows={3}
          className={`w-full p-3 rounded-xl text-xs font-mono border focus:outline-none transition-colors resize-none ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
          }`}
        />

        <div className="flex justify-between items-center mt-3">
          <span className="text-[10px] font-mono text-slate-500">
            {comments.length} comentarios de la comunidad
          </span>

          <button
            type="submit"
            disabled={!user || !newComment.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>Publicar</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((c) => {
          const isUpvoted = upvotedIds.has(c.id);

          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex w-7 h-7 items-center justify-center rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0 text-[10px] font-bold text-slate-300">
                    {c.userAvatar ? <img src={c.userAvatar} width="28" height="28" alt="" className="w-full h-full object-cover" /> : c.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold font-mono text-white mr-2">
                      @{c.username}
                    </span>
                    <span className="text-[9px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                      {c.userRank}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(c.createdAt).toLocaleDateString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className={`text-xs font-mono leading-relaxed pl-9 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {c.content}
              </p>

              <div className="flex justify-end mt-2 pl-9">
                <button
                  type="button"
                  onClick={() => handleUpvote(c.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                    isUpvoted
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : isDark
                        ? 'bg-slate-800/60 text-slate-400 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{c.upvotes} útil</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
