'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
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

          <div>
            <label className="block text-sm font-medium text-trail-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-trail-200 rounded-xl px-4 py-3 text-trail-700 placeholder:text-trail-300 focus:ring-2 focus:ring-forest-400 focus:outline-none"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-rust-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
