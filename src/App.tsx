import React from 'react';
import { Hero } from '@/components/Hero';

export const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      <Hero />
    </div>
  );
};

export default App;
