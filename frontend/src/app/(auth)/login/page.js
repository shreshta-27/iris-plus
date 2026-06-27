'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-mint rounded-full border-3 border-ink animate-float"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-sunny border-3 border-ink rotate-12 animate-wiggle"></div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="neo-card card-purple p-8"
        >
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-black text-ink flex justify-center items-center gap-1">
                IRIS <span className="text-iris-purple">✦</span>
              </span>
            </Link>
            <h1 className="text-3xl font-black text-ink">Welcome back</h1>
            <p className="text-ink/60 font-medium mt-1">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-coral/20 border-3 border-coral text-coral font-bold text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-ink/70 uppercase tracking-widest mb-2">
                <RiMailLine className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className="input-brutal text-lg"
                placeholder="student@university.edu"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-ink/70 uppercase tracking-widest mb-2">
                <RiLockLine className="w-4 h-4" /> Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                className="input-brutal text-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center text-lg mt-4"
            >
              {loading ? <RiLoader4Line className="animate-spin w-6 h-6" /> : (
                <>Sign In <RiArrowRightLine className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-ink/70 border-t-2 border-ink/10 pt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-iris-purple hover:text-ink font-bold underline decoration-2 underline-offset-4 transition-colors">
              Register here
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
