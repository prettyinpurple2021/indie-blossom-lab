/**
 * @file EmailPreferencesCard.tsx — Email Suppression / Resubscribe Card
 *
 * Shows whether the user's email is currently suppressed (unsubscribed,
 * bounced, or marked as spam) and lets them resubscribe in one click.
 */
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MailCheck, MailX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuppressionRecord {
  email: string;
  reason: 'unsubscribe' | 'bounce' | 'complaint';
  created_at: string;
}

const REASON_LABEL: Record<string, string> = {
  unsubscribe: 'You unsubscribed',
  bounce: 'Email bounced',
  complaint: 'Marked as spam',
};

export function EmailPreferencesCard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<SuppressionRecord | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-email-preferences', {
        method: 'GET',
      });
      if (error) throw error;
      setRecord(data?.record ?? null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleResubscribe = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-email-preferences', {
        body: { action: 'resubscribe' },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: 'Resubscribed', description: "You'll receive notification emails again." });
        setRecord(null);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message ?? 'Try again later.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass-card border-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          {record ? (
            <MailX className="h-5 w-5 text-destructive" />
          ) : (
            <MailCheck className="h-5 w-5 text-secondary drop-shadow-[0_0_8px_hsl(var(--secondary)/0.5)]" />
          )}
          Email Delivery
        </CardTitle>
        <CardDescription>
          Manage whether SoloSuccess Academy can send notification emails to your address.
          Authentication emails (password resets, verification) are always sent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking status...
          </div>
        ) : record ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="destructive" className="uppercase tracking-wide">
                Suppressed
              </Badge>
              <p className="text-sm text-muted-foreground">
                Reason: <span className="text-foreground">{REASON_LABEL[record.reason] ?? record.reason}</span>
              </p>
            </div>
            <Button onClick={handleResubscribe} disabled={submitting} variant="neon">
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Resubscribe
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-secondary/20 text-secondary border-secondary/40">Active</Badge>
            <span className="text-muted-foreground">You're subscribed to notification emails.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
