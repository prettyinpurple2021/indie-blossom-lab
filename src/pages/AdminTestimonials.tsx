/**
 * AdminTestimonials — moderation queue for student-submitted testimonials.
 * Approved testimonials become visible on the public site.
 */
import { useMemo, useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAllTestimonials, useDeleteTestimonial, useModerateTestimonial,
  type TestimonialStatus,
} from '@/hooks/useTestimonials';
import { cn } from '@/lib/utils';

export default function AdminTestimonials() {
  const { data: all, isLoading } = useAllTestimonials();
  const moderate = useModerateTestimonial();
  const del = useDeleteTestimonial();
  const [tab, setTab] = useState<TestimonialStatus>('pending');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const buckets: Record<TestimonialStatus, typeof all> = {
      pending: [], approved: [], rejected: [],
    };
    (all ?? []).forEach((t) => buckets[t.status]?.push(t));
    return buckets;
  }, [all]);

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve student testimonials before they go live on the public site.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TestimonialStatus)}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending {grouped.pending && grouped.pending.length > 0 && `(${grouped.pending.length})`}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved {grouped.approved && grouped.approved.length > 0 && `(${grouped.approved.length})`}
          </TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        {(['pending', 'approved', 'rejected'] as TestimonialStatus[]).map((s) => (
          <TabsContent key={s} value={s} className="space-y-3 mt-4">
            {isLoading && <div className="text-muted-foreground">Loading…</div>}
            {!isLoading && (!grouped[s] || grouped[s]!.length === 0) && (
              <div className="text-sm text-muted-foreground py-12 text-center border border-dashed rounded-lg">
                No {s} testimonials.
              </div>
            )}
            {grouped[s]?.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={cn('h-4 w-4', n <= t.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30')} />
                  ))}
                  <div className="ml-auto text-xs text-muted-foreground font-mono">
                    {new Date(t.created_at).toLocaleDateString()}
                  </div>
                </div>
                <blockquote className="text-sm">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="text-xs text-muted-foreground">
                  <strong>{t.author_name}</strong>
                  {t.author_role && ` — ${t.author_role}`}
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  {s !== 'approved' && (
                    <Button size="sm" onClick={() => moderate.mutate({ id: t.id, status: 'approved' })}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  )}
                  {s !== 'rejected' && (
                    <Button size="sm" variant="outline" onClick={() => moderate.mutate({ id: t.id, status: 'rejected' })}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => setConfirmId(t.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the submission. Use Reject instead if you may revisit it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmId) del.mutate(confirmId);
                setConfirmId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}