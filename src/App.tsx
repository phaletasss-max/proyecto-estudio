import React from 'react';
import { BackgroundEffect } from '@/components/BackgroundEffect';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Methodology } from '@/components/Methodology';
import { Benefits } from '@/components/Benefits';
import { Community } from '@/components/Community';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-blue-600/30 selection:text-blue-200">
      {/* Background Animated Canvas & Particles */}
      <BackgroundEffect />

      {/* Main Content Layout */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Projects />
          <Methodology />
          <Benefits />
          <Community />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
