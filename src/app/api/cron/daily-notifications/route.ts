import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import webpush from 'web-push';
import { Resend } from 'resend';
import { getRandomCompliment } from '@/lib/compliments';
import { buildDailyEmail } from '@/lib/email-template';

webpush.setVapidDetails(
  'mailto:daveyverleg1@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// Service-role client that bypasses RLS
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Get all users with profiles
  const { data: profiles } = await supabase.from('profiles').select('id, display_name');
  if (!profiles?.length) return NextResponse.json({ message: 'No users' });

  for (const profile of profiles) {
    const userId = profile.id;

    // Get user's email from auth
    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(userId);
    const email = authUser?.email;

    // Get streak
    const { data: streak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get today's stats
    const { data: todayStats } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    // Get lifetime stats
    const { data: lifetimeStats } = await supabase
      .from('daily_stats')
      .select('cards_reviewed, new_cards_learned')
      .eq('user_id', userId);

    const totalCardsReviewed = lifetimeStats?.reduce((sum, s) => sum + s.cards_reviewed, 0) ?? 0;
    const totalWordsLearned = lifetimeStats?.reduce((sum, s) => sum + s.new_cards_learned, 0) ?? 0;

    // Count due cards
    const { count: dueCards } = await supabase
      .from('user_card_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_at', now.toISOString());

    const hasReviewedToday = !!todayStats && todayStats.cards_reviewed > 0;
    const currentStreak = streak?.current_streak ?? 0;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const streakAtRisk = currentStreak > 0 && streak?.last_review_date === yesterdayStr && !hasReviewedToday;

    // Get push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    // Send push notifications
    if (subscriptions?.length) {
      for (const sub of subscriptions) {
        const pushPayload = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        };

        // Daily reminder
        if ((dueCards ?? 0) > 0) {
          try {
            await webpush.sendNotification(
              pushPayload,
              JSON.stringify({
                title: '🐼 Time to review!',
                body: `You have ${dueCards} cards waiting for you. Let's go!`,
                url: '/dashboard',
              })
            );
          } catch (e) {
            // Subscription may have expired — clean up
            if ((e as { statusCode?: number }).statusCode === 410) {
              await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            }
          }
        }

        // Streak at risk
        if (streakAtRisk) {
          try {
            await webpush.sendNotification(
              pushPayload,
              JSON.stringify({
                title: `🔥 Don't lose your ${currentStreak}-day streak!`,
                body: 'A quick review session will keep it alive.',
                url: '/dashboard',
              })
            );
          } catch (e) {
            if ((e as { statusCode?: number }).statusCode === 410) {
              await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            }
          }
        }
      }
    }

    // Send daily email
    if (email) {
      try {
        await resend.emails.send({
          from: 'Duo Panda <onboarding@resend.dev>',
          to: email,
          subject: `🐼 ${getRandomCompliment().slice(0, 50)}`,
          html: buildDailyEmail({
            displayName: profile.display_name ?? '',
            compliment: getRandomCompliment(),
            totalCardsReviewed,
            totalWordsLearned,
            currentStreak,
            dueCards: dueCards ?? 0,
          }),
        });
      } catch {
        // Email send failed — continue with other users
      }
    }
  }

  return NextResponse.json({ message: 'Notifications sent', users: profiles.length });
}
