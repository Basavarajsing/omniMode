import React, { useState, useCallback } from 'react';
import { AnalysisMode, EmotionResult } from './types';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import TextInputAnalysis from './components/TextInputAnalysis';
import VoiceAnalysis from './components/VoiceAnalysis';
import WebcamAnalysis from './components/WebcamAnalysis';
import FileUploadAnalysis from './components/FileUploadAnalysis';
import ResultDisplay from './components/ResultDisplay';
import { analyzeEmotion, analyzeVideoFrames } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.Text);
  const [results, setResults] = useState<EmotionResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisKey, setAnalysisKey] = useState<number>(0);

  const handleAnalysis = useCallback(async (data: { text?: string; base64Data?: string | string[]; mimeType?: string }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      if (mode === AnalysisMode.Upload && Array.isArray(data.base64Data)) {
          const videoResults = await analyzeVideoFrames(data.base64Data);
          setResults(videoResults);
      } else {
        const result = await analyzeEmotion({
          text: data.text,
          base64Data: Array.isArray(data.base64Data) ? data.base64Data[0] : data.base64Data,
          mimeType: data.mimeType,
        });
        setResults(result ? [result] : null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  const handleModeChange = (newMode: AnalysisMode) => {
    setMode(newMode);
    setResults(null);
    setError(null);
    setIsLoading(false);
    setAnalysisKey(prev => prev + 1); // Reset child component state
  };
  
  const renderAnalysisComponent = () => {
    switch (mode) {
      case AnalysisMode.Text:
        return <TextInputAnalysis key={analysisKey} onAnalyze={handleAnalysis} isLoading={isLoading} />;
      case AnalysisMode.Voice:
        return <VoiceAnalysis key={analysisKey} onAnalyze={handleAnalysis} isLoading={isLoading} />;
      case AnalysisMode.Webcam:
        return <WebcamAnalysis key={analysisKey} onAnalyze={handleAnalysis} isLoading={isLoading} />;
      case AnalysisMode.Upload:
        return <FileUploadAnalysis key={analysisKey} onAnalyze={handleAnalysis} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main>
          <>
              <ModeSelector selectedMode={mode} onSelectMode={handleModeChange} />
              <div className="mt-6 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 min-h-[300px]">
                {renderAnalysisComponent()}
              </div>
              <ResultDisplay results={results} isLoading={isLoading} error={error} mode={mode} />
            </>
        </main>
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini API. For entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default App;