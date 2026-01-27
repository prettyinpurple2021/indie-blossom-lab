-- Add admin grade override columns to user_progress
ALTER TABLE public.user_progress 
ADD COLUMN admin_override_score integer,
ADD COLUMN admin_notes text,
ADD COLUMN graded_by uuid,
ADD COLUMN graded_at timestamp with time zone;

-- Add constraint to ensure override score is between 0 and 100
ALTER TABLE public.user_progress 
ADD CONSTRAINT admin_override_score_range CHECK (admin_override_score IS NULL OR (admin_override_score >= 0 AND admin_override_score <= 100));

-- Create policy for admins to update any user progress (for grading)
CREATE POLICY "Admins can view all user progress"
ON public.user_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user progress for grading"
ON public.user_progress
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));