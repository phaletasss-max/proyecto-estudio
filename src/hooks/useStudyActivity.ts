import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { summarizeStudyActivity } from '@/lib/study';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { StudySession } from '@/types/study';

export function useStudyActivity() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAccess = !!user && ['member', 'admin'].includes(user.accessStatus);

  useEffect(() => {
    const controller = new AbortController();
    setSessions([]);
    setError(null);
    if (!hasAccess || !user || !isSupabaseConfigured()) {
      setLoading(false);
      return () => controller.abort();
    }
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - 90);
    void supabase.from('study_sessions')
      .select('id,resource_id,started_at,ended_at,duration_minutes,outcome,next_action,created_at')
      .eq('user_id', user.id)
      .gte('started_at', since.toISOString())
      .order('started_at', { ascending: false })
      .limit(200)
      .abortSignal(controller.signal)
      .then(({ data, error: queryError }) => {
        if (controller.signal.aborted) return;
        if (queryError) {
          setError('No se pudo cargar tu actividad de estudio.');
          setSessions([]);
        } else {
          setSessions(data || []);
        }
        setLoading(false);
      });
    return () => controller.abort();
  }, [hasAccess, user?.id]);

  const summary = useMemo(() => summarizeStudyActivity(sessions), [sessions]);
  return { hasAccess, loading, error, sessions, summary };
}
