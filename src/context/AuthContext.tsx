import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isDemoModeEnabled, isSupabaseConfigured } from '@/lib/supabase';
import type { AccessStatus, UserProfile, UserSolve, RankTier, Badge } from '@/types/auth';
import { BADGES_CATALOG } from '@/data/badges';

const calculateRank = (points: number): RankTier => {
  if (points >= 5000) return 'Shadow Master';
  if (points >= 3000) return 'Root Operator';
  if (points >= 1500) return 'Cyber Specialist';
  if (points >= 500) return 'Byte Hunter';
  return 'Script Kiddie';
};

interface StoredSolve {
  lab_id: string;
  points_earned: number;
  solved_at: string;
  labs?: {
    slug?: string | null;
    title?: string | null;
    category?: string | null;
    difficulty?: string | null;
  } | Array<{
    slug?: string | null;
    title?: string | null;
    category?: string | null;
    difficulty?: string | null;
  }> | null;
}

const toUserSolves = (solves: StoredSolve[] | null): UserSolve[] =>
  (solves || []).map((solve) => {
    const lab = Array.isArray(solve.labs) ? solve.labs[0] : solve.labs;
    return {
      labId: solve.lab_id,
      labSlug: lab?.slug || '',
      labTitle: lab?.title || 'Reto resuelto',
      category: lab?.category || 'Misc',
      difficulty: lab?.difficulty || 'Easy',
      pointsEarned: solve.points_earned,
      solvedAt: solve.solved_at,
    };
  });

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'demo-user',
  username: 'estudiante_demo',
  fullName: 'Estudiante Demo',
  email: 'demo@example.invalid',
  avatarUrl: '/logo-shadowbytes.webp',
  bio: 'Perfil local habilitado únicamente para desarrollo.',
  specialty: 'Fundamentos de ciberseguridad',
  points: 0,
  rank: 'Script Kiddie',
  accessStatus: 'applicant',
  githubUrl: '',
  discordTag: '',
  linkedinUrl: '',
  solvedLabs: [],
  unlockedBadges: [],
  createdAt: new Date().toISOString(),
};

interface SolveResult {
  alreadySolved: boolean;
  pointsEarned: number;
  newBadges: Badge[];
}

