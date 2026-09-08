import React, { createContext, useCallback, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isDemoModeEnabled, isSupabaseConfigured } from '@/lib/supabase';
import type { AccessStatus, UserProfile, UserSolve, RankTier, Badge } from '@/types/auth';

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

interface FlagSubmission {
  accepted: boolean;
  alreadySolved: boolean;
  pointsEarned: number;
  newBadges: Badge[];
  message?: string;
}

type EditableProfileData = Partial<
  Pick<UserProfile, 'fullName' | 'avatarUrl' | 'bio' | 'specialty' | 'githubUrl' | 'discordTag' | 'linkedinUrl'>
>;

type AuthActionResult = { error?: string };

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthActionResult>;
  updateProfile: (updatedData: EditableProfileData) => Promise<AuthActionResult>;
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

  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured());

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

  const refreshUser = useCallback(async (): Promise<AuthActionResult> => {
    if (!isSupabaseConfigured()) return {};

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) return { error: sessionError.message };

      if (!session?.user) {
        setUser(null);
        return {};
      }

      const [profileResult, solvesResult, badgesResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, specialty, points, rank, access_status, github_url, discord_tag, linkedin_url, created_at')
          .eq('id', session.user.id)
          .single(),
        supabase
          .from('user_solves')
          .select('lab_id, points_earned, solved_at, labs(slug, title, category, difficulty)')
          .eq('user_id', session.user.id),
        supabase
          .from('user_badges')
          .select('badge_code')
          .eq('user_id', session.user.id),
      ]);

      const queryError = profileResult.error || solvesResult.error || badgesResult.error;
      if (queryError) return { error: queryError.message };

      const profile = profileResult.data;
      if (!profile) {
        setUser(null);
        return { error: 'No se encontró el perfil asociado a esta cuenta.' };
      }

      setUser({
        id: profile.id,
        username: profile.username,
        email: session.user.email,
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
        solvedLabs: toUserSolves(solvesResult.data),
        unlockedBadges: (badgesResult.data || []).map((badge) => badge.badge_code),
        createdAt: profile.created_at,
      });

      return {};
    } catch (error) {
      return { error: getErrorMessage(error, 'No se pudo actualizar la sesión.') };
    }
  }, []);

  // Resolve the initial Supabase session before rendering protected content.
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const checkSession = async () => {
      const result = await refreshUser();
      if (isActive) {
        if (result.error) console.error('Error fetching Supabase auth session:', result.error);
        setLoading(false);
      }
    };

    void checkSession();
    return () => {
      isActive = false;
    };
  }, [refreshUser]);

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
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${cleanUsername}@example.com`,
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
      const { error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });

      if (error) throw error;

      const refreshResult = await refreshUser();
      if (refreshResult.error) return refreshResult;
      return {};
    } catch (err) {
      return { error: getErrorMessage(err, 'Error al iniciar sesión') };
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
        bio: 'Integrante de la comunidad ShadowBytes.',
        specialty: 'Ciberseguridad',
        points: 0,
        rank: 'Script Kiddie',
        accessStatus: 'applicant',
        solvedLabs: [],
        unlockedBadges: [],
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

      if (data.session?.user) {
        const refreshResult = await refreshUser();
        if (refreshResult.error) return refreshResult;
      } else {
        // With email confirmation enabled, signUp returns a user but no authenticated session.
        setUser(null);
      }
      return {};
    } catch (err) {
      return { error: getErrorMessage(err, 'Error al registrar usuario') };
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

  const updateProfile = async (updatedData: EditableProfileData): Promise<AuthActionResult> => {
    if (!user) return { error: 'No hay usuario autenticado' };

    const newProfile: UserProfile = {
      ...user,
      fullName: updatedData.fullName ?? user.fullName,
      avatarUrl: updatedData.avatarUrl ?? user.avatarUrl,
      bio: updatedData.bio ?? user.bio,
      specialty: updatedData.specialty ?? user.specialty,
      githubUrl: updatedData.githubUrl ?? user.githubUrl,
      discordTag: updatedData.discordTag ?? user.discordTag,
      linkedinUrl: updatedData.linkedinUrl ?? user.linkedinUrl,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
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
          .eq('id', user.id)
          .select('id')
          .single();

        if (error) return { error: error.message };
        if (!data) return { error: 'Supabase no confirmó la actualización del perfil.' };
      } catch (error) {
        return { error: getErrorMessage(error, 'No se pudo actualizar el perfil.') };
      }
    }

    setUser(newProfile);
    return {};
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
        refreshUser,
        updateProfile,
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
