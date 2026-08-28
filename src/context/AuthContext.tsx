import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserProfile, UserSolve, RankTier, Badge } from '@/types/auth';
import { BADGES_CATALOG } from '@/data/badges';

const calculateRank = (points: number): RankTier => {
  if (points >= 5000) return 'Shadow Master';
  if (points >= 3000) return 'Root Operator';
  if (points >= 1500) return 'Cyber Specialist';
  if (points >= 500) return 'Byte Hunter';
  return 'Script Kiddie';
};

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'u1',
  username: 'phaletas_max',
  fullName: 'Manuel Phaletas',
  email: 'manuel@senati.pe',
  avatarUrl: '/logo-shadowbytes.png',
  bio: 'Estudiante de Ciberseguridad en SENATI (4.º ciclo).',
  specialty: 'Ciberseguridad & Redes',
  points: 0,
  rank: 'Script Kiddie',
  githubUrl: 'https://github.com/phaletasss-max',
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

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ error?: string }>;
  recordSolve: (lab: { id: string; slug: string; title: string; category: string; difficulty: string }) => Promise<SolveResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'shadowbytes_user_profile_v2';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
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
    if (user) {
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
            .select('*')
            .eq('id', session.user.id)
            .single();

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
              githubUrl: profile.github_url || '',
              discordTag: profile.discord_tag || '',
              linkedinUrl: profile.linkedin_url || '',
              solvedLabs: user?.solvedLabs || [],
              unlockedBadges: user?.unlockedBadges || ['FIRST_BLOOD', 'SENATI_VETERAN'],
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
    if (!isSupabaseConfigured() || !password) {
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

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
            githubUrl: profile.github_url || '',
            discordTag: profile.discord_tag || '',
            linkedinUrl: profile.linkedin_url || '',
            solvedLabs: [],
            unlockedBadges: ['SENATI_VETERAN'],
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

    if (!isSupabaseConfigured() || !password) {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        username: cleanUsername,
        fullName: fullName || cleanUsername,
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
        bio: 'Nuevo recluta de ShadowBytes SENATI.',
        specialty: 'Ciberseguridad',
        points: 100,
        rank: 'Script Kiddie',
        solvedLabs: [],
        unlockedBadges: ['SENATI_VETERAN'],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      setLoading(false);
      return {};
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
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
          bio: 'Nuevo recluta de ShadowBytes SENATI.',
          specialty: 'Ciberseguridad',
          points: 100,
          rank: 'Script Kiddie',
          solvedLabs: [],
          unlockedBadges: ['SENATI_VETERAN'],
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

    // Sync solve and points with Supabase if online
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').update({ points: finalPoints, rank: newRank }).eq('id', user.id);
        await supabase.from('user_solves').insert({
          user_id: user.id,
          lab_id: lab.id,
          points_earned: earned,
        });
        for (const b of newBadges) {
          await supabase.from('user_badges').insert({
            user_id: user.id,
            badge_code: b.code,
          });
        }
      } catch (err) {
        console.error('Error saving solve to Supabase:', err);
      }
    }

    return {
      alreadySolved: false,
      pointsEarned: earned,
      newBadges,
    };
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
