import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVoiceGenerator, VOICE_OPTIONS, MODEL_OPTIONS } from '@/hooks/useVoiceGenerator';
import { Loader2, Volume2, Play, Pause, Upload, Mic } from 'lucide-react';

interface VoiceGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonTitle?: string;
  lessonContent?: string;
  courseId?: string;
  onAudioGenerated?: (audioUrl: string) => void;
}

export function VoiceGenerateDialog({
  open,
  onOpenChange,
  lessonTitle,
  lessonContent,
  courseId,
  onAudioGenerated,
}: VoiceGenerateDialogProps) {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState(VOICE_OPTIONS[0].id);
  const [modelId, setModelId] = useState(MODEL_OPTIONS[0].id);
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [speed, setSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const {
    isGenerating,
    audioUrl,
    audioBlob,
    generateVoice,
    uploadGeneratedAudio,
    cleanup,
  } = useVoiceGenerator();

  useEffect(() => {
    if (open && lessonContent) {
      // Strip markdown and clean up text for narration
      const cleanText = lessonContent
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italics
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        .trim();
      setText(cleanText);
    }
  }, [open, lessonContent]);

  useEffect(() => {
    return () => {
      cleanup();
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []);

  const handleGenerate = async () => {
    await generateVoice(text, {
      voiceId,
      modelId,
      stability,
      similarityBoost,
      speed,
    });
  };

  const handlePlayPause = () => {
    if (!audioUrl) return;

    if (isPlaying && audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setAudioElement(audio);
      setIsPlaying(true);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob || !courseId) return;

    const fileName = `audio-${lessonTitle?.replace(/\s+/g, '-').toLowerCase() || 'narration'}-${Date.now()}`;
    const url = await uploadGeneratedAudio(audioBlob, courseId, fileName);
    
    if (url && onAudioGenerated) {
      onAudioGenerated(url);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    cleanup();
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
    onOpenChange(false);
  };

  const selectedVoice = VOICE_OPTIONS.find(v => v.id === voiceId);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Generate Voice Narration
          </DialogTitle>
          <DialogDescription>
            Create AI-powered audio narration for {lessonTitle || 'your lesson content'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="voice-text">Text to Narrate</Label>
            <Textarea
              id="voice-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {text.length} characters • ~{Math.ceil(text.split(/\s+/).length / 150)} min estimated
            </p>
          </div>

          {/* Voice Selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Voice</Label>
              <Select value={voiceId} onValueChange={setVoiceId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOICE_OPTIONS.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex flex-col">
                        <span>{voice.name}</span>
                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span>{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Voice Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Voice Settings</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stability</span>
                <span className="text-sm font-medium">{stability.toFixed(2)}</span>
              </div>
              <Slider
                value={[stability]}
                onValueChange={([v]) => setStability(v)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower = more expressive, Higher = more consistent
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Similarity</span>
                <span className="text-sm font-medium">{similarityBoost.toFixed(2)}</span>
              </div>
              <Slider
                value={[similarityBoost]}
                onValueChange={([v]) => setSimilarityBoost(v)}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Speed</span>
                <span className="text-sm font-medium">{speed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
                min={0.7}
                max={1.2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-10 w-10"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <p className="font-medium">Preview Ready</p>
                    <p className="text-sm text-muted-foreground">
                      Voice: {selectedVoice?.name}
                    </p>
                  </div>
                </div>
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {audioUrl && courseId && (
            <Button variant="secondary" onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Save Audio
            </Button>
          )}
          
          <Button onClick={handleGenerate} disabled={isGenerating || !text.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                {audioUrl ? 'Regenerate' : 'Generate Voice'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
