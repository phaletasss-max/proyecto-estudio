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

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-blue-500/20 selection:text-blue-900">
      <Navbar />
      <main>
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
