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
        let { data, error: fetchError } = await supabase
          .from('labs')
          .select(PUBLIC_LAB_COLUMNS)
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (fetchError && ['42703', 'PGRST204'].includes(fetchError.code || '')) {
          const fallback = await supabase
            .from('labs')
            .select(LEGACY_PUBLIC_LAB_COLUMNS)
            .eq('slug', slug)
            .eq('is_published', true)
            .single();
          data = fallback.data;
          fetchError = fallback.error;
        }

        if (fetchError || !data) throw fetchError || new Error('Lab no encontrado');

        const { data: stepData, error: stepsError } = await supabase
          .from('lab_steps')
          .select('id, step_number, title, description, question, answer_format, points, hint_count')
          .eq('lab_id', (data as unknown as PublicLabRow).id)
          .order('step_number', { ascending: true });

        if (stepsError && stepsError.code !== '42P01') throw stepsError;
        const tasks = mapLabSteps((stepData as unknown as LabStepRow[]) || []);
        setLab(mapPublicLab(data as unknown as PublicLabRow, tasks));
      } catch (err) {
        if (localMatch && isDemoModeEnabled()) {
          setLab(localMatch);
        } else {
          setError(err instanceof Error ? err.message : 'Error al cargar el lab');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
  }, [slug]);

  return { lab, loading, error };
}
