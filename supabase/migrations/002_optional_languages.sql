-- Make language columns optional (at least 2 of 3 required)

ALTER TABLE cards ALTER COLUMN dutch DROP NOT NULL;
ALTER TABLE cards ALTER COLUMN polish DROP NOT NULL;
ALTER TABLE cards ALTER COLUMN english DROP NOT NULL;

ALTER TABLE cards ADD CONSTRAINT cards_min_two_languages
  CHECK (
    (dutch IS NOT NULL)::int + (polish IS NOT NULL)::int + (english IS NOT NULL)::int >= 2
  );
