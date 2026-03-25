-- Add preferred review mode to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_review_mode text DEFAULT 'flip';
