import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { StudyProgressSummary, StudyResource } from '@/types/study';

export function useStudyLibrary() {
  const { user } = useAuth();
  const identity = `${user?.id || ''}:${user?.accessStatus || ''}`;
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ identity: string; resources: StudyResource[]; progress: StudyProgressSummary[]; loading: boolean; error: string | null }>({ identity, resources: [], progress: [], loading: true, error: null });
  const refetch = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setState({ identity, resources: [], progress: [], loading: true, error: null });
    if (!user || !['member', 'admin'].includes(user.accessStatus)) {
      setState({ identity, resources: [], progress: [], loading: false, error: null });
      return () => controller.abort();
    }
    void (async () => {
      try {
        if (!isSupabaseConfigured()) throw new Error('Supabase no está configurado.');
        const [resources, progress] = await Promise.all([
          supabase.from('study_resources').select('id,title,category,source,objective,environment,archive_path,archive_parts,archive_bytes,archive_sha256,writeup_path,readiness,import_note,lab_slug,is_published').eq('is_published', true).order('title').limit(500).abortSignal(controller.signal),
          supabase.from('study_progress').select('resource_id,status,next_action,review_on,updated_at').eq('user_id', user.id).limit(500).abortSignal(controller.signal),
        ]);
        if (resources.error || progress.error) throw resources.error || progress.error;
        if (!controller.signal.aborted) setState({ identity, resources: resources.data || [], progress: progress.data || [], loading: false, error: null });
      } catch {
        if (!controller.signal.aborted) setState({ identity, resources: [], progress: [], loading: false, error: 'No se pudo cargar la biblioteca. Comprueba la conexión y que la migración de biblioteca esté aplicada.' });
      }
    })();
    return () => controller.abort();
  }, [identity, revision]);
  return { ...(state.identity === identity ? state : { resources: [], progress: [], loading: true, error: null }), refetch };
}
