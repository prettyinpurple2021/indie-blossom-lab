import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  FileText,
  HelpCircle,
  ClipboardList,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface GenerationPreviewProps {
  type: 'content' | 'quiz' | 'worksheet' | 'activity';
  generatedContent: any;
  onApply: () => void;
  onDiscard: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

const typeIcons = {
  content: FileText,
  quiz: HelpCircle,
  worksheet: ClipboardList,
  activity: Zap,
};

const typeLabels = {
  content: 'Lecture Content',
  quiz: 'Quiz Questions',
  worksheet: 'Worksheet',
  activity: 'Activity',
};

export function GenerationPreview({
  type,
  generatedContent,
  onApply,
  onDiscard,
  onRegenerate,
  isRegenerating = false,
}: GenerationPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const Icon = typeIcons[type];

  const renderPreview = () => {
    switch (type) {
      case 'content':
        return (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(
                  generatedContent.substring(0, 500) + (generatedContent.length > 500 ? '...' : '')
                ) 
              }} 
            />
          </div>
        );
      
      case 'quiz':
        if (!generatedContent?.questions) return <p className="text-muted-foreground">No questions generated</p>;
        return (
          <div className="space-y-3">
            <Badge variant="outline">{generatedContent.questions.length} questions generated</Badge>
            {generatedContent.questions.slice(0, 3).map((q: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="font-medium text-sm mb-2">Q{i + 1}: {q.question}</p>
                <div className="flex flex-wrap gap-1">
                  {q.options?.map((opt: string, j: number) => (
                    <Badge 
                      key={j} 
                      variant={j === q.correctIndex ? 'default' : 'secondary'}
                      className={cn(
                        "text-xs",
                        j === q.correctIndex && "bg-success/20 text-success border-success/30"
                      )}
                    >
                      {opt.substring(0, 30)}{opt.length > 30 ? '...' : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {generatedContent.questions.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{generatedContent.questions.length - 3} more questions...
              </p>
            )}
          </div>
        );
      
      case 'worksheet':
        if (!generatedContent?.sections) return <p className="text-muted-foreground">No worksheet generated</p>;
        return (
          <div className="space-y-3">
            <div>
              <p className="font-medium">{generatedContent.title}</p>
              <p className="text-sm text-muted-foreground">{generatedContent.instructions?.substring(0, 100)}...</p>
            </div>
            <Badge variant="outline">{generatedContent.sections.length} sections</Badge>
            {generatedContent.sections.slice(0, 2).map((section: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="font-medium text-sm">{section.title}</p>
                <p className="text-xs text-muted-foreground">
                  {section.exercises?.length || 0} exercises
                </p>
              </div>
            ))}
          </div>
        );
      
      case 'activity':
        if (!generatedContent?.steps) return <p className="text-muted-foreground">No activity generated</p>;
        return (
          <div className="space-y-3">
            <div>
              <p className="font-medium">{generatedContent.title}</p>
              <p className="text-sm text-muted-foreground">{generatedContent.description?.substring(0, 100)}...</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{generatedContent.steps.length} steps</Badge>
              <Badge variant="outline">{generatedContent.objectives?.length || 0} objectives</Badge>
            </div>
            {generatedContent.steps.slice(0, 2).map((step: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="font-medium text-sm">Step {step.stepNumber}: {step.title}</p>
                <p className="text-xs text-muted-foreground">{step.duration}</p>
              </div>
            ))}
          </div>
        );
      
      default:
        return <p className="text-muted-foreground">Preview not available</p>;
    }
  };

  return (
    <Card className={cn(
      "border-2 transition-all animate-in slide-in-from-top-2 duration-300",
      "border-primary/50 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Generated {typeLabels[type]}
                <Badge className="bg-success/20 text-success border-success/30">New</Badge>
              </CardTitle>
              <CardDescription>Review the AI-generated content before applying</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <ScrollArea className="h-[200px] rounded-lg border bg-background/50 p-4">
            {renderPreview()}
          </ScrollArea>

          <Separator />

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="border-muted-foreground/30"
            >
              <RotateCcw className={cn("mr-2 h-4 w-4", isRegenerating && "animate-spin")} />
              Regenerate
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscard}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <X className="mr-2 h-4 w-4" />
                Discard
              </Button>
              <Button
                variant="neon"
                size="sm"
                onClick={onApply}
              >
                <Check className="mr-2 h-4 w-4" />
                Apply Content
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
