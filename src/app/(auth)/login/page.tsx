'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const AUTO_PASSWORD = 'duo-panda-2026!';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    // Try signing in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: AUTO_PASSWORD,
    });

    if (!signInError) {
      router.push('/dashboard');
      return;
    }

    // If user doesn't exist, sign up automatically
    if (signInError.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: AUTO_PASSWORD,
        options: {
          data: {
            display_name: email.split('@')[0],
          },
        },
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push('/dashboard');
      }
      return;
    }

    setLoading(false);
    setError(signInError.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-trail-50">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/icons/icon-192.png" alt="Duo Panda" className="w-24 h-24 mx-auto mb-3 rounded-2xl" />
          <h1 className="text-3xl font-bold text-trail-700">Duo Panda</h1>
          <p className="text-trail-500 mt-2">Learn languages one card at a time</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-trail-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-rust-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
