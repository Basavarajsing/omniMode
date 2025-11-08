
import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface TextInputAnalysisProps {
  onAnalyze: (data: { text: string }) => void;
  isLoading: boolean;
}

const TextInputAnalysis: React.FC<TextInputAnalysisProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze({ text });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-slate-300">Analyze Emotion from Text</h2>
      <p className="text-slate-400">Enter any text below, and our AI will analyze the underlying emotions.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="For example: 'I'm so excited for the weekend! It's been a long week but I'm looking forward to relaxing.'"
          className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="self-start flex items-center justify-center gap-2 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </form>
    </div>
  );
};

export default TextInputAnalysis;
