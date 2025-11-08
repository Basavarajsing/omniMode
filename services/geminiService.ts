import { GoogleGenAI, Type } from "@google/genai";
import { EmotionResult } from "../types";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    primaryEmotion: {
      type: Type.STRING,
      description: "The single most prominent emotion detected. Must be one of: happy, sad, angry, surprised, neutral, fear.",
    },
    emotionScores: {
      type: Type.OBJECT,
      description: "An object mapping various emotions to their confidence scores between 0 and 1.",
      properties: {
        happy: { type: Type.NUMBER },
        sad: { type: Type.NUMBER },
        angry: { type: Type.NUMBER },
        surprised: { type: Type.NUMBER },
        neutral: { type: Type.NUMBER },
        fear: { type: Type.NUMBER },
      },
       required: ["happy", "sad", "angry", "surprised", "neutral", "fear"],
    },
    justification: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation for the emotional analysis.",
    },
  },
  required: ["primaryEmotion", "emotionScores", "justification"],
};

const getPrompt = (text?: string) => {
    if(text) {
        return `Analyze the emotion of the following text: "${text}". Consider word choice, sentiment, and context. Respond with the specified JSON schema.`;
    }
    return `Analyze the facial expression and body language in this image to determine the emotion being displayed. Respond with the specified JSON schema.`;
}

export const analyzeEmotion = async (
    { text, base64Data, mimeType }: { text?: string; base64Data?: string; mimeType?: string; }
): Promise<EmotionResult | null> => {
    try {
        if (!process.env.API_KEY || process.env.API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
            throw new Error("API key not configured. Please add your key to env.js.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = getPrompt(text);
        const parts: ({text: string} | {inlineData: {data: string, mimeType: string}})[] = [{ text: prompt }];

        if(base64Data && mimeType) {
            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            });
        }
        
        const model = 'gemini-2.5-flash';
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: parts },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                systemInstruction: `You are an expert emotion analyzer. Your response must strictly follow the provided JSON schema. The primary emotion must be one of the keys in emotionScores. The justification should be concise.`
            },
        });
        
        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);

        return { ...parsedResult, id: `analysis-${Date.now()}` };

    } catch (error) {
        console.error("Error analyzing emotion:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("The provided API key is not valid. Please check the key in env.js.");
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to get analysis from Gemini API. Please try again.");
    }
};

export const analyzeVideoFrames = async (base64Frames: string[]): Promise<EmotionResult[]> => {
    const results: EmotionResult[] = [];
    for (let i = 0; i < base64Frames.length; i++) {
        try {
            const frameResult = await analyzeEmotion({ base64Data: base64Frames[i], mimeType: 'image/jpeg' });
            if (frameResult) {
                results.push({ ...frameResult, id: `frame-${i + 1}` });
            }
        } catch(error) {
             console.error(`Error analyzing frame ${i + 1}:`, error);
             if (error instanceof Error && error.message.includes('API key')) {
                throw error;
             }
        }
    }
    return results;
};