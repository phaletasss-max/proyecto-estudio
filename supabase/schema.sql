-- ==============================================================================
-- 🛡️ SHADOWBYTES DATABASE SCHEMA — TRYHACKME EVOLUTION
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: PROFILES (Perfiles de Usuarios & Gamificación)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
  bio TEXT DEFAULT 'Estudiante y Miembro de ShadowBytes SENATI',
  specialty TEXT DEFAULT 'Ciberseguridad & Redes',
  points INTEGER NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT 'Script Kiddie' CHECK (rank IN ('Script Kiddie', 'Byte Hunter', 'Cyber Specialist', 'Root Operator', 'Shadow Master')),
  github_url TEXT,
  discord_tag TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA: LABS (CTF Machines & Retos)
CREATE TABLE IF NOT EXISTS public.labs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy','Medium','Hard','Insane')),
  category TEXT NOT NULL CHECK (category IN ('Web','Forensics','Pwn','Crypto','Reversing','Network','Misc')),
  description TEXT NOT NULL DEFAULT '',
  zip_url TEXT,
  flag_hash TEXT NOT NULL,
  writeup_markdown TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT 'ShadowBytes Team',
  created_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN DEFAULT false
);

-- 4. TABLA: USER_SOLVES (Registro de Flags y Laboratorios Resueltos)
CREATE TABLE IF NOT EXISTS public.user_solves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lab_id UUID REFERENCES public.labs(id) ON DELETE CASCADE NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  solved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lab_id)
);

-- 5. TABLA: BADGES (Catálogo de Logros)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_bonus INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('Milestone', 'Specialty', 'Community', 'Mastery'))
);

-- 6. TABLA: USER_BADGES (Insignias Desbloqueadas por Usuario)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_code TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_code)
);

-- ==============================================================================
-- INDEXES & PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_labs_slug ON public.labs(slug);
CREATE INDEX IF NOT EXISTS idx_labs_published ON public.labs(is_published);
CREATE INDEX IF NOT EXISTS idx_user_solves_user ON public.user_solves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_solves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Labs: Published are viewable by everyone
CREATE POLICY "Published labs are viewable by everyone" ON public.labs FOR SELECT USING (is_published = true);
CREATE POLICY "Users can insert labs for review" ON public.labs FOR INSERT WITH CHECK (true);

-- Solves: Public read, authenticated users can insert own solve
CREATE POLICY "Solves are viewable by everyone" ON public.user_solves FOR SELECT USING (true);
CREATE POLICY "Users can record own solves" ON public.user_solves FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges: Public read
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (When user signs up via Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Hacker ShadowBytes'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION INSTRUCTIONS:
-- 1. Create a public bucket named 'avatars' (for profile pictures).
-- 2. Create a public bucket named 'ctf-zips' (for challenge attachments).
-- ==============================================================================
