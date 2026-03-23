import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params, searchParams }: {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ direction?: string }>;
}) {
  const { deckId } = await params;
  const { direction } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('daily_goal_new_words')
    .eq('id', user.id)
    .single();

  return (
    <ReviewClient
      deckId={deckId}
      direction={direction || 'PL->NL'}
      newCardsLimit={profile?.daily_goal_new_words ?? 5}
    />
  );
}
