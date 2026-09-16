import type { StudyProgress, StudyProgressSummary, StudyResource } from '@/types/study';

export const emptyStudyProgress = (id: string): StudyProgress => ({ resource_id: id, status: 'queued', next_action: '', personal_writeup: '', review_on: null });
export function restoreStudyDraft(raw: string | null, saved: StudyProgress): StudyProgress {
  try {
    const value = JSON.parse(raw || 'null');
    if (!value || value.resource_id !== saved.resource_id || !['queued','practicing','documenting','review','learned'].includes(value.status)
      || typeof value.next_action !== 'string' || value.next_action.length > 500
      || typeof value.personal_writeup !== 'string' || value.personal_writeup.length > 30000
      || (value.review_on !== null && (typeof value.review_on !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.review_on)))) return saved;
    return { ...saved, status: value.status, next_action: value.next_action, personal_writeup: value.personal_writeup, review_on: value.review_on };
  } catch { return saved; }
}
export function studyProgressError(value: StudyProgress): string | null {
  if (value.status === 'learned' && value.personal_writeup.trim().length < 80) return 'Antes de marcarlo como aprendido, explica con tus palabras el método y lo que aprendiste (mínimo 80 caracteres).';
  if (value.next_action.length > 500 || value.personal_writeup.length > 30000) return 'El texto supera el límite permitido.';
  return null;
}
export function isReviewDue(progress: StudyProgressSummary | undefined, today: string) {
  return !!progress?.review_on && progress.review_on <= today && progress.status !== 'queued';
}
export function prioritizeStudy(resources: StudyResource[], progress: StudyProgressSummary[], today: string) {
  const byId = new Map(progress.map(item => [item.resource_id, item]));
  const rank = (resource: StudyResource) => {
    const state = byId.get(resource.id);
    if (isReviewDue(state, today)) return 0;
    if (state?.status === 'practicing' || state?.status === 'documenting') return 1;
    if (state?.status === 'review') return 2;
    if (state?.status === 'learned') return 5;
    return resource.readiness === 'guided' ? 3 : 4;
  };
  return [...resources].sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));
}
export function localStudyDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function exportStudyWriteup(title: string, progress: StudyProgress) {
  return `# ${title}\n\nWriteup personal de ShadowBytes. No acredita un solve ni puntos.\n\n${progress.personal_writeup}\n\n## Siguiente acción\n\n${progress.next_action || 'Por definir'}\n\nRepaso: ${progress.review_on || 'Sin fecha'}\n`;
}
