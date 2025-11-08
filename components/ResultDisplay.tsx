
import React from 'react';
import { EmotionResult, AnalysisMode } from '../types';
import Loader from './Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultDisplayProps {
  results: EmotionResult[] | null;
  isLoading: boolean;
  error: string | null;
  mode: AnalysisMode;
}

const emotionDetails: { [key: string]: { emoji: string; color: string } } = {
  happy: { emoji: '😊', color: '#34D399' },
  sad: { emoji: '😢', color: '#60A5FA' },
  angry: { emoji: '😠', color: '#F87171' },
  surprised: { emoji: '😮', color: '#FBBF24' },
  neutral: { emoji: '😐', color: '#9CA3AF' },
  fear: { emoji: '😨', color: '#A78BFA' },
  default: { emoji: '🤔', color: '#A78BFA' },
};

const ResultCard: React.FC<{ result: EmotionResult, title: string }> = ({ result, title }) => {
    const { primaryEmotion, emotionScores, justification } = result;
    const details = emotionDetails[primaryEmotion.toLowerCase()] || emotionDetails.default;

    const chartData = Object.entries(emotionScores).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        // FIX: Explicitly convert value to a number to prevent type errors during arithmetic operations.
        score: Math.round(Number(value) * 100),
        color: emotionDetails[name.toLowerCase()]?.color || '#9CA3AF'
    }));
    
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">{title}</h3>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-6xl mb-2">{details.emoji}</span>
                    <p className="text-2xl font-bold" style={{ color: details.color }}>
                        {primaryEmotion.charAt(0).toUpperCase() + primaryEmotion.slice(1)}
                    </p>
                    <p className="text-slate-400 mt-2 italic">"{justification}"</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-slate-300">Emotional Breakdown (%)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} width={80} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                contentStyle={{
                                    background: 'rgba(30, 41, 59, 0.8)',
                                    borderColor: '#475569',
                                    borderRadius: '0.5rem',
                                }}
                                labelStyle={{ color: '#cbd5e1' }}
                            />
                            <Bar dataKey="score" barSize={20} radius={[0, 10, 10, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results, isLoading, error, mode }) => {
  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <Loader />
        <p className="mt-4 text-slate-400">AI is analyzing... please wait.</p>
      </div>
    );
  }

  if (error) {
    return <div className="mt-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">{error}</div>;
  }
  
  if (!results) {
    return (
        <div className="mt-8 text-center text-slate-500">
            <p>Analysis results will appear here.</p>
        </div>
    );
  }

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-bold mb-4 text-slate-200">Analysis Results</h2>
       <div className="space-y-4">
        {results.map((result, index) => (
          <ResultCard 
            key={result.id} 
            result={result} 
            title={mode === AnalysisMode.Upload && results.length > 1 ? `Video Frame ${index + 1}` : "Overall Emotion"} 
          />
        ))}
       </div>
    </div>
  );
};

export default ResultDisplay;
