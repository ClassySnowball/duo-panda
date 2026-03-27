import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DecksClient from './DecksClient';

export const dynamic = 'force-dynamic';

export default async function DecksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: categories }, { data: decks }, { data: profile }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('decks').select('*, category:categories(*)').or(`user_id.eq.${user.id},is_public.eq.true`).order('name'),
    supabase.from('profiles').select('preferred_direction').eq('id', user.id).single(),
  ]);

  return (
    <DecksClient
      categories={categories ?? []}
      decks={decks ?? []}
      preferredDirection={profile?.preferred_direction}
    />
  );
}
