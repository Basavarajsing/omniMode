import React, { useState } from 'react';
import { KeyIcon, AlertTriangleIcon } from './icons';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
  error?: string | null;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave, error }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key);
    }
  };

  return (
    <div className="mt-6 bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700 flex flex-col items-center text-center">
      <KeyIcon className="w-12 h-12 text-cyan-400 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">Enter Your Gemini API Key</h2>
      <p className="text-slate-400 mt-2 max-w-md">
        To use the analyzer, please provide your API key from Google AI Studio. Your key is stored securely in your browser's local storage and is never sent anywhere else.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-6 flex flex-col gap-4">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your API key here"
          className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!key.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          Save and Continue
        </button>
      </form>
       {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5"/>
            <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ApiKeyInput;
