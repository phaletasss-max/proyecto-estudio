import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, isDemoModeEnabled } from '@/lib/supabase';
import type { CTFLab, Difficulty, CTFCategory } from '@/types/ctf';
import { REAL_LABS } from '@/data/mockLabs';
import { LEGACY_PUBLIC_LAB_COLUMNS, mapPublicLab, PUBLIC_LAB_COLUMNS, type PublicLabRow } from '@/lib/labs';

interface UseLabsOptions {
  difficulty?: Difficulty | null;
  category?: CTFCategory | null;
  framework?: string | null;
  search?: string;
  admissionOnly?: boolean;
}

export function useLabs(options: UseLabsOptions = {}) {
  const [labs, setLabs] = useState<CTFLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLabs = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured() && isDemoModeEnabled()) {
      let filtered = [...REAL_LABS];
      if (options.difficulty) {
        filtered = filtered.filter((l) => l.difficulty === options.difficulty);
      }
      if (options.category) {
        filtered = filtered.filter((l) => l.category === options.category);
      }
      if (options.framework) {
        filtered = filtered.filter((l) => l.framework?.toLowerCase().includes(options.framework!.toLowerCase()));
      }
      if (options.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q) ||
            l.tags?.some((t) => t.toLowerCase().includes(q)) ||
            l.framework?.toLowerCase().includes(q)
        );
      }
      if (options.admissionOnly) {
        filtered = filtered.filter((l) => l.is_admission_challenge);
      }
      setLabs(filtered);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setLabs([]);
      setError('Supabase no está configurado. Añade las variables públicas o activa el modo demo solo en desarrollo.');
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('labs')
        .select(PUBLIC_LAB_COLUMNS)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty);
      }
      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.admissionOnly) {
        query = query.eq('is_admission_challenge', true);
      }
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      let { data, error: fetchError } = await query;

      if (fetchError && !options.admissionOnly && ['42703', 'PGRST204'].includes(fetchError.code || '')) {
        const fallback = await supabase
          .from('labs')
          .select(LEGACY_PUBLIC_LAB_COLUMNS)
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        data = fallback.data;
        fetchError = fallback.error;
      }

      if (fetchError) throw fetchError;
      setLabs(((data as unknown as PublicLabRow[]) || []).map((row) => mapPublicLab(row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los labs');
      setLabs([]);
    } finally {
      setLoading(false);
    }
  }, [options.difficulty, options.category, options.framework, options.search, options.admissionOnly]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  return { labs, loading, error, refetch: fetchLabs };
}
