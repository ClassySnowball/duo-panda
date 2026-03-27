-- Add localized deck names for Dutch, Polish, and English
ALTER TABLE decks
  ADD COLUMN IF NOT EXISTS name_nl text,
  ADD COLUMN IF NOT EXISTS name_pl text,
  ADD COLUMN IF NOT EXISTS name_en text;
