'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RiMailLine, RiLockLine, RiArrowRightLine, RiLoader4Line } from 'react-icons/ri';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.userId) router.push(`/verify-otp?userId=${data.userId}`);
        else setError(data.error || 'Login failed');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brutal-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-brutal-card border-2 border-iris-600 shadow-brutal p-8 rounded-none">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">Welcome back</h1>
            <p className="text-gray-400 mt-1">Sign in to IRIS</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 text-sm rounded-none">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                <RiMailLine className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className="w-full bg-brutal-black border-2 border-brutal-border text-white p-4 outline-none focus:border-iris-500 transition-colors text-lg"
                placeholder="student@university.edu"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                <RiLockLine className="w-4 h-4" /> Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                className="w-full bg-brutal-black border-2 border-brutal-border text-white p-4 outline-none focus:border-iris-500 transition-colors text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-iris-600 hover:bg-iris-500 text-white font-bold py-4 mt-2 border-2 border-iris-600 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-brutal text-lg"
            >
              {loading ? <RiLoader4Line className="animate-spin w-6 h-6" /> : (
                <>Sign In <RiArrowRightLine className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-iris-400 hover:text-iris-300 font-bold underline decoration-2 underline-offset-4">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
