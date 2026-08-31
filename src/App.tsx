import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingTerminal } from '@/components/FloatingTerminal';
import { useTheme } from '@/context/ThemeContext';

// Pages
import Home from '@/pages/Home';
import Labs from '@/pages/Labs';
import LabDetail from '@/pages/LabDetail';
import Upload from '@/pages/Upload';
import Profile from '@/pages/Profile';
import Leaderboard from '@/pages/Leaderboard';
import Achievements from '@/pages/Achievements';
import LearningPaths from '@/pages/LearningPaths';
import LearningLesson from '@/pages/LearningLesson';
import CheatSheets from '@/pages/CheatSheets';
import Admission from '@/pages/Admission';

export const App: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 overflow-hidden font-sans ${
        isDark
          ? 'bg-[#050811] text-white selection:bg-purple-500/30 selection:text-purple-200'
          : 'bg-slate-50 text-slate-900 selection:bg-blue-500/20 selection:text-blue-900'
      }`}
    >
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/lab/:slug" element={<LabDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/paths" element={<LearningPaths />} />
          <Route path="/learn/:pathSlug/:moduleId" element={<LearningLesson />} />
          <Route path="/cheatsheets" element={<CheatSheets />} />
          <Route path="/admission" element={<Admission />} />
        </Routes>
      </main>
      <FloatingTerminal />
      <Footer />
    </div>
  );
};

export default App;
