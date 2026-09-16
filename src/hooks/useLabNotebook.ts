import { useEffect, useState, type SetStateAction } from 'react';
import { notebookStorageKey, parseNotebook } from '@/lib/labNotebook';
import type { LabNotebook } from '@/types/labWorkspace';

function readNotebook(key: string) {
  try { return { key, notebook: parseNotebook(localStorage.getItem(key)), unavailable: false }; }
  catch { return { key, notebook: parseNotebook(null), unavailable: true }; }
}

export function useLabNotebook(labId: string, userId?: string) {
  const key = notebookStorageKey(labId, userId);
  const [saved, setSaved] = useState(() => readNotebook(key));
  const [storageError, setStorageError] = useState(saved.unavailable);
  // Reset before commit so one account's notes are never persisted under another key.
  if (saved.key !== key) setSaved(readNotebook(key));
  useEffect(() => {
    if (saved.key !== key) return;
    try { localStorage.setItem(key, JSON.stringify(saved.notebook)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [key, saved]);
  const setNotebook = (update: SetStateAction<LabNotebook>) => setSaved(current => {
    const previous = current.key === key ? current : readNotebook(key);
    return { ...previous, notebook: typeof update === 'function' ? update(previous.notebook) : update };
  });
  return { notebook: saved.key === key ? saved.notebook : readNotebook(key).notebook, setNotebook, storageError };
}
