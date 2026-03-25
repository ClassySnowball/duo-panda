-- XP and Levels system
create table user_xp (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_xp integer not null default 0,
  current_level integer not null default 1,
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table user_xp enable row level security;

create policy "Users can view own XP"
  on user_xp for select
  using (user_id = auth.uid());

create policy "Users can insert own XP"
  on user_xp for insert
  with check (user_id = auth.uid());

create policy "Users can update own XP"
  on user_xp for update
  using (user_id = auth.uid());
