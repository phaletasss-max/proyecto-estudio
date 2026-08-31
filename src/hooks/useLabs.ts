import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CTFLab, Difficulty, CTFCategory } from '@/types/ctf';
import { REAL_LABS } from '@/data/mockLabs';

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

    if (!isSupabaseConfigured()) {
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

    try {
      let query = supabase
        .from('labs')
        .select('*')
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

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLabs((data as CTFLab[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los labs');
      setLabs(REAL_LABS);
    } finally {
      setLoading(false);
    }
  }, [options.difficulty, options.category, options.framework, options.search, options.admissionOnly]);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  return { labs, loading, error, refetch: fetchLabs };
}
