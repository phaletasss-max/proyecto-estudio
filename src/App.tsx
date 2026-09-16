import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';

const Home = lazy(() => import('@/pages/Home'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StudyLibrary = lazy(() => import('@/pages/StudyLibrary'));
const Labs = lazy(() => import('@/pages/Labs'));
const LabDetail = lazy(() => import('@/pages/LabDetail'));
const Upload = lazy(() => import('@/pages/Upload'));
const Profile = lazy(() => import('@/pages/Profile'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const LearningPaths = lazy(() => import('@/pages/LearningPaths'));
const LearningPathDetail = lazy(() => import('@/pages/LearningPathDetail'));
const LearningLesson = lazy(() => import('@/pages/LearningLesson'));
const CheatSheets = lazy(() => import('@/pages/CheatSheets'));
const Admission = lazy(() => import('@/pages/Admission'));
const WslSetup = lazy(() => import('@/pages/WslSetup'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteTransition() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('main h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  }, [pathname]);
  return null;
}

function LoadingRoute() {
  return <div className="flex min-h-[70vh] items-center justify-center bg-background pt-24" role="status" aria-label="Cargando página"><span className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;
}

function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingRoute />;
  return user?.accessStatus === 'admin' ? <Upload /> : <Navigate to="/labs" replace />;
}

export const App: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground selection:bg-accent/25">
      <Navbar />
      <RouteTransition />
      <main id="main-content" className="relative z-10">
        <Suspense fallback={<LoadingRoute />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<StudyLibrary />} />
            <Route path="/setup/wsl" element={<WslSetup />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/lab/:slug" element={<LabDetail />} />
            <Route path="/paths" element={<LearningPaths />} />
            <Route path="/paths/:slug" element={<LearningPathDetail />} />
            <Route path="/learn/:pathSlug/:moduleId" element={<LearningLesson />} />
            <Route path="/cheatsheets" element={<CheatSheets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/admin/labs/new" element={<AdminRoute />} />
            <Route path="/upload" element={<Navigate to="/admin/labs/new" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {pathname === '/' && <Footer />}
    </div>
  );
};

export default App;
