
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraIcon, VideoOffIcon } from './icons';

interface WebcamAnalysisProps {
  onAnalyze: (data: { base64Data: string; mimeType: string }) => void;
  isLoading: boolean;
}

const WebcamAnalysis: React.FC<WebcamAnalysisProps> = ({ onAnalyze, isLoading }) => {
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startWebcam = async () => {
    if (isWebcamOn) return;
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsWebcamOn(true);
    } catch (err) {
      setError("Webcam access was denied. Please allow camera access in your browser settings.");
      setIsWebcamOn(false);
    }
  };

  useEffect(() => {
    startWebcam();
    return () => {
      cleanupStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current && !isLoading) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      onAnalyze({ base64Data, mimeType: 'image/jpeg' });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold text-slate-300">Analyze Emotion from Webcam</h2>
      <p className="text-slate-400 text-center">Enable your webcam, position your face in the frame, and capture an image to analyze your expression.</p>
       {error && <p className="text-red-400 text-center">{error}</p>}
      <div className="w-full max-w-md aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700 mt-2">
         {isWebcamOn ? (
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
         ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <VideoOffIcon className="w-16 h-16"/>
                <p className="mt-2">Webcam is off</p>
            </div>
         )}
      </div>
      <button
        onClick={handleCapture}
        disabled={!isWebcamOn || isLoading}
        className="flex items-center justify-center gap-2 mt-4 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
      >
        <CameraIcon className="w-5 h-5" />
        {isLoading ? 'Analyzing...' : 'Capture & Analyze'}
      </button>
    </div>
  );
};

export default WebcamAnalysis;
