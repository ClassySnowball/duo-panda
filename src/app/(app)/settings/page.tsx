'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import DirectionPicker from '@/components/DirectionPicker';
import type { Direction } from '@/lib/constants';

export default function SettingsPage() {
  const [dailyGoalReviews, setDailyGoalReviews] = useState(20);
  const [dailyGoalNewWords, setDailyGoalNewWords] = useState(5);
  const [preferredDirection, setPreferredDirection] = useState<Direction>('PL->NL');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDailyGoalReviews(profile.daily_goal_reviews);
        setDailyGoalNewWords(profile.daily_goal_new_words);
        setPreferredDirection(profile.preferred_direction as Direction);
        setDisplayName(profile.display_name || '');
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('profiles').update({
      daily_goal_reviews: dailyGoalReviews,
      daily_goal_new_words: dailyGoalNewWords,
      preferred_direction: preferredDirection,
      display_name: displayName,
    }).eq('id', user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-trail-700">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-trail-200 p-5 space-y-4">
        <h2 className="text-sm font-medium text-trail-500">Profile</h2>
        <div>
          <label className="block text-sm text-trail-600 mb-1">Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-trail-50 border border-trail-200 rounded-xl px-4 py-3 text-trail-700 focus:ring-2 focus:ring-forest-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-trail-600 mb-1">Email</label>
          <p className="text-trail-500 text-sm">{email}</p>
        </div>
      </div>

      {/* Daily Goals */}
      <div className="bg-white rounded-2xl border border-trail-200 p-5 space-y-4">
        <h2 className="text-sm font-medium text-trail-500">Daily Goals</h2>
        <div>
          <label className="block text-sm text-trail-600 mb-2">
            Cards to review: <strong>{dailyGoalReviews}</strong>
          </label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={dailyGoalReviews}
            onChange={(e) => setDailyGoalReviews(Number(e.target.value))}
            className="w-full accent-forest-500"
          />
        </div>
        <div>
          <label className="block text-sm text-trail-600 mb-2">
            New words per day: <strong>{dailyGoalNewWords}</strong>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={dailyGoalNewWords}
            onChange={(e) => setDailyGoalNewWords(Number(e.target.value))}
            className="w-full accent-forest-500"
          />
        </div>
      </div>

      {/* Default Direction */}
      <div className="bg-white rounded-2xl border border-trail-200 p-5 space-y-3">
        <h2 className="text-sm font-medium text-trail-500">Default Direction</h2>
        <DirectionPicker value={preferredDirection} onChange={setPreferredDirection} />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-trail-200 hover:bg-trail-300 text-trail-600 py-3 rounded-xl font-medium transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
