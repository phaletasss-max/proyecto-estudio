export type RankTier = 'Script Kiddie' | 'Byte Hunter' | 'Cyber Specialist' | 'Root Operator' | 'Shadow Master';
export type AccessStatus = 'applicant' | 'member' | 'admin' | 'suspended';

export interface RankInfo {
  tier: RankTier;
  minPoints: number;
  maxPoints: number;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  icon: string;
}

export const RANKS: Record<RankTier, RankInfo> = {
  'Script Kiddie': {
    tier: 'Script Kiddie',
    minPoints: 0,
    maxPoints: 499,
    badgeColor: 'text-slate-400',
    badgeBg: 'bg-slate-500/10',
    badgeBorder: 'border-slate-500/30',
    icon: '🌱',
  },
  'Byte Hunter': {
    tier: 'Byte Hunter',
    minPoints: 500,
    maxPoints: 1499,
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    icon: '⚡',
  },
  'Cyber Specialist': {
    tier: 'Cyber Specialist',
    minPoints: 1500,
    maxPoints: 2999,
    badgeColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    icon: '🛡️',
  },
  'Root Operator': {
    tier: 'Root Operator',
    minPoints: 3000,
    maxPoints: 4999,
    badgeColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    icon: '💎',
  },
  'Shadow Master': {
    tier: 'Shadow Master',
    minPoints: 5000,
    maxPoints: Infinity,
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    icon: '👑',
  },
};

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  pointsBonus: number;
  category: 'Milestone' | 'Specialty' | 'Community' | 'Mastery';
}

export interface UserSolve {
  labId: string;
  labSlug: string;
  labTitle: string;
  category: string;
  difficulty: string;
  pointsEarned: number;
  solvedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  specialty: string;
  points: number;
  rank: RankTier;
  accessStatus: AccessStatus;
  githubUrl?: string;
  discordTag?: string;
  linkedinUrl?: string;
  solvedLabs: UserSolve[];
  unlockedBadges: string[]; // array of badge codes
  createdAt: string;
}

export interface LeaderboardEntry {
  rankPosition: number;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  points: number;
  rank: RankTier;
  specialty: string;
  solvedCount: number;
  badgesCount: number;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  labSlug?: string;
  type: 'theory' | 'lab' | 'challenge';
  durationMinutes: number;
  points: number;
  status?: 'available' | 'coming_soon';
  guide?: {
    objective: string;
    keyIdeas: string[];
    steps: string[];
    practice: string;
  };
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  level: 'Fundamental' | 'Intermedio' | 'Avanzado';
  estimatedHours: number;
  tags: string[];
  modules: LearningModule[];
}
