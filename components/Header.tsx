
import React from 'react';
import { BrainCircuitIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <BrainCircuitIcon className="w-12 h-12 text-cyan-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          Omni-Mood Analyzer
        </h1>
      </div>
      <p className="text-slate-400 text-lg">
        Unlock emotional insights from text, voice, and visuals with AI.
      </p>
    </header>
  );
};

export default Header;
