import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, isDemoModeEnabled } from '@/lib/supabase';
import type { CTFLab } from '@/types/ctf';
import { REAL_LABS } from '@/data/mockLabs';
import { LEGACY_PUBLIC_LAB_COLUMNS, mapLabSteps, mapPublicLab, PUBLIC_LAB_COLUMNS, type LabStepRow, type PublicLabRow } from '@/lib/labs';

export function useLabDetail(slug: string) {
  const [lab, setLab] = useState<CTFLab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const fetchLab = async () => {
      setLoading(true);
      setError(null);

      const localMatch = isDemoModeEnabled() ? REAL_LABS.find((l) => l.slug === slug) : undefined;

      if (!isSupabaseConfigured() && isDemoModeEnabled()) {
        if (localMatch) {
          setLab(localMatch);
        } else {
          setError('Lab no encontrado');
        }
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        setError('Supabase no está configurado.');
        setLoading(false);
        return;
      }

      try {
        const result = await supabase
          .from('labs')
          .select(`${PUBLIC_LAB_COLUMNS},lab_steps(id,step_number,title,description,question,answer_format,points,hint_count)`)
          .eq('slug', slug)
          .eq('is_published', true)
          .abortSignal(controller.signal)
          .single();
        let data: unknown = result.data;
        let fetchError = result.error;

        if (fetchError && ['42703', '42P01', 'PGRST200', 'PGRST204', 'PGRST205'].includes(fetchError.code || '')) {
          const fallback = await supabase
            .from('labs')
            .select(LEGACY_PUBLIC_LAB_COLUMNS)
            .eq('slug', slug)
            .eq('is_published', true)
            .abortSignal(controller.signal)
            .single();
          data = fallback.data;
          fetchError = fallback.error;
        }

        if (fetchError || !data) throw fetchError || new Error('Lab no encontrado');

        // Modern schemas return the briefing and steps in one round trip.
        // Keep the separate request only for older schemas without the relation.
        const embedded = (data as unknown as PublicLabRow & { lab_steps?: LabStepRow[] }).lab_steps;
        const { data: stepData, error: stepsError } = Array.isArray(embedded)
          ? { data: [...embedded].sort((a, b) => a.step_number - b.step_number), error: null }
          : await supabase.from('lab_steps')
            .select('id, step_number, title, description, question, answer_format, points, hint_count')
            .eq('lab_id', (data as unknown as PublicLabRow).id)
            .order('step_number', { ascending: true })
            .abortSignal(controller.signal);

        const missingStepsTable = stepsError && ['42P01', 'PGRST204', 'PGRST205'].includes(stepsError.code || '');
        if (stepsError && !missingStepsTable) throw stepsError;
        const tasks = mapLabSteps((stepData as unknown as LabStepRow[]) || []);
        if (!active) return;
        setLab(mapPublicLab(data as unknown as PublicLabRow, tasks));
      } catch (err) {
        if (!active) return;
        if (localMatch && isDemoModeEnabled()) {
          setLab(localMatch);
        } else {
          setError(err instanceof Error ? err.message : 'Error al cargar el lab');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchLab();
    return () => { active = false; controller.abort(); };
  }, [slug]);

  return { lab, loading, error };
}
