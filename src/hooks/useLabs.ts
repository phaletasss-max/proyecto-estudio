import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  page?: number;
  pageSize?: number;
}

// Only text can enter PostgREST's raw OR expression: punctuation cannot add
// operators, filters or wildcard-only searches. Keep Unicode names searchable.
export const normalizeLabSearch = (value = '') => value.normalize('NFKC')
  .replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);

export function useLabs(options: UseLabsOptions = {}) {
  const { user } = useAuth();
  const [labs, setLabs] = useState<CTFLab[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refetch = useCallback(() => setRevision((current) => current + 1), []);
  const search = normalizeLabSearch(options.search);
  const framework = normalizeLabSearch(options.framework ?? '');
  const page = Number.isFinite(options.page) ? Math.max(1, Math.floor(options.page!)) : 1;
  const pageSize = Number.isFinite(options.pageSize) ? Math.min(48, Math.max(1, Math.floor(options.pageSize!))) : 24;
  const { difficulty, category, admissionOnly } = options;

  useEffect(() => {
    const controller = new AbortController();
    const from = (page - 1) * pageSize;
    setLoading(true);
    setError(null);
    setLabs([]);
    setTotal(0);

    const fetchLabs = async () => {
      if (!isSupabaseConfigured()) {
        if (isDemoModeEnabled()) {
          const filtered = REAL_LABS.filter((lab) =>
            (!difficulty || lab.difficulty === difficulty)
            && (!category || lab.category === category)
            && (!framework || lab.framework?.toLowerCase().includes(framework.toLowerCase()))
            && (!admissionOnly || lab.is_admission_challenge)
            && (!search || `${lab.title} ${lab.description}`.toLowerCase().includes(search.toLowerCase()))
          ).sort((a, b) => b.created_at.localeCompare(a.created_at) || a.id.localeCompare(b.id));
          setTotal(filtered.length);
          setLabs(filtered.slice(from, from + pageSize));
        } else {
          setError('El catálogo no está disponible en este momento. Inténtalo de nuevo más tarde.');
        }
        setLoading(false);
        return;
      }

      try {
        const buildQuery = (legacy = false) => {
          let query = supabase.from('labs')
            .select(legacy ? LEGACY_PUBLIC_LAB_COLUMNS : PUBLIC_LAB_COLUMNS, { count: 'exact' })
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .order('id', { ascending: true })
            .range(from, from + pageSize - 1)
            .abortSignal(controller.signal);
          if (difficulty) query = query.eq('difficulty', difficulty);
          if (category) query = query.eq('category', category);
          if (admissionOnly) query = query.eq('is_admission_challenge', true);
          if (framework) query = query.ilike('framework', `%${framework}%`);
          if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
          return query;
        };

        let result = await buildQuery();
        if (!controller.signal.aborted && result.error && !admissionOnly && !framework
          && ['42703', 'PGRST204'].includes(result.error.code || '')) {
          // Preserve the same filters, ordering and page in older schemas.
          result = await buildQuery(true);
        }
        if (controller.signal.aborted) return;
        if (result.error) throw result.error;
        setLabs(((result.data as unknown as PublicLabRow[]) || []).map((row) => mapPublicLab(row)));
        setTotal(result.count ?? 0);
      } catch {
        if (!controller.signal.aborted) setError('No pudimos cargar los laboratorios. Revisa tu conexión y vuelve a intentarlo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchLabs();
    return () => controller.abort();
  }, [difficulty, category, framework, search, admissionOnly, page, pageSize, revision, user?.id, user?.accessStatus]);

  return { labs, total, page, pageSize, loading, error, refetch };
}
