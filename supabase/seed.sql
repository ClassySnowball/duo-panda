-- Seed Categories
INSERT INTO categories (name, slug, description, icon, is_default) VALUES
  ('Food', 'food', 'Food, drinks, cooking, and dining', '🍽️', true),
  ('Travel', 'travel', 'Transport, directions, and accommodation', '✈️', true),
  ('Relationships', 'relationships', 'Family, emotions, and social life', '❤️', true),
  ('Hiking', 'hiking', 'Nature, trails, and outdoor gear', '🥾', true),
  ('Dogs', 'dogs', 'Commands, care, and breeds', '🐕', true)
ON CONFLICT (slug) DO NOTHING;

-- Create decks for each category
INSERT INTO decks (category_id, name, description, is_public, card_type) VALUES
  ((SELECT id FROM categories WHERE slug = 'food'), 'Food Essentials', 'Common food and drink vocabulary', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'food'), 'At the Restaurant', 'Phrases for dining out', true, 'phrase'),
  ((SELECT id FROM categories WHERE slug = 'travel'), 'Travel Basics', 'Essential travel vocabulary', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'travel'), 'Getting Around', 'Phrases for transport and directions', true, 'phrase'),
  ((SELECT id FROM categories WHERE slug = 'relationships'), 'Family & Friends', 'People and relationships', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'relationships'), 'Emotions', 'Feelings and emotional expressions', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'hiking'), 'Trail Vocabulary', 'Nature and hiking terms', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'hiking'), 'On the Trail', 'Phrases for hiking adventures', true, 'phrase'),
  ((SELECT id FROM categories WHERE slug = 'dogs'), 'Dog Basics', 'Essential dog vocabulary', true, 'word'),
  ((SELECT id FROM categories WHERE slug = 'dogs'), 'Dog Commands', 'Training commands for dogs', true, 'phrase');

-- FOOD ESSENTIALS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'brood', 'chleb', 'bread', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'kaas', 'ser', 'cheese', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'melk', 'mleko', 'milk', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'water', 'woda', 'water', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'bier', 'piwo', 'beer', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'wijn', 'wino', 'wine', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'koffie', 'kawa', 'coffee', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'thee', 'herbata', 'tea', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'vlees', 'mięso', 'meat', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'vis', 'ryba', 'fish', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'kip', 'kurczak', 'chicken', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'rijst', 'ryż', 'rice', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'aardappel', 'ziemniak', 'potato', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'groente', 'warzywo', 'vegetable', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'fruit', 'owoc', 'fruit', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'appel', 'jabłko', 'apple', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'ei', 'jajko', 'egg', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'boter', 'masło', 'butter', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'suiker', 'cukier', 'sugar', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'zout', 'sól', 'salt', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'peper', 'pieprz', 'pepper', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'soep', 'zupa', 'soup', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'salade', 'sałatka', 'salad', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'tomaat', 'pomidor', 'tomato', 'word'),
  ((SELECT id FROM decks WHERE name = 'Food Essentials'), 'ui', 'cebula', 'onion', 'word');

-- AT THE RESTAURANT
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'De rekening, alstublieft', 'Rachunek, proszę', 'The bill, please', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Ik wil graag bestellen', 'Chciałbym zamówić', 'I would like to order', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Heeft u een tafel voor twee?', 'Czy jest stolik dla dwóch osób?', 'Do you have a table for two?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Wat is het dagmenu?', 'Jakie jest menu dnia?', 'What is the daily menu?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Het eten is heerlijk', 'Jedzenie jest pyszne', 'The food is delicious', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Ik ben vegetariër', 'Jestem wegetarianinem', 'I am a vegetarian', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Nog een drankje, alstublieft', 'Jeszcze jednego drinka, proszę', 'Another drink, please', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'At the Restaurant'), 'Eetsmakelijk!', 'Smacznego!', 'Enjoy your meal!', 'phrase');

-- TRAVEL BASICS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'vliegtuig', 'samolot', 'airplane', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'trein', 'pociąg', 'train', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'bus', 'autobus', 'bus', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'fiets', 'rower', 'bicycle', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'auto', 'samochód', 'car', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'kaartje', 'bilet', 'ticket', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'paspoort', 'paszport', 'passport', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'hotel', 'hotel', 'hotel', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'station', 'stacja', 'station', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'luchthaven', 'lotnisko', 'airport', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'links', 'lewo', 'left', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'rechts', 'prawo', 'right', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'rechtdoor', 'prosto', 'straight ahead', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'kaart', 'mapa', 'map', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'koffer', 'walizka', 'suitcase', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'rugzak', 'plecak', 'backpack', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'strand', 'plaża', 'beach', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'berg', 'góra', 'mountain', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'brug', 'most', 'bridge', 'word'),
  ((SELECT id FROM decks WHERE name = 'Travel Basics'), 'vertrekken', 'odjeżdżać', 'to depart', 'word');

-- GETTING AROUND
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Waar is het station?', 'Gdzie jest stacja?', 'Where is the station?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Hoe laat vertrekt de trein?', 'O której odjeżdża pociąg?', 'What time does the train leave?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Ik ben verdwaald', 'Zgubiłem się', 'I am lost', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Kunt u mij helpen?', 'Czy może mi pan/pani pomóc?', 'Can you help me?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Hoeveel kost een kaartje?', 'Ile kosztuje bilet?', 'How much is a ticket?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Ik wil naar het centrum', 'Chcę jechać do centrum', 'I want to go to the center', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Is het ver lopen?', 'Czy to daleko pieszo?', 'Is it far to walk?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Getting Around'), 'Waar kan ik een taxi vinden?', 'Gdzie mogę znaleźć taksówkę?', 'Where can I find a taxi?', 'phrase');

