'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RiShieldCheckLine, RiArrowRightLine, RiLoader4Line } from 'react-icons/ri';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId) {
      setError('User ID missing. Please login again.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
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

  async function handleResend() {
    if (!userId) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP');
      } else {
        setSuccessMsg('A new OTP has been sent to your email.');
      }
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

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 text-sm rounded-none font-bold">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              <RiShieldCheckLine className="w-4 h-4" /> OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full bg-brutal-black border-2 border-brutal-border text-white p-4 outline-none focus:border-iris-500 transition-colors tracking-[12px] font-mono text-center text-xl"
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-iris-600 hover:bg-iris-500 text-white font-bold py-4 mt-2 border-2 border-iris-600 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-brutal text-lg"
          >
            {loading ? <RiLoader4Line className="animate-spin w-5 h-5" /> : (
              <>Verify <RiArrowRightLine /></>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-iris-400 hover:text-iris-300 font-bold underline decoration-2 underline-offset-4 text-sm"
          >
            Didn't receive the email? Resend OTP
          </button>
        </div>
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
