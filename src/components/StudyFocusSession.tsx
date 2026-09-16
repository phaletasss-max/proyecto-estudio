import { useEffect, useMemo, useState } from 'react';
import { Clock3, History, PauseCircle, Play } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { completedFocusMinutes, focusRemainingSeconds, formatFocusTime } from '@/lib/study';
import { supabase } from '@/lib/supabase';
import type { StudySession } from '@/types/study';

const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border px-4 py-2 text-sm font-semibold hover:bg-elevated disabled:opacity-50';
const input = 'sb-study-input w-full min-h-11 rounded-control border border-border bg-background p-3 text-sm';

interface ActiveFocus {
  startedAt: number;
  durationMinutes: number;
}

interface StudyFocusSessionProps {
  resourceId: string;
  nextAction: string;
  onSessionSaved: () => void;
}

function restoreActiveFocus(raw: string | null): ActiveFocus | null {
  try {
    const value = JSON.parse(raw || 'null');
    if (!value || typeof value.startedAt !== 'number' || ![25, 45, 60].includes(value.durationMinutes)) return null;
    if (value.startedAt > Date.now() || Date.now() - value.startedAt > 4 * 60 * 60 * 1000) return null;
    return value;
  } catch { return null; }
}

export function StudyFocusSession({ resourceId, nextAction, onSessionSaved }: StudyFocusSessionProps) {
  const { user } = useAuth();
  const storageKey = `shadowbytes:focus:${user?.id}:${resourceId}`;
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [active, setActive] = useState<ActiveFocus | null>(() => {
    try { return restoreActiveFocus(localStorage.getItem(storageKey)); } catch { return null; }
  });
  const [now, setNow] = useState(Date.now());
  const [outcome, setOutcome] = useState('');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [historyError, setHistoryError] = useState(false);
  const remaining = active ? focusRemainingSeconds(active.startedAt, active.durationMinutes, now) : durationMinutes * 60;
  const elapsed = active ? Math.min(active.durationMinutes, Math.max(0, Math.floor((now - active.startedAt) / 60000))) : 0;
  const timerLabel = useMemo(() => formatFocusTime(remaining), [remaining]);

  const loadSessions = async () => {
    if (!user) return;
    const { data, error } = await supabase.from('study_sessions')
      .select('id,resource_id,started_at,ended_at,duration_minutes,outcome,next_action,created_at')
      .eq('user_id', user.id).eq('resource_id', resourceId).order('created_at', { ascending: false }).limit(5);
    setHistoryError(!!error);
    if (!error) setSessions(data || []);
  };

  useEffect(() => { void loadSessions(); }, [user?.id, resourceId]);
  useEffect(() => {
    if (!active) return;
    try { localStorage.setItem(storageKey, JSON.stringify(active)); } catch { /* Timer still works in memory. */ }
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [active, storageKey]);

  const start = () => {
    const next = { startedAt: Date.now(), durationMinutes };
    setActive(next); setNow(next.startedAt); setNotice('Sesión iniciada. Trabaja una sola hipótesis y conserva la evidencia.');
  };
  const cancel = () => {
    try { localStorage.removeItem(storageKey); } catch { /* No persisted timer to remove. */ }
    setActive(null); setOutcome(''); setNotice('Sesión cancelada sin guardar un registro.');
  };
  const finish = async () => {
    if (!active || !user) return;
    if (outcome.trim().length < 10) { setNotice('Resume en al menos 10 caracteres qué comprobaste o dónde te bloqueaste.'); return; }
    const endedAt = Date.now();
    setSaving(true); setNotice('');
    const { error } = await supabase.from('study_sessions').insert({
      user_id: user.id,
      resource_id: resourceId,
      started_at: new Date(active.startedAt).toISOString(),
      ended_at: new Date(endedAt).toISOString(),
      duration_minutes: completedFocusMinutes(active.startedAt, active.durationMinutes, endedAt),
      outcome: outcome.trim(),
      next_action: nextAction.trim(),
    });
    if (error) { setSaving(false); setNotice('No se pudo guardar la sesión. Tu reflexión permanece en pantalla para volver a intentarlo.'); return; }
    try { localStorage.removeItem(storageKey); } catch { /* The saved cloud session is authoritative. */ }
    setActive(null); setOutcome(''); setSaving(false); setNotice('Sesión guardada en tu historial privado.');
    onSessionSaved();
    await loadSessions();
  };

  return <section className="rounded-card border border-border bg-panel p-5" aria-labelledby="focus-session-title">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-accent-text">Bloque de práctica</p><h3 id="focus-session-title" className="mt-2 font-semibold">Sesión de enfoque</h3></div><Clock3 size={20} className="text-accent-text" /></div>
    {!active ? <><p className="mt-3 text-sm leading-6 text-muted">Elige un bloque, trabaja una sola hipótesis y registra el resultado al terminar.</p><div className="mt-4 grid grid-cols-3 gap-2">{[25, 45, 60].map(value => <button key={value} className={button} aria-pressed={durationMinutes === value} onClick={() => setDurationMinutes(value)}>{value} min</button>)}</div><button className={`${button} sb-primary-button mt-3 w-full`} onClick={start}><Play size={16} /> Iniciar sesión</button></>
      : <><div className="mt-4 text-center"><p className="font-mono text-4xl font-semibold tracking-tight" aria-live="polite">{timerLabel}</p><p className="mt-2 text-xs text-muted">{remaining ? `${elapsed} min transcurridos` : 'Tiempo cumplido. Resume la evidencia antes de cerrar.'}</p></div><label className="mt-5 block text-sm font-semibold">Resultado de la sesión<textarea className={`${input} mt-2 min-h-28`} maxLength={1000} value={outcome} onChange={event => setOutcome(event.target.value)} placeholder="Qué probé, qué observé y qué conclusión puedo sostener" /></label><div className="mt-3 grid gap-2"><button className={`${button} sb-primary-button w-full`} disabled={saving} onClick={finish}><PauseCircle size={16} /> {saving ? 'Guardando…' : 'Finalizar y guardar'}</button><button className={button} disabled={saving} onClick={cancel}>Cancelar sesión</button></div></>}
    {notice && <p role="status" className="mt-3 text-xs leading-5 text-muted">{notice}</p>}
    <div className="mt-5 border-t border-border pt-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><History size={15} /> Historial reciente</p>{historyError ? <p className="mt-3 text-xs text-danger">No se pudo consultar el historial.</p> : sessions.length ? <ul className="mt-3 space-y-3">{sessions.map(session => <li key={session.id} className="text-xs leading-5"><strong>{session.duration_minutes} min</strong> · {new Date(session.created_at).toLocaleDateString()}<p className="mt-1 text-muted">{session.outcome}</p></li>)}</ul> : <p className="mt-3 text-xs text-muted">Todavía no has guardado sesiones para este material.</p>}</div>
  </section>;
}
