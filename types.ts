
export enum AnalysisMode {
  Text = 'text',
  Voice = 'voice',
  Webcam = 'webcam',
  Upload = 'upload',
}

export interface EmotionScores {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
  fear: number;
  [key: string]: number;
}

export interface EmotionResult {
  primaryEmotion: string;
  emotionScores: EmotionScores;
  justification: string;
  id: string; // For list keys, e.g., frame number
}
