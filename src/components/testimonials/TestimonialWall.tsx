/**
 * TestimonialWall — public-facing display of approved testimonials.
 * Safe to embed on landing/marketing pages.
 */
import { Star } from 'lucide-react';
import { useApprovedTestimonials } from '@/hooks/useTestimonials';
import { cn } from '@/lib/utils';

export function TestimonialWall({ limit = 6 }: { limit?: number }) {
  const { data, isLoading } = useApprovedTestimonials(limit);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 rounded-lg bg-muted/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((t) => (
        <figure
          key={t.id}
          className="rounded-lg border border-border bg-card/60 p-5 flex flex-col"
        >
          <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cn(
                  'h-4 w-4',
                  n <= t.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30',
                )}
              />
            ))}
          </div>
          <blockquote className="text-sm leading-relaxed flex-1">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 pt-3 border-t border-border/50">
            <div className="font-semibold text-sm">{t.author_name}</div>
            {t.author_role && (
              <div className="text-xs text-muted-foreground">{t.author_role}</div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}