/**
 * TestimonialsSection — landing-page wall of approved testimonials.
 * Renders nothing if no approved testimonials exist (keeps the page authentic).
 */
import { TestimonialWall } from '@/components/testimonials/TestimonialWall';
import { useApprovedTestimonials } from '@/hooks/useTestimonials';

export function TestimonialsSection() {
  const { data } = useApprovedTestimonials(6);
  if (!data || data.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2 font-mono">
            ▹ Field Reports
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Real students, real progress
          </h2>
        </div>
        <TestimonialWall limit={6} />
      </div>
    </section>
  );
}