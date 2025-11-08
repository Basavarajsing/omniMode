
import React, { useState, useRef } from 'react';
import { fileToBase64, extractFramesFromVideo } from '../utils/fileHelper';
import { UploadIcon, FilmIcon, ImageIcon } from './icons';

interface FileUploadAnalysisProps {
  onAnalyze: (data: { base64Data: string | string[]; mimeType: string }) => void;
  isLoading: boolean;
}

const FileUploadAnalysis: React.FC<FileUploadAnalysisProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/') && !selectedFile.type.startsWith('video/')) {
        setError('Invalid file type. Please upload an image or video.');
        return;
      }
      setError(null);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file || isLoading) return;

    try {
      if (file.type.startsWith('image/')) {
        setProgressMessage('Processing image...');
        const base64Data = await fileToBase64(file);
        onAnalyze({ base64Data, mimeType: file.type });
      } else if (file.type.startsWith('video/')) {
        setProgressMessage('Extracting frames from video...');
        const frames = await extractFramesFromVideo(file, 4);
        setProgressMessage('Analyzing video frames...');
        onAnalyze({ base64Data: frames, mimeType: 'image/jpeg' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file.');
    } finally {
        setProgressMessage(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-semibold text-slate-300">Analyze Emotion from File</h2>
      <p className="text-slate-400 text-center">Upload an image or a short video to analyze the emotions within.</p>
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-md h-48 mt-2 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-cyan-500 hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
        {preview ? (
            file?.type.startsWith('image/') ? (
                <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
                <video src={preview} className="max-h-full max-w-full object-contain" />
            )
        ) : (
          <>
            <UploadIcon className="w-10 h-10 mb-2" />
            <p>Click to browse or drag & drop</p>
            <p className="text-sm text-slate-500">Image (JPG, PNG) or Video (MP4)</p>
          </>
        )}
      </div>

      {file && (
        <div className="text-center">
          <p className="font-semibold text-slate-300 flex items-center gap-2">
            {file.type.startsWith('image/') ? <ImageIcon className="w-5 h-5"/> : <FilmIcon className="w-5 h-5"/>}
            {file.name}
          </p>
        </div>
      )}

      {error && <p className="text-red-400">{error}</p>}
      
      <button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className="flex items-center justify-center gap-2 mt-4 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
      >
        <UploadIcon className="w-5 h-5" />
        {isLoading ? progressMessage || 'Analyzing...' : 'Analyze File'}
      </button>
    </div>
  );
};

export default FileUploadAnalysis;
