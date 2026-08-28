import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, HelpCircle, Sparkles, Send, Lock, Unlock, AlertCircle } from 'lucide-react';
import type { LabTask, TaskQuestion } from '@/types/ctf';
import { useTheme } from '@/context/ThemeContext';
import { verifyFlag } from '@/utils/crypto';

interface TaskSectionProps {
  tasks: LabTask[];
  onQuestionSolved?: (questionId: string, points: number) => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({ tasks, onQuestionSolved }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [expandedTaskId, setExpandedTaskId] = useState<string>(tasks[0]?.id || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? '' : taskId);
  };

  const toggleHint = (questionId: string) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleAnswerSubmit = async (q: TaskQuestion) => {
    const val = answers[q.id]?.trim();
    if (!val || solvedQuestions.has(q.id) || verifying) return;

    setVerifying(q.id);
    setErrors((prev) => ({ ...prev, [q.id]: '' }));

    try {
      // Validate either against answerHash (SHA256) or direct string match
      const isMatch = await verifyFlag(val, q.answerHash) || val.toLowerCase() === q.answerHash.toLowerCase();

      if (isMatch) {
        setSolvedQuestions((prev) => new Set(prev).add(q.id));
        if (onQuestionSolved) onQuestionSolved(q.id, q.points);
      } else {
        setErrors((prev) => ({ ...prev, [q.id]: 'Respuesta incorrecta. Revisa la pista o inspecciona el código.' }));
        setTimeout(() => {
          setErrors((prev) => ({ ...prev, [q.id]: '' }));
        }, 3500);
      }
    } catch {
      setErrors((prev) => ({ ...prev, [q.id]: 'Error de verificación.' }));
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isExpanded = expandedTaskId === task.id;
        const totalQ = task.questions.length;
        const solvedQ = task.questions.filter((q) => solvedQuestions.has(q.id)).length;
        const isTaskDone = totalQ > 0 && solvedQ === totalQ;

        return (
          <div
            key={task.id}
            className={`rounded-2xl border overflow-hidden transition-all ${
              isTaskDone
                ? isDark ? 'bg-emerald-950/15 border-emerald-500/30' : 'bg-emerald-50/50 border-emerald-200'
                : isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Task Header */}
            <div
              onClick={() => toggleTask(task.id)}
              className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none hover:bg-slate-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    isTaskDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  {isTaskDone ? <CheckCircle2 className="w-4 h-4" /> : task.taskNumber}
                </div>

                <div>
                  <h4 className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {solvedQ} de {totalQ} preguntas completadas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Task Body */}
            {isExpanded && (
              <div className={`p-5 sm:p-6 border-t ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {task.description}
                </p>

                {/* Questions */}
                <div className="space-y-5">
                  {task.questions.map((q, qIdx) => {
                    const isSolved = solvedQuestions.has(q.id);
                    const isHintOpen = revealedHints.has(q.id);
                    const error = errors[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isSolved
                            ? isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                            : isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Question Title */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className={`text-xs font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {qIdx + 1}. {q.question}
                          </span>
                          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            +{q.points} pts
                          </span>
                        </div>

                        {/* Input or Solved state */}
                        {isSolved ? (
                          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>¡Respuesta correcta! Puntos acreditados.</span>
                          </div>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAnswerSubmit(q);
                            }}
                            className="flex flex-col sm:flex-row gap-2 mt-3"
                          >
                            <input
                              type="text"
                              value={answers[q.id] || ''}
                              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder={q.answerFormat || 'Ingresa tu respuesta...'}
                              className={`flex-1 px-3.5 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-colors ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500'
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
                              }`}
                            />

                            <button
                              type="submit"
                              disabled={verifying === q.id || !answers[q.id]?.trim()}
                              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                            >
                              {verifying === q.id ? (
                                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <span>Submit</span>
                                  <Send className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          </form>
                        )}

                        {error && (
                          <div className="mt-2 text-xs font-mono text-rose-400 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {/* Hint Button & Box */}
                        {q.hint && (
                          <div className="mt-3">
                            <button
                              type="button"
                              onClick={() => toggleHint(q.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>{isHintOpen ? 'Ocultar Pista' : '💡 Ver Pista'}</span>
                            </button>

                            {isHintOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-2 p-3 rounded-xl border text-[11px] font-mono leading-relaxed ${
                                  isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-800'
                                }`}
                              >
                                {q.hint}
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
