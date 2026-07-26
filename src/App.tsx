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

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-purple-500/20 selection:text-purple-900 overflow-hidden">
      {/* Global OS Terminal Log Stream & Watermarks Background */}
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
