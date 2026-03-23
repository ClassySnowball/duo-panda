'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-trail-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/icons/icon-192.png" alt="Duo Panda" className="w-24 h-24 mx-auto mb-3 rounded-2xl" />
          <h1 className="text-3xl font-bold text-trail-700">Join Duo Panda</h1>
          <p className="text-trail-500 mt-2">Start your language learning journey</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-trail-200 p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <h2 className="text-lg font-bold text-trail-700 mb-2">Check your email</h2>
            <p className="text-trail-500 text-sm">
              We sent a magic link to <strong>{email}</strong>. Click it to get started.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-trail-600 mb-1">Your name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
                placeholder="Davey"
                required
              />
            </div>

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

            {error && <p className="text-sm text-rust-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-trail-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-forest-500 hover:text-forest-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
