'use server';

import { createClient } from '@/lib/supabase/server';

export async function saveSubscription(subscription: {
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase.from('push_subscriptions').upsert({
    user_id: user.id,
    endpoint: subscription.endpoint,
    keys_p256dh: subscription.keys_p256dh,
    keys_auth: subscription.keys_auth,
  }, {
    onConflict: 'user_id,endpoint',
  });

  return { success: !error };
}

export async function deleteSubscription(endpoint: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);

  return { success: !error };
}
