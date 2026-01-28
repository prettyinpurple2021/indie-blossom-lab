-- Create certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  verification_code text NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT now(),
  student_name text NOT NULL,
  course_title text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id),
  UNIQUE(verification_code)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view their own certificates"
ON public.certificates
FOR SELECT
USING (auth.uid() = user_id);

-- Public can view certificates for verification (by verification code)
CREATE POLICY "Anyone can verify certificates"
ON public.certificates
FOR SELECT
USING (true);

-- Users can insert certificates only for courses they've completed
CREATE POLICY "Users can create certificates for completed courses"
ON public.certificates
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND has_purchased_course(auth.uid(), course_id)
);

-- No updates allowed - certificates are immutable
-- No deletes allowed - certificates are permanent