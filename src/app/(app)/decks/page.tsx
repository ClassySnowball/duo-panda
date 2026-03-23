import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DecksClient from './DecksClient';

export const dynamic = 'force-dynamic';

export default async function DecksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const { data: decks } = await supabase
    .from('decks')
    .select('*, category:categories(*)')
    .or(`user_id.eq.${user.id},is_public.eq.true`)
    .order('name');

  return (
    <DecksClient
      categories={categories ?? []}
      decks={decks ?? []}
    />
  );
}
