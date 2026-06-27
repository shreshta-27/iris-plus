'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RiLockPasswordLine, RiArrowRightLine, RiLoader4Line } from 'react-icons/ri';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId) {
      setError('User ID missing. Please login again.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
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
    <div className="w-full max-w-md">
      <div className="bg-brutal-card border-2 border-iris-600 shadow-brutal p-8 rounded-none">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">Verify Email</h1>
          <p className="text-gray-400 mt-1">Enter the 6-digit code sent to your email</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950 border border-red-800 text-red-400 text-sm rounded-none">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">OTP Code</label>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
                className="w-full bg-brutal-black border-2 border-brutal-border text-white pl-10 p-3 outline-none focus:border-iris-500 transition-colors tracking-[12px] font-mono text-center text-lg"
                placeholder="123456"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-iris-600 hover:bg-iris-500 text-white font-bold p-3 mt-4 border-2 border-iris-600 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-brutal"
          >
            {loading ? <RiLoader4Line className="animate-spin w-5 h-5" /> : (
              <>Verify <RiArrowRightLine /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-brutal-black flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOTPForm />
      </Suspense>
    </div>
  );
}
