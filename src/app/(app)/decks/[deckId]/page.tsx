import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DeckDetailClient from './DeckDetailClient';

export const dynamic = 'force-dynamic';

export default async function DeckDetailPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: deck } = await supabase
    .from('decks')
    .select('*, category:categories(*)')
    .eq('id', deckId)
    .single();

  if (!deck) notFound();

  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at');

  // Count due cards
  const { count: dueCount } = await supabase
    .from('user_card_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_at', new Date().toISOString());

  return (
    <DeckDetailClient
      deck={deck}
      cards={cards ?? []}
      dueCount={dueCount ?? 0}
    />
  );
}