interface FlagSubmission {
  accepted: boolean;
  alreadySolved: boolean;
  pointsEarned: number;
  newBadges: Badge[];
  message?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ error?: string }>;
  recordSolve: (lab: { id: string; slug: string; title: string; category: string; difficulty: string }) => Promise<SolveResult>;
  submitFlag: (lab: { id: string; slug: string; title: string; category: string; difficulty: string }, flag: string) => Promise<FlagSubmission>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'shadowbytes_user_profile_v2';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (isSupabaseConfigured()) return null;
    if (!isDemoModeEnabled()) return null;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_GUEST_USER;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    if (isSupabaseConfigured()) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return;
    }
    if (isDemoModeEnabled() && user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  // Check Supabase session if configured
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio, specialty, points, rank, access_status, github_url, discord_tag, linkedin_url, created_at')
            .eq('id', session.user.id)
            .single();

          const { data: solves } = await supabase
            .from('user_solves')
            .select('lab_id, points_earned, solved_at, labs(slug, title, category, difficulty)')
            .eq('user_id', session.user.id);

          const { data: badges } = await supabase
            .from('user_badges')
            .select('badge_code')
            .eq('user_id', session.user.id);

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              fullName: profile.full_name,
              avatarUrl: profile.avatar_url,
              bio: profile.bio || '',
              specialty: profile.specialty || '',
              points: profile.points || 0,
              rank: profile.rank || calculateRank(profile.points || 0),
              accessStatus: (profile.access_status as AccessStatus) || 'applicant',
              githubUrl: profile.github_url || '',
              discordTag: profile.discord_tag || '',
              linkedinUrl: profile.linkedin_url || '',
              solvedLabs: toUserSolves(solves),
              unlockedBadges: (badges || []).map((badge) => badge.badge_code),
              createdAt: profile.created_at,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching Supabase auth session:', err);
      }
    };

    checkSession();
  }, []);

  const login = async (usernameOrEmail: string, password?: string) => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      if (!isDemoModeEnabled()) {
        setLoading(false);
        return { error: 'Supabase no está configurado. El acceso local requiere VITE_ENABLE_DEMO_DATA=true en desarrollo.' };
      }
      // Offline / Demo Login
      const cleanUsername = usernameOrEmail.split('@')[0].trim().toLowerCase();
      const demoUser: UserProfile = {
        ...DEFAULT_GUEST_USER,
        id: `user_${Date.now()}`,
        username: cleanUsername || 'shadow_operative',
        fullName: cleanUsername.toUpperCase(),
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${cleanUsername}@senati.pe`,
      };
      setUser(demoUser);
      setLoading(false);
      return {};
    }

    if (!password) {
      setLoading(false);
      return { error: 'Ingresa tu contraseña para iniciar sesión.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, specialty, points, rank, access_status, github_url, discord_tag, linkedin_url, created_at')
          .eq('id', data.user.id)
          .single();

        const { data: solves } = await supabase
          .from('user_solves')
          .select('lab_id, points_earned, solved_at, labs(slug, title, category, difficulty)')
          .eq('user_id', data.user.id);

        const { data: badges } = await supabase
          .from('user_badges')
          .select('badge_code')
          .eq('user_id', data.user.id);

        if (profile) {
          setUser({
            id: profile.id,
            username: profile.username,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio || '',
            specialty: profile.specialty || '',
            points: profile.points || 0,
            rank: profile.rank || calculateRank(profile.points || 0),
            accessStatus: (profile.access_status as AccessStatus) || 'applicant',
            githubUrl: profile.github_url || '',
            discordTag: profile.discord_tag || '',
            linkedinUrl: profile.linkedin_url || '',
            solvedLabs: toUserSolves(solves),
            unlockedBadges: (badges || []).map((badge) => badge.badge_code),
            createdAt: profile.created_at,
          });
        }
      }
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password?: string, fullName?: string) => {
    setLoading(true);
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    if (!isSupabaseConfigured()) {
      if (!isDemoModeEnabled()) {
        setLoading(false);
        return { error: 'Supabase no está configurado. El registro local está deshabilitado.' };
      }
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        username: cleanUsername,
        fullName: fullName || cleanUsername,
        email,
        avatarUrl: '/logo-shadowbytes.webp',
        bio: 'Nuevo recluta de ShadowBytes SENATI.',
        specialty: 'Ciberseguridad',
        points: 100,
        rank: 'Script Kiddie',
        accessStatus: 'member',
        solvedLabs: [],
        unlockedBadges: ['SENATI_VETERAN'],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      setLoading(false);
      return {};
    }

    if (!password) {
      setLoading(false);
      return { error: 'Ingresa una contraseña para crear tu cuenta.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: cleanUsername,
            full_name: fullName || cleanUsername,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          username: cleanUsername,
          fullName: fullName || cleanUsername,
          email,
          avatarUrl: '/logo-shadowbytes.webp',
          bio: 'Nuevo recluta de ShadowBytes SENATI.',
          specialty: 'Ciberseguridad',
          points: 0,
          rank: 'Script Kiddie',
          accessStatus: 'applicant',
          solvedLabs: [],
          unlockedBadges: [],
          createdAt: new Date().toISOString(),
        });
      }
      return {};
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Error al registrar usuario' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error logging out from Supabase:', err);
      }
    }
    setUser(null);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return { error: 'No hay usuario autenticado' };

    const newProfile: UserProfile = {
      ...user,
      ...updatedData,
    };

    setUser(newProfile);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: newProfile.fullName,
            avatar_url: newProfile.avatarUrl,
            bio: newProfile.bio,
            specialty: newProfile.specialty,
            github_url: newProfile.githubUrl,
            discord_tag: newProfile.discordTag,
            linkedin_url: newProfile.linkedinUrl,
          })
          .eq('id', user.id);
      } catch (err) {
        console.error('Error updating profile in Supabase:', err);
      }
    }

    return {};
  };

  const recordSolve = async (lab: { id: string; slug: string; title: string; category: string; difficulty: string }): Promise<SolveResult> => {
    if (!user) {
      return { alreadySolved: false, pointsEarned: 0, newBadges: [] };
    }

    // Check if already solved
    const already = user.solvedLabs.some((s) => s.labSlug === lab.slug || s.labId === lab.id);
    if (already) {
      return { alreadySolved: true, pointsEarned: 0, newBadges: [] };
    }

    // Calculate points by difficulty
    const pointsMap: Record<string, number> = {
      Easy: 100,
      Medium: 250,
      Hard: 500,
      Insane: 1000,
    };
    const earned = pointsMap[lab.difficulty] || 100;

    const newSolve: UserSolve = {
      labId: lab.id,
      labSlug: lab.slug,
      labTitle: lab.title,
      category: lab.category,
      difficulty: lab.difficulty,
      pointsEarned: earned,
      solvedAt: new Date().toISOString(),
    };

    const updatedSolves = [newSolve, ...user.solvedLabs];
    const totalPoints = user.points + earned;
    const newRank = calculateRank(totalPoints);

    // Evaluate badges
    const newBadges: Badge[] = [];
    const unlockedCodes = new Set(user.unlockedBadges);

    // Badge 1: First Blood
    if (!unlockedCodes.has('FIRST_BLOOD')) {
      const b = BADGES_CATALOG.find((x) => x.code === 'FIRST_BLOOD');
      if (b) {
        newBadges.push(b);
        unlockedCodes.add('FIRST_BLOOD');
      }
    }

    // Badge 2: Packet Detective (2 forensics/network)
    const forensicsCount = updatedSolves.filter((s) => s.category === 'Forensics' || s.category === 'Network').length;
    if (forensicsCount >= 2 && !unlockedCodes.has('PACKET_DETECTIVE')) {
      const b = BADGES_CATALOG.find((x) => x.code === 'PACKET_DETECTIVE');
      if (b) {
        newBadges.push(b);
        unlockedCodes.add('PACKET_DETECTIVE');
      }
    }

    // Badge 3: Web Slayer
    if (lab.category === 'Web' && !unlockedCodes.has('WEB_SLAYER')) {
      const b = BADGES_CATALOG.find((x) => x.code === 'WEB_SLAYER');
      if (b) {
        newBadges.push(b);
        unlockedCodes.add('WEB_SLAYER');
      }
    }

    // Badge 4: Insane Root
    if (lab.difficulty === 'Insane' && !unlockedCodes.has('INSANE_ROOT')) {
      const b = BADGES_CATALOG.find((x) => x.code === 'INSANE_ROOT');
      if (b) {
        newBadges.push(b);
        unlockedCodes.add('INSANE_ROOT');
      }
    }

    // Badge 5: Speed Demon
    if (totalPoints >= 1000 && !unlockedCodes.has('SPEED_DEMON')) {
      const b = BADGES_CATALOG.find((x) => x.code === 'SPEED_DEMON');
      if (b) {
        newBadges.push(b);
        unlockedCodes.add('SPEED_DEMON');
      }
    }

    const finalPoints = totalPoints + newBadges.reduce((acc, b) => acc + b.pointsBonus, 0);

    const updatedUser: UserProfile = {
      ...user,
      points: finalPoints,
      rank: newRank,
      solvedLabs: updatedSolves,
      unlockedBadges: Array.from(unlockedCodes),
    };

    setUser(updatedUser);

    return {
      alreadySolved: false,
      pointsEarned: earned,
      newBadges,
    };
  };

  const submitFlag = async (
    lab: { id: string; slug: string; title: string; category: string; difficulty: string },
    flag: string,
  ): Promise<FlagSubmission> => {
    if (!user) {
      return { accepted: false, alreadySolved: false, pointsEarned: 0, newBadges: [], message: 'Inicia sesión para enviar una flag.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        accepted: false,
        alreadySolved: false,
        pointsEarned: 0,
        newBadges: [],
        message: 'La validación requiere conexión con Supabase. El modo local no contiene flags.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('submit_flag', {
        p_lab_id: lab.id,
        p_flag: flag,
      });
      if (error) throw error;

      const result = Array.isArray(data) ? data[0] : data;
      if (!result?.accepted) {
        return { accepted: false, alreadySolved: false, pointsEarned: 0, newBadges: [], message: 'Flag incorrecta. Revisa las pistas.' };
      }

      if (!result.already_solved) {
        const newSolve: UserSolve = {
          labId: lab.id,
          labSlug: lab.slug,
          labTitle: lab.title,
          category: lab.category,
          difficulty: lab.difficulty,
          pointsEarned: result.points_earned,
          solvedAt: new Date().toISOString(),
        };

        setUser((current) => current ? {
          ...current,
          points: result.total_points,
          rank: calculateRank(result.total_points),
          accessStatus: result.access_status as AccessStatus,
          solvedLabs: [newSolve, ...current.solvedLabs],
        } : current);
      }

      return {
        accepted: true,
        alreadySolved: result.already_solved,
        pointsEarned: result.points_earned,
        newBadges: [],
      };
    } catch (err) {
      return {
        accepted: false,
        alreadySolved: false,
        pointsEarned: 0,
        newBadges: [],
        message: err instanceof Error ? err.message : 'No se pudo validar la flag.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        recordSolve,
        submitFlag,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
