import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CTFLab } from '@/types/ctf';
import { REAL_LABS } from '@/data/mockLabs';

export function useLabDetail(slug: string) {
  const [lab, setLab] = useState<CTFLab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLab = async () => {
      setLoading(true);
      setError(null);

      const localMatch = REAL_LABS.find((l) => l.slug === slug);

      if (!isSupabaseConfigured()) {
        if (localMatch) {
          setLab(localMatch);
        } else {
          setError('Lab no encontrado');
        }
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('labs')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (fetchError) throw fetchError;
        setLab(data as CTFLab);
      } catch (err) {
        if (localMatch) {
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
