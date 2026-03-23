import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StreakDisplay from '@/components/StreakDisplay';
import StatsChart from '@/components/StatsChart';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Streak
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Last 7 days stats
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().split('T')[0], count: 0 });
  }

  const { data: recentStats } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', days[0].date)
    .order('date');

  recentStats?.forEach((s) => {
    const day = days.find(d => d.date === s.date);
    if (day) day.count = s.cards_reviewed;
  });

  // Totals
  const { count: totalReviews } = await supabase
    .from('review_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: totalCards } = await supabase
    .from('user_card_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-trail-700">Progress</h1>

      {/* Streak */}
      <div className="bg-white rounded-2xl border border-trail-200 p-6 flex items-center justify-around">
        <StreakDisplay streak={streak?.current_streak ?? 0} size="lg" />
        <div className="text-center">
          <div className="text-2xl font-bold text-trail-700">{streak?.longest_streak ?? 0}</div>
          <div className="text-xs text-trail-400">Longest streak</div>
        </div>
      </div>

      {/* Chart */}
      <StatsChart data={days} />

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-trail-200 p-5 text-center">
          <div className="text-2xl font-bold text-forest-500">{totalReviews ?? 0}</div>
          <div className="text-sm text-trail-400">Total reviews</div>
        </div>
        <div className="bg-white rounded-2xl border border-trail-200 p-5 text-center">
          <div className="text-2xl font-bold text-forest-500">{totalCards ?? 0}</div>
          <div className="text-sm text-trail-400">Cards learned</div>
        </div>
      </div>
    </div>
  );
}
