-- Fix 1: Update lessons RLS policy to require purchase
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON public.lessons;

CREATE POLICY "Users can view purchased course lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = lessons.course_id
      AND courses.is_published = true
      AND has_purchased_course(auth.uid(), courses.id)
    )
  );

-- Fix 2: Make lesson-videos bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'lesson-videos';

-- Fix 3: Remove public access policy for lesson videos
DROP POLICY IF EXISTS "Lesson videos are publicly accessible" ON storage.objects;

-- Fix 4: Add purchase-based access policy for lesson videos
CREATE POLICY "Purchased users can access lesson videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'lesson-videos'
  AND EXISTS (
    SELECT 1 FROM public.lessons l
    JOIN public.courses c ON c.id = l.course_id
    WHERE l.video_url LIKE '%' || storage.objects.name || '%'
    AND has_purchased_course(auth.uid(), c.id)
  )
);