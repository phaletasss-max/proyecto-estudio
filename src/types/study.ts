export const STUDY_STATUSES = {
  queued: 'Por empezar', practicing: 'En práctica', documenting: 'Escribir mi writeup', review: 'Para repasar', learned: 'Aprendido',
} as const;
export type StudyStatus = keyof typeof STUDY_STATUSES;
export interface StudyResource {
  id: string; title: string; category: string; source: string; objective: string; environment: string;
  archive_path: string | null; archive_bytes: number; archive_sha256: string;
  archive_parts: { path: string; bytes: number; sha256: string }[];
  writeup_path: string | null; readiness: 'needs_writeup' | 'reference_available' | 'guided';
  import_note: string; lab_slug: string | null; is_published: boolean;
}
export interface StudyProgress {
  resource_id: string; status: StudyStatus; next_action: string; personal_writeup: string; review_on: string | null; updated_at?: string;
}
export type StudyProgressSummary = Omit<StudyProgress, 'personal_writeup'>;
