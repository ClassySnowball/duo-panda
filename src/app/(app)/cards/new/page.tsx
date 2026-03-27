import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AddCardForm from '@/components/AddCardForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewCardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: decks }, { data: profile }] = await Promise.all([
    supabase
      .from('decks')
      .select('*')
      .or(`user_id.eq.${user.id},is_public.eq.true`)
      .order('name'),
    supabase
      .from('profiles')
      .select('preferred_direction')
      .eq('id', user.id)
      .single(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-trail-700">Add New Card</h1>
        <Link href="/cards/import" className="text-sm text-forest-500 hover:text-forest-600 font-medium">
          Bulk import
        </Link>
      </div>
      <p className="text-sm text-trail-500">Add a word, phrase, or sentence in at least two languages.</p>
      <AddCardForm decks={decks ?? []} userId={user.id} preferredDirection={profile?.preferred_direction} />
    </div>
  );
}
