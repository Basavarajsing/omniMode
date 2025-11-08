
import React from 'react';
import { AnalysisMode } from '../types';
import { TypeIcon, MicIcon, CameraIcon, UploadIcon } from './icons';

interface ModeSelectorProps {
  selectedMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const modes = [
    { id: AnalysisMode.Text, label: 'Text', icon: <TypeIcon className="w-5 h-5" /> },
    { id: AnalysisMode.Voice, label: 'Voice', icon: <MicIcon className="w-5 h-5" /> },
    { id: AnalysisMode.Webcam, label: 'Webcam', icon: <CameraIcon className="w-5 h-5" /> },
    { id: AnalysisMode.Upload, label: 'Upload', icon: <UploadIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex justify-center bg-slate-800 p-2 rounded-xl shadow-md border border-slate-700">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={`
            flex-1 md:flex-initial md:px-6 py-3 text-sm font-semibold rounded-lg flex items-center justify-center gap-2
            transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500
            ${selectedMode === mode.id
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'bg-transparent text-slate-300 hover:bg-slate-700'
            }
          `}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
