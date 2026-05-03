
-- Severity enum used by the announcement banner
DO $$ BEGIN
  CREATE TYPE public.announcement_severity AS ENUM ('info', 'success', 'warning');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Main announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  severity public.announcement_severity NOT NULL DEFAULT 'info',
  cta_label text,
  cta_url text,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS announcements_active_window_idx
  ON public.announcements (is_active, starts_at, ends_at);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users read active announcements" ON public.announcements
  FOR SELECT TO authenticated
  USING (
    is_active = true
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at > now())
  );

CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Per-user dismissals
CREATE TABLE IF NOT EXISTS public.announcement_dismissals (
  user_id uuid NOT NULL,
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  dismissed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

ALTER TABLE public.announcement_dismissals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own dismissals" ON public.announcement_dismissals
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users dismiss for themselves" ON public.announcement_dismissals
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read all dismissals" ON public.announcement_dismissals
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
