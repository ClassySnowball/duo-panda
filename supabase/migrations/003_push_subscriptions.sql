-- Push notification subscriptions

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

alter table push_subscriptions enable row level security;

create policy "Users manage own subscriptions" on push_subscriptions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
