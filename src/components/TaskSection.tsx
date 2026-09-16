import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, HelpCircle, Send } from 'lucide-react';
import type { LabTask, TaskQuestion } from '@/types/ctf';
import { useTheme } from '@/context/ThemeContext';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { WriteupRenderer } from '@/components/WriteupRenderer';

interface TaskSectionProps {
  tasks: LabTask[];
  onQuestionSolved?: (questionId: string, points: number) => void;
}

interface StepAnswerResult {
  accepted: boolean;
  already_completed: boolean;
  points_earned: number;
  explanation: string;
}

interface HintResult {
  content: string;
  hint_number: number;
  point_penalty: number;
}

export const TaskSection: React.FC<TaskSectionProps> = ({ tasks, onQuestionSolved }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const [expandedTaskId, setExpandedTaskId] = useState(tasks[0]?.id || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solvedQuestions, setSolvedQuestions] = useState<Set<string>>(new Set());
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, HintResult[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<string | null>(null);
  const [hintPreview, setHintPreview] = useState<Record<string, { hint_number: number; point_penalty: number }>>({});
  const [progressError, setProgressError] = useState(false);

  const friendlyError = (error: unknown, fallback: string) => {
    const message = typeof error === 'object' && error && 'message' in error ? String(error.message) : '';
    return /^(Debes iniciar|Tu cuenta|Completa|Demasiados|No hay|El paso|La pista cambió)/.test(message) ? message : fallback;
  };

  useEffect(() => {
    if (!isSupabaseConfigured() || !user || tasks.length === 0) return;
    const stepIds = tasks.flatMap((task) => task.questions.map((question) => question.id));
    if (stepIds.length === 0) return;

    let active = true;
    supabase
      .from('lab_step_progress')
      .select('step_id')
      .eq('user_id', user.id)
      .in('step_id', stepIds)
      .then(({ data, error }) => { if (active) { setProgressError(!!error); setSolvedQuestions(new Set((data || []).map((row) => row.step_id))); } });
    // Restore only the expanded activity's hints, avoiding one request per catalog step.
    return () => { active = false; };
  }, [tasks, user?.id]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;
    let active = true;
    const questions = tasks.find(task => task.id === expandedTaskId)?.questions || [];
    for (const question of questions) {
      if (!question.hintCount) continue;
      supabase.rpc('get_unlocked_hints', { p_step_id: question.id }).then(({ data, error }) => {
        if (!active) return;
        if (error) setErrors(current => ({ ...current, [question.id]: 'No se pudieron recuperar tus pistas. Vuelve a abrir este paso.' }));
        else setHints(current => ({ ...current, [question.id]: data || [] }));
      });
    }
    return () => { active = false; };
  }, [tasks, expandedTaskId, user?.id]);

  const revealNextHint = async (question: TaskQuestion) => {
    if (!isSupabaseConfigured() || loadingHint) return;
    if (!user) { setErrors(current => ({ ...current, [question.id]: 'Inicia sesión para guardar tus pistas.' })); return; }
    setLoadingHint(question.id);
    setErrors((current) => ({ ...current, [question.id]: '' }));
    try {
      if (!hintPreview[question.id]) {
        const { data, error } = await supabase.rpc('preview_next_hint', { p_step_id: question.id });
        if (error) throw error;
        const preview = Array.isArray(data) ? data[0] : data;
        if (!preview) throw new Error('No hay más pistas disponibles.');
        setHintPreview(current => ({ ...current, [question.id]: preview }));
        return;
      }
      const preview = hintPreview[question.id];
      const { data, error } = await supabase.rpc('reveal_confirmed_hint', { p_step_id: question.id, p_hint_number: preview.hint_number, p_point_penalty: preview.point_penalty });
      if (error) throw error;
      const result = (Array.isArray(data) ? data[0] : data) as HintResult | null;
      if (!result?.content) throw new Error('No hay más pistas disponibles.');
      setHints((current) => ({ ...current, [question.id]: [...(current[question.id] || []).filter(hint => hint.hint_number !== result.hint_number), result] }));
      setHintPreview(current => { const next = { ...current }; delete next[question.id]; return next; });
    } catch (error) {
      setHintPreview(current => { const next = { ...current }; delete next[question.id]; return next; });
      setErrors((current) => ({ ...current, [question.id]: friendlyError(error, 'No se pudo cargar la pista.') }));
    } finally {
      setLoadingHint(null);
    }
  };

  const handleAnswerSubmit = async (question: TaskQuestion) => {
    const answer = answers[question.id]?.trim();
    if (!answer || solvedQuestions.has(question.id) || verifying) return;
    if (!user) { setErrors(current => ({ ...current, [question.id]: 'Inicia sesión para validar y guardar tu respuesta.' })); return; }
    if (!isSupabaseConfigured()) {
      setErrors((current) => ({ ...current, [question.id]: 'La validación de respuestas requiere Supabase; no hay verificadores en el navegador.' }));
      return;
    }

    setVerifying(question.id);
    setErrors((current) => ({ ...current, [question.id]: '' }));
    try {
      const { data, error } = await supabase.rpc('submit_step_answer', { p_step_id: question.id, p_answer: answer });
      if (error) throw error;
      const result = (Array.isArray(data) ? data[0] : data) as StepAnswerResult | null;
      if (!result?.accepted) {
        setErrors((current) => ({ ...current, [question.id]: 'Respuesta incorrecta. Revisa la evidencia o solicita una pista.' }));
        return;
      }

      setSolvedQuestions((current) => new Set(current).add(question.id));
      if (result.explanation) setExplanations((current) => ({ ...current, [question.id]: result.explanation }));
      setAnswers((current) => ({ ...current, [question.id]: '' }));
      onQuestionSolved?.(question.id, result.points_earned || 0);
    } catch (error) {
      setErrors((current) => ({ ...current, [question.id]: friendlyError(error, 'No se pudo validar la respuesta. Inténtalo nuevamente.') }));
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="space-y-3">
      {!user && <p className="rounded-lg border border-violet-500/30 p-4 text-sm">Puedes leer el reto. Usa «Ingresar» para descargar los archivos y guardar tus respuestas.</p>}
      {progressError && <p role="alert" className="text-sm text-danger">No se pudo recuperar el progreso. Recarga la página antes de continuar.</p>}
      {tasks.map((task) => {
        const isExpanded = expandedTaskId === task.id;
        const solvedCount = task.questions.filter((question) => solvedQuestions.has(question.id)).length;
        const completed = task.questions.length > 0 && solvedCount === task.questions.length;

        return (
          <section key={task.id} className={`overflow-hidden rounded-xl border ${completed ? 'border-emerald-500/30 bg-emerald-950/10' : isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white'}`}>
            <button type="button" onClick={() => setExpandedTaskId(isExpanded ? '' : task.id)} aria-expanded={isExpanded} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-500/5">
              <span className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${completed ? 'bg-emerald-500 text-white' : 'bg-violet-500/15 text-accent'}`}>{completed ? <CheckCircle2 className="h-4 w-4" /> : task.taskNumber}</span>
                <span><strong className={isDark ? 'text-white' : 'text-slate-900'}>{task.title}</strong><small className="mt-0.5 block text-xs text-muted">{solvedCount} de {task.questions.length} actividades completadas</small></span>
              </span>
              <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className={`border-t p-5 sm:p-6 ${isDark ? 'border-slate-800 bg-slate-900/35' : 'border-slate-200 bg-slate-50'}`}>
                <div className="mb-6"><WriteupRenderer content={task.description} /></div>
                <div className="space-y-5">
                  {task.questions.map((question, index) => {
                    const solved = solvedQuestions.has(question.id);
                    const revealed = hints[question.id] || [];
                    const remainingHints = Math.max((question.hintCount || 0) - revealed.length, 0);
                    return (
                      <article key={question.id} className={`rounded-xl border p-4 ${solved ? 'border-emerald-500/30 bg-emerald-500/5' : isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm font-semibold leading-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{index + 1}. {question.question}</p>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-violet-500/10 px-2 py-1 text-xs text-accent">Paso guiado</span>
                        </div>

                        {solved ? (
                          <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-success"><p className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Respuesta validada por el servidor.</p>{explanations[question.id] && <p className="mt-2 leading-6 text-foreground">{explanations[question.id]}</p>}</div>
                        ) : (
                          <form onSubmit={(event) => { event.preventDefault(); void handleAnswerSubmit(question); }} className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <label className="sr-only" htmlFor={`answer-${question.id}`}>Respuesta para {question.question}</label>
                            <input id={`answer-${question.id}`} value={answers[question.id] || ''} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} autoComplete="off" placeholder={question.answerFormat || 'Escribe tu respuesta'} className={`min-h-11 min-w-0 flex-1 rounded-lg border px-3 font-mono text-sm outline-none focus:border-violet-400 ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                            <button type="submit" disabled={!answers[question.id]?.trim() || verifying === question.id} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /> {verifying === question.id ? 'Validando…' : 'Validar'}</button>
                          </form>
                        )}

                        <div aria-live="polite">
                          {errors[question.id] && <p className="mt-3 flex items-start gap-2 text-sm text-danger"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {errors[question.id]}</p>}
                          {revealed.map((hint) => <div key={hint.hint_number} className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 text-sm leading-6 text-info"><strong>Pista {hint.hint_number}:</strong> {hint.content}{hint.point_penalty > 0 && <span className="ml-2 text-amber-300">−{hint.point_penalty} pts</span>}</div>)}
                        </div>

                        {!solved && remainingHints > 0 && <button type="button" onClick={() => void revealNextHint(question)} disabled={loadingHint === question.id} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-info hover:text-info disabled:opacity-50"><HelpCircle className="h-4 w-4" /> {loadingHint === question.id ? 'Cargando…' : hintPreview[question.id] ? `Revelar pista ${hintPreview[question.id].hint_number} · ${hintPreview[question.id].point_penalty === 0 ? 'sin coste' : `−${hintPreview[question.id].point_penalty} pts del laboratorio`}` : `Consultar siguiente pista (${remainingHints})`}</button>}
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
