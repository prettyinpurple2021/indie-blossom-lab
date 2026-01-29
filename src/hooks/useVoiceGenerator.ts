import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VoiceSettings {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  speed?: number;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Professional British narrator' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Warm American female' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', description: 'Clear American male' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Friendly American female' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Casual Australian male' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', description: 'Warm Australian female' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Authoritative British male' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Young British female' },
];

export const MODEL_OPTIONS = [
  { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: 'Highest quality, 29 languages' },
  { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: 'Low latency, high quality' },
];

export function useVoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const generateVoice = async (text: string, settings?: VoiceSettings): Promise<Blob | null> => {
    if (!text.trim()) {
      toast({
        title: 'No text provided',
        description: 'Please provide text to convert to speech.',
        variant: 'destructive',
      });
      return null;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setAudioBlob(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-voice', {
        body: {
          text,
          voiceId: settings?.voiceId,
          modelId: settings?.modelId,
          stability: settings?.stability,
          similarityBoost: settings?.similarityBoost,
          speed: settings?.speed,
        },
      });

      if (error) {
        throw new Error(error.message || 'Voice generation failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Convert base64 to blob using data URI
      const audioDataUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const response = await fetch(audioDataUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);

      toast({
        title: 'Voice generated!',
        description: 'Audio narration has been created successfully.',
      });

      return blob;
    } catch (error: any) {
      console.error('Voice generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate voice narration.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadGeneratedAudio = async (
    blob: Blob,
    courseId: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const filePath = `${courseId}/${fileName}.mp3`;
      
      const { error: uploadError } = await supabase.storage
        .from('lesson-videos') // Reusing the existing bucket for audio too
        .upload(filePath, blob, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('lesson-videos')
        .getPublicUrl(filePath);

      toast({
        title: 'Audio uploaded',
        description: 'Voice narration saved to storage.',
      });

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Audio upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload audio file.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const cleanup = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setAudioBlob(null);
    }
  };

  return {
    isGenerating,
    audioUrl,
    audioBlob,
    generateVoice,
    uploadGeneratedAudio,
    playAudio,
    cleanup,
  };
}