-- FAMILY & FRIENDS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'moeder', 'matka', 'mother', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'vader', 'ojciec', 'father', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'zus', 'siostra', 'sister', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'broer', 'brat', 'brother', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'kind', 'dziecko', 'child', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'vriend', 'przyjaciel', 'friend', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'vriendin', 'przyjaciółka', 'girlfriend/friend (f)', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'man', 'mężczyzna', 'man', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'vrouw', 'kobieta', 'woman', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'opa', 'dziadek', 'grandfather', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'oma', 'babcia', 'grandmother', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'oom', 'wujek', 'uncle', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'tante', 'ciocia', 'aunt', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'neef', 'kuzyn', 'cousin (m)', 'word'),
  ((SELECT id FROM decks WHERE name = 'Family & Friends'), 'nicht', 'kuzynka', 'cousin (f)', 'word');

-- EMOTIONS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'blij', 'szczęśliwy', 'happy', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'verdrietig', 'smutny', 'sad', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'boos', 'zły', 'angry', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'bang', 'przestraszony', 'scared', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'moe', 'zmęczony', 'tired', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'verliefd', 'zakochany', 'in love', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'trots', 'dumny', 'proud', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'zenuwachtig', 'zdenerwowany', 'nervous', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'opgewonden', 'podekscytowany', 'excited', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'eenzaam', 'samotny', 'lonely', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'dankbaar', 'wdzięczny', 'grateful', 'word'),
  ((SELECT id FROM decks WHERE name = 'Emotions'), 'jaloers', 'zazdrosny', 'jealous', 'word');

-- TRAIL VOCABULARY
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'bos', 'las', 'forest', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'pad', 'ścieżka', 'path', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'berg', 'góra', 'mountain', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'dal', 'dolina', 'valley', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'rivier', 'rzeka', 'river', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'meer', 'jezioro', 'lake', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'waterval', 'wodospad', 'waterfall', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'boom', 'drzewo', 'tree', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'bloem', 'kwiat', 'flower', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'steen', 'kamień', 'stone', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'hemel', 'niebo', 'sky', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'wolk', 'chmura', 'cloud', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'regen', 'deszcz', 'rain', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'zon', 'słońce', 'sun', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'wind', 'wiatr', 'wind', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'wandelschoenen', 'buty trekkingowe', 'hiking boots', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'kompas', 'kompas', 'compass', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'tent', 'namiot', 'tent', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'rugzak', 'plecak', 'backpack', 'word'),
  ((SELECT id FROM decks WHERE name = 'Trail Vocabulary'), 'kaart', 'mapa', 'map', 'word');

-- ON THE TRAIL
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Hoe lang is de wandeling?', 'Jak długi jest szlak?', 'How long is the hike?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Het uitzicht is prachtig', 'Widok jest piękny', 'The view is beautiful', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Laten we even pauzeren', 'Zróbmy przerwę', 'Let''s take a break', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Pas op, het is glad', 'Uważaj, jest ślisko', 'Be careful, it''s slippery', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'We zijn er bijna', 'Prawie jesteśmy', 'We are almost there', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Heb je genoeg water?', 'Czy masz wystarczająco dużo wody?', 'Do you have enough water?', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'De top is bereikt!', 'Szczyt zdobyty!', 'The summit is reached!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'On the Trail'), 'Welk pad nemen we?', 'Którą ścieżką idziemy?', 'Which path do we take?', 'phrase');

-- DOG BASICS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'hond', 'pies', 'dog', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'puppy', 'szczeniak', 'puppy', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'staart', 'ogon', 'tail', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'poot', 'łapa', 'paw', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'snuit', 'pysk', 'snout', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'vacht', 'sierść', 'fur', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'riem', 'smycz', 'leash', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'halsband', 'obroża', 'collar', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'hondenvoer', 'karma dla psa', 'dog food', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'dierenarts', 'weterynarz', 'veterinarian', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'blaffen', 'szczekać', 'to bark', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'kwispelen', 'merdać ogonem', 'to wag tail', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'uitlaten', 'wyprowadzić', 'to walk (a dog)', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'aaien', 'głaskać', 'to pet', 'word'),
  ((SELECT id FROM decks WHERE name = 'Dog Basics'), 'spelen', 'bawić się', 'to play', 'word');

-- DOG COMMANDS
INSERT INTO cards (deck_id, dutch, polish, english, card_type) VALUES
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Zit!', 'Siad!', 'Sit!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Blijf!', 'Zostań!', 'Stay!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Hier!', 'Do mnie!', 'Come here!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Af!', 'Leżeć!', 'Down!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Braaf!', 'Grzeczny!', 'Good boy/girl!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Laat los!', 'Puść!', 'Drop it!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Apport!', 'Aport!', 'Fetch!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Nee!', 'Nie!', 'No!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Rustig!', 'Spokój!', 'Calm down!', 'phrase'),
  ((SELECT id FROM decks WHERE name = 'Dog Commands'), 'Ga maar spelen', 'Idź się bawić', 'Go play', 'phrase');
