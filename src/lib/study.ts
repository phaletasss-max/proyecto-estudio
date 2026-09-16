import type { StudyActivitySummary, StudyProgress, StudyProgressSummary, StudyResource, StudySession } from '@/types/study';

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
export function studyPlanReason(resource: Pick<StudyResource, 'readiness' | 'writeup_path'>, progress: StudyProgressSummary | undefined, today: string) {
  if (isReviewDue(progress, today)) return 'Repaso vencido';
  if (progress?.status === 'practicing') return 'Práctica en curso';
  if (progress?.status === 'documenting') return 'Writeup por terminar';
  if (progress?.status === 'review') return 'Listo para repasar';
  if (resource.readiness === 'guided') return 'Laboratorio guiado';
  if (resource.writeup_path) return 'Referencia disponible';
  return 'Material por explorar';
}
export function suggestedSessionMinutes(progress: StudyProgressSummary | undefined) {
  return progress?.status === 'practicing' || progress?.status === 'documenting' ? 45 : 25;
}
export function localStudyDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addStudyDays(day: string, amount: number) {
  const [year, month, date] = day.split('-').map(Number);
  if (!year || !month || !date || !Number.isInteger(amount)) return day;
  return localStudyDate(new Date(year, month - 1, date + amount));
}
export function suggestedStudyAction(resource: Pick<StudyResource, 'category' | 'lab_slug' | 'archive_path' | 'archive_parts'>, progress: Pick<StudyProgress, 'status'>) {
  if (progress.status === 'documenting') return 'Convertir las notas en un procedimiento reproducible y justificar cada conclusión con una evidencia.';
  if (progress.status === 'review') return 'Repetir el procedimiento sin consultar la referencia y anotar el primer paso que no puedas explicar.';
  if (progress.status === 'learned') return 'Explicar el método de memoria y comprobar una conclusión clave en un entorno autorizado.';
  if (progress.status === 'practicing') return 'Probar una hipótesis concreta, guardar el resultado y decidir el siguiente experimento.';
  if (resource.lab_slug) return 'Abrir el laboratorio guiado, completar el primer paso y registrar la evidencia obtenida.';
  const categoryActions: Record<string, string> = {
    Blockchain: 'Identificar el contrato, sus entradas y la condición que protege el objetivo antes de probar una transacción.',
    Crypto: 'Identificar el formato, la transformación y una muestra conocida antes de escribir un script de prueba.',
    Forensics: 'Inventariar los archivos, registrar sus hashes y construir una primera línea de tiempo de evidencias.',
    Hardware: 'Identificar el formato de las señales o del firmware y documentar una observación verificable.',
    ICS: 'Identificar el protocolo y los campos relevantes antes de formular una hipótesis sobre el tráfico.',
    Pwn: 'Inspeccionar las protecciones del binario y localizar una entrada controlable antes de intentar explotarlo.',
    Reversing: 'Identificar el punto de entrada y seguir una ruta de ejecución hasta una comparación relevante.',
    Web: 'Enumerar las rutas y parámetros visibles, elegir un punto de entrada y registrar su respuesta base.',
  };
  if (categoryActions[resource.category]) return categoryActions[resource.category];
  if (resource.archive_path || resource.archive_parts.length) return 'Descargar el material, verificar su SHA-256 e inventariar los archivos sin ejecutarlos.';
  return 'Definir una pregunta concreta, reunir una evidencia y registrar qué resultado confirmaría la hipótesis.';
}
export function studyMilestones(progress: Pick<StudyProgress, 'status' | 'next_action' | 'personal_writeup' | 'review_on'>) {
  return [
    { label: 'Próximo paso definido', complete: progress.next_action.trim().length >= 12 },
    { label: 'Práctica iniciada', complete: progress.status !== 'queued' },
    { label: 'Método explicado', complete: ['review', 'learned'].includes(progress.status) && progress.personal_writeup.trim().length >= 80 },
    { label: 'Repaso programado', complete: !!progress.review_on },
  ];
}
export function studyCompletion(progress: Pick<StudyProgress, 'status' | 'next_action' | 'personal_writeup' | 'review_on'>) {
  return studyMilestones(progress).filter(item => item.complete).length * 25;
}
export function studyWriteupTemplate(title: string) {
  return `## Objetivo\n\n¿Qué quiero entender de ${title}?\n\n## Hipótesis\n\n¿Qué creo que ocurre y cómo puedo comprobarlo?\n\n## Intentos y evidencias\n\n- Comando o acción:\n- Resultado observado:\n- Interpretación:\n\n## Método reproducible\n\n1. \n2. \n3. \n\n## Lo que aprendí\n\n¿Qué podría explicar ahora sin consultar una guía?`;
}
export function focusRemainingSeconds(startedAt: number, durationMinutes: number, now = Date.now()) {
  return Math.max(0, durationMinutes * 60 - Math.floor((now - startedAt) / 1000));
}
export function completedFocusMinutes(startedAt: number, durationMinutes: number, endedAt = Date.now()) {
  const elapsed = Math.ceil((endedAt - startedAt) / 60000);
  return Math.max(1, Math.min(240, durationMinutes, elapsed));
}
export function formatFocusTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}
function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
export function studyWeekStart(date = new Date()) {
  const start = startOfLocalDay(date);
  const offset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - offset);
  return start;
}
export function summarizeStudyActivity(sessions: StudySession[], now = new Date(), weeklyGoalMinutes = 150): StudyActivitySummary {
  const today = startOfLocalDay(now);
  const weekStart = studyWeekStart(now);
  const validSessions = sessions
    .filter(session => {
      const startedAt = new Date(session.started_at).getTime();
      return Number.isFinite(session.duration_minutes) && session.duration_minutes > 0 && !Number.isNaN(startedAt) && startedAt <= now.getTime();
    })
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
  const thisWeek = validSessions.filter(session => {
    const started = new Date(session.started_at);
    return started >= weekStart && started <= now;
  });
  const activeDays = new Set(validSessions.map(session => localStudyDate(new Date(session.started_at))));
  let cursor = new Date(today);
  if (!activeDays.has(localStudyDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let currentStreak = 0;
  while (activeDays.has(localStudyDate(cursor))) {
    currentStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  const minutesThisWeek = thisWeek.reduce((total, session) => total + session.duration_minutes, 0);
  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - index));
    const day = localStudyDate(date);
    return {
      day,
      label: new Intl.DateTimeFormat('es', { weekday: 'short' }).format(date).replace('.', ''),
      minutes: validSessions
        .filter(session => localStudyDate(new Date(session.started_at)) === day)
        .reduce((total, session) => total + session.duration_minutes, 0),
    };
  });
  return {
    minutesThisWeek,
    sessionsThisWeek: thisWeek.length,
    activeDaysThisWeek: new Set(thisWeek.map(session => localStudyDate(new Date(session.started_at)))).size,
    currentStreak,
    weeklyGoalPercent: Math.min(100, Math.round((minutesThisWeek / Math.max(1, weeklyGoalMinutes)) * 100)),
    recentSession: validSessions[0] ?? null,
    lastSevenDays,
  };
}
export function exportStudyWriteup(title: string, progress: StudyProgress) {
  return `# ${title}\n\nWriteup personal de ShadowBytes. No acredita un solve ni puntos.\n\n${progress.personal_writeup}\n\n## Siguiente acción\n\n${progress.next_action || 'Por definir'}\n\nRepaso: ${progress.review_on || 'Sin fecha'}\n`;
}
