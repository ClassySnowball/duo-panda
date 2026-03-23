import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AddCardForm from '@/components/AddCardForm';

export const dynamic = 'force-dynamic';

export default async function NewCardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: decks } = await supabase
    .from('decks')
    .select('*')
    .or(`user_id.eq.${user.id},is_public.eq.true`)
    .order('name');

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-trail-700">Add New Card</h1>
      <p className="text-sm text-trail-500">Add a word, phrase, or sentence in all three languages.</p>
      <AddCardForm decks={decks ?? []} />
    </div>
  );
}
