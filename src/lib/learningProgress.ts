import type { LearningModule, LearningPath } from '../types/auth';

export interface LearningProgress {
  activePath: string | null;
  completedLessons: string[];
}

export function parseLearningProgress(raw: string | null): LearningProgress {
  try {
    const value = JSON.parse(raw || '{}');
    return {
      activePath: typeof value?.activePath === 'string' ? value.activePath : null,
      completedLessons: Array.isArray(value?.completedLessons)
        ? [...new Set<string>(value.completedLessons.filter((item: unknown): item is string => typeof item === 'string'))]
        : [],
    };
  } catch { return { activePath: null, completedLessons: [] }; }
}

export const lessonKey = (path: LearningPath, module: LearningModule) => `${path.slug}/${module.id}`;
export const moduleHref = (path: LearningPath, module: LearningModule) =>
  module.status === 'coming_soon' ? null : module.labSlug ? `/lab/${module.labSlug}` : module.guide ? `/learn/${path.slug}/${module.id}` : null;

export function pathProgress(path: LearningPath, completedLessons: string[], solvedSlugs: string[]) {
  const available = path.modules.filter((module) => moduleHref(path, module));
  const isComplete = (module: LearningModule) => module.labSlug
    ? solvedSlugs.includes(module.labSlug)
    : completedLessons.includes(lessonKey(path, module));
  const completed = available.filter(isComplete).length;
  return { available, completed, next: available.find((module) => !isComplete(module)), percent: available.length ? Math.round(completed / available.length * 100) : 0, isComplete };
}

export function recommendModule(path: LearningPath, minutes: number, completedLessons: string[], solvedSlugs: string[]) {
  const progress = pathProgress(path, completedLessons, solvedSlugs);
  const pending = progress.available.filter((module) => !progress.isComplete(module));
  const fits = pending.find((module) => module.durationMinutes <= minutes);
  const module = fits ?? pending[0];
  return {
    ...progress, module,
    reason: !progress.available.length ? 'Esta ruta todavía no tiene módulos disponibles.'
      : !module ? 'Completaste todos los módulos disponibles de esta ruta.'
      : fits ? `Pendiente en tu ruta y compatible con una sesión de ${minutes} minutos.`
      : `El siguiente módulo requiere unos ${module.durationMinutes} minutos. Reserva una sesión más larga.`,
  };
}

export interface SearchEntry { title: string; detail: string; href: string; kind: string }
const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function searchContent(entries: SearchEntry[], query: string) {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  return entries.filter((entry) => terms.every((term) => normalizeSearch(`${entry.title} ${entry.detail} ${entry.kind}`).includes(term))).slice(0, 12);
}
