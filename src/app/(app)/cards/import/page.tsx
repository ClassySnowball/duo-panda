import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ImportCards from '@/components/ImportCards';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ImportPage() {
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
        <h1 className="text-xl font-bold text-trail-700">Import Cards</h1>
        <Link href="/cards/new" className="text-sm text-forest-500 hover:text-forest-600 font-medium">
          Add single card
        </Link>
      </div>
      <ImportCards decks={decks ?? []} userId={user.id} preferredDirection={profile?.preferred_direction} />
    </div>
  );
}
