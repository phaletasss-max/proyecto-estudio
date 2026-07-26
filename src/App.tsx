import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LearningPerks } from '@/components/LearningPerks';
import { Projects } from '@/components/Projects';
import { Methodology } from '@/components/Methodology';
import { Benefits } from '@/components/Benefits';
import { Community } from '@/components/Community';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { GlobalTerminalBackground } from '@/components/GlobalTerminalBackground';
import { useTheme } from '@/context/ThemeContext';

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
      {/* High-Contrast Global OS Terminal & Watermark Background Stream */}
      <GlobalTerminalBackground />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <LearningPerks />
        <Projects />
        <Methodology />
        <Benefits />
        <Community />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
