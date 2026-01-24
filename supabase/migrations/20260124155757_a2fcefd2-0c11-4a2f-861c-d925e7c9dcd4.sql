-- Add is_published column to lessons table
ALTER TABLE public.lessons ADD COLUMN is_published boolean NOT NULL DEFAULT false;