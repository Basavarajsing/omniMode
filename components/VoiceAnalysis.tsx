
import React, { useState, useRef, useEffect } from 'react';
import { MicIcon, StopCircleIcon } from './icons';

interface VoiceAnalysisProps {
  onAnalyze: (data: { text: string }) => void;
  isLoading: boolean;
}

const VoiceAnalysis: React.FC<VoiceAnalysisProps> = ({ onAnalyze, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // FIX: Use `any` for the ref type to avoid errors with missing SpeechRecognition types.
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    // FIX: Cast window properties to `any` to access browser-specific speech recognition APIs without TypeScript errors.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscribedText(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleToggleRecording = () => {
    if (isLoading) return;
    
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      if(transcribedText.trim()){
          onAnalyze({ text: transcribedText });
      }
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setTranscribedText('');
          setError(null);
          recognitionRef.current?.start();
          setIsRecording(true);
        })
        .catch(err => {
          setError("Microphone access was denied. Please allow microphone access in your browser settings.");
        });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <h2 className="text-xl font-semibold text-slate-300">Analyze Emotion from Voice</h2>
      <p className="text-slate-400 max-w-md">Click the button to start recording. Speak clearly, and we'll transcribe and analyze the emotion in your voice.</p>
      {error && <p className="text-red-400">{error}</p>}
      <div className="my-4">
        <button
          onClick={handleToggleRecording}
          disabled={isLoading || !recognitionRef.current}
          className={`flex items-center justify-center gap-3 px-8 py-4 text-white font-bold rounded-full transition-all duration-300 shadow-lg
            ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}
            disabled:bg-slate-600 disabled:cursor-not-allowed`}
        >
          {isRecording ? <StopCircleIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
          <span>{isLoading ? 'Analyzing...' : isRecording ? 'Stop & Analyze' : 'Start Recording'}</span>
        </button>
      </div>
      {transcribedText && (
        <div className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg">
          <p className="text-slate-400 italic">"{transcribedText}"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAnalysis;
