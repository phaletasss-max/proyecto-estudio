import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { lessonKey, parseLearningProgress, type LearningProgress } from '@/lib/learningProgress';
import type { LearningModule, LearningPath } from '@/types/auth';

const EVENT = 'shadowbytes-learning-progress';

export function useLearningProgress() {
  const { user } = useAuth();
  const key = `shadowbytes_learning_v1:${user?.id ?? 'guest'}`;
  const read = useCallback(() => {
    try { return parseLearningProgress(localStorage.getItem(key)); }
    catch { return parseLearningProgress(null); }
  }, [key]);
  const [snapshot, setSnapshot] = useState(() => ({ key, value: read() }));
  const [error, setError] = useState('');
  const progress = snapshot.key === key ? snapshot.value : read();

  useEffect(() => {
    const sync = () => setSnapshot({ key, value: read() });
    sync();
    setError('');
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key, read]);

  const save = (update: (current: LearningProgress) => LearningProgress) => {
    try {
      const next = update(read());
      localStorage.setItem(key, JSON.stringify(next));
      setSnapshot({ key, value: next });
      setError('');
      window.dispatchEvent(new Event(EVENT));
    } catch { setError('No se pudo guardar el avance. Habilita el almacenamiento del navegador e inténtalo de nuevo.'); }
  };

  return {
    ...progress, error,
    selectPath: (path: LearningPath) => save((current) => ({ ...current, activePath: path.slug })),
    completeLesson: (path: LearningPath, module: LearningModule) => {
      if (!module.guide || module.labSlug || module.status === 'coming_soon') return;
      save((current) => ({ activePath: path.slug, completedLessons: [...new Set([...current.completedLessons, lessonKey(path, module)])] }));
    },
  };
}
