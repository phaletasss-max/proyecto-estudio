import type { CTFLab, Difficulty, CTFCategory, LabTask } from '@/types/ctf';

export const PUBLIC_LAB_COLUMNS = [
  'id', 'title', 'slug', 'difficulty', 'category', 'description', 'zip_url',
  'author', 'created_at', 'is_published', 'points', 'is_admission_challenge',
  'is_members_only', 'framework', 'tags', 'target_ip', 'estimated_minutes',
].join(',');

export interface PublicLabRow {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: CTFCategory;
  description: string;
  zip_url: string | null;
  author: string;
  created_at: string;
  is_published: boolean;
  points?: number | null;
  is_admission_challenge?: boolean | null;
  is_members_only?: boolean | null;
  framework?: string | null;
  tags?: string[] | null;
  target_ip?: string | null;
  estimated_minutes?: number | null;
}

export interface LabStepRow {
  id: string;
  step_number: number;
  title: string;
  description: string;
  question: string | null;
  answer_format: string | null;
  points: number;
  hint_count: number;
}

export const mapPublicLab = (row: PublicLabRow, tasks?: LabTask[]): CTFLab => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  difficulty: row.difficulty,
  category: row.category,
  description: row.description,
  zip_url: row.zip_url,
  author: row.author,
  created_at: row.created_at,
  is_published: row.is_published,
  points: row.points ?? undefined,
  is_admission_challenge: row.is_admission_challenge ?? false,
  is_members_only: row.is_members_only ?? false,
  framework: row.framework ?? undefined,
  tags: row.tags ?? [],
  targetIp: row.target_ip ?? undefined,
  estimatedMinutes: row.estimated_minutes ?? undefined,
  tasks,
});

export const mapLabSteps = (steps: LabStepRow[]): LabTask[] => steps.map((step) => ({
  id: step.id,
  taskNumber: step.step_number,
  title: step.title,
  description: step.description,
  questions: step.question ? [{
    id: step.id,
    question: step.question,
    points: step.points,
    answerFormat: step.answer_format ?? undefined,
    hintCount: step.hint_count,
  }] : [],
}));
