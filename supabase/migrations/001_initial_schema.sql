-- Trilingual Trail: Initial Schema
-- Run this in the Supabase SQL Editor

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  daily_goal_reviews int default 20,
  daily_goal_new_words int default 5,
  preferred_direction text default 'PL->NL',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Decks
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean default false,
  card_type text default 'word',
  created_at timestamptz default now()
);

-- Cards
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references decks(id) on delete cascade,
  dutch text not null,
  polish text not null,
  english text not null,
  pronunciation_pl text,
  pronunciation_nl text,
  example_sentence_nl text,
  example_sentence_pl text,
  example_sentence_en text,
  notes text,
  card_type text default 'word',
  tags text[],
  created_at timestamptz default now()
);

-- User Card Progress (SM-2 data)
create table if not exists user_card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  direction text not null,
  ease_factor real default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_at timestamptz default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, card_id, direction)
);

-- Review Log (immutable)
create table if not exists review_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  direction text not null,
  quality int not null,
  reviewed_at timestamptz default now()
);

-- User Streaks
create table if not exists user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade unique,
  current_streak int default 0,
  longest_streak int default 0,
  last_review_date date,
  updated_at timestamptz default now()
);

-- Daily Stats
create table if not exists daily_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null default current_date,
  cards_reviewed int default 0,
  new_cards_learned int default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- Indexes
create index if not exists idx_progress_due on user_card_progress(user_id, direction, next_review_at);
create index if not exists idx_cards_deck on cards(deck_id);
create index if not exists idx_daily_stats_user_date on daily_stats(user_id, date);
create index if not exists idx_review_log_user on review_log(user_id, reviewed_at);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table categories enable row level security;
alter table decks enable row level security;
alter table cards enable row level security;
alter table user_card_progress enable row level security;
alter table review_log enable row level security;
alter table user_streaks enable row level security;
alter table daily_stats enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Categories: readable by all authenticated users
create policy "Categories are readable" on categories for select to authenticated using (true);

-- Decks: public decks readable by all, user decks by owner
create policy "Public decks are readable" on decks for select to authenticated using (is_public = true or user_id = auth.uid());
create policy "Users can insert own decks" on decks for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update own decks" on decks for update to authenticated using (user_id = auth.uid());
create policy "Users can delete own decks" on decks for delete to authenticated using (user_id = auth.uid());

-- Cards: readable if deck is accessible
create policy "Cards are readable" on cards for select to authenticated using (
  exists (select 1 from decks where decks.id = cards.deck_id and (decks.is_public = true or decks.user_id = auth.uid()))
);
create policy "Users can insert cards" on cards for insert to authenticated with check (
  exists (select 1 from decks where decks.id = cards.deck_id and (decks.is_public = true or decks.user_id = auth.uid()))
);

-- User Card Progress: own data only
create policy "Users can manage own progress" on user_card_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Review Log: own data only
create policy "Users can manage own reviews" on review_log for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- User Streaks: own data only
create policy "Users can manage own streaks" on user_streaks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Daily Stats: own data only
create policy "Users can manage own stats" on daily_stats for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
