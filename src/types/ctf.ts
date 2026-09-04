export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';

export type CTFCategory = 'Web' | 'Forensics' | 'Pwn' | 'Crypto' | 'Reversing' | 'Network' | 'Misc';

export interface TaskQuestion {
  id: string;
  question: string;
  points: number;
  answerFormat?: string; // e.g. "HTB{...}" or "***.***.***.***"
  hintCount?: number;
  isCompleted?: boolean;
}

export interface LabTask {
  id: string;
  taskNumber: number;
  title: string;
  description: string;
  questions: TaskQuestion[];
}

export interface LabComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userRank: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface CTFLab {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: CTFCategory;
  framework?: string; // e.g. 'Laravel', 'Django', 'Spring Boot', 'Express', 'Windows Server'
  tags: string[];
  description: string;
  targetIp?: string; // Simulated IP for AttackBox
  zip_url: string | null;
  tasks?: LabTask[];
  comments?: LabComment[];
  author: string;
  created_at: string;
  is_published: boolean;
  points?: number;
  is_admission_challenge?: boolean;
  is_members_only?: boolean;
  estimatedMinutes?: number;
}

export interface LabFormData {
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: CTFCategory;
  framework?: string;
  tags?: string[];
  description: string;
  writeup_markdown: string;
  flag: string;
  zipFile: File | null;
  isAdmissionChallenge?: boolean;
  isMembersOnly?: boolean;
}

export const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Medium: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  Hard: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  Insane: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
};

export const CATEGORY_ICONS: Record<CTFCategory, string> = {
  Web: '🌐',
  Forensics: '🔍',
  Pwn: '💥',
  Crypto: '🔐',
  Reversing: '⚙️',
  Network: '🖧',
  Misc: '🧩',
};
