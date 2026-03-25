import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getGreeting } from '@/lib/utils';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch today's stats
  const today = new Date().toISOString().split('T')[0];
  const { data: dailyStats } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  // Fetch XP
  const { data: userXP } = await supabase
    .from('user_xp')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch decks with due counts
  const { data: decks } = await supabase
    .from('decks')
    .select('*, category:categories(*)')
    .or(`user_id.eq.${user.id},is_public.eq.true`)
    .limit(6);

  const greeting = getGreeting();
  const displayName = profile?.display_name || 'Explorer';

  return (
    <DashboardClient
      greeting={greeting}
      displayName={displayName}
      streak={streak?.current_streak ?? 0}
      cardsReviewed={dailyStats?.cards_reviewed ?? 0}
      newCardsLearned={dailyStats?.new_cards_learned ?? 0}
      dailyGoalReviews={profile?.daily_goal_reviews ?? 20}
      dailyGoalNewWords={profile?.daily_goal_new_words ?? 5}
      preferredDirection={profile?.preferred_direction ?? 'PL->NL'}
      preferredReviewMode={profile?.preferred_review_mode ?? 'flip'}
      totalXP={userXP?.total_xp ?? 0}
      decks={decks ?? []}
    />
  );
}
