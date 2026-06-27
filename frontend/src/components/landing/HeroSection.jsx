'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiArrowRightLine, RiShieldCheckLine, RiMoneyDollarCircleLine } from 'react-icons/ri';

const ThreeGlobe = dynamic(() => import('./ThreeGlobe'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ThreeGlobe />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brutal-black/50 to-brutal-black z-[1]" />

      <div className="relative z-[2] max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border-2 border-iris-600 bg-iris-600/10">
            <RiShieldCheckLine className="w-4 h-4 text-iris-400" />
            <span className="text-xs font-bold text-iris-400 uppercase tracking-widest">
              Powered by Mozilla Otari
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] mb-6">
            <span className="text-white">IRIS</span>
            <br />
            <span className="gradient-text">AI That Thinks</span>
            <br />
            <span className="text-white">Before It Answers</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            Dynamic routing · $2 budget awareness · Injection-proof · 100% transparent
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mb-10 font-mono">
            <span className="flex items-center gap-1">
              <RiMoneyDollarCircleLine className="w-3 h-3 text-emerald-400" />
              $0.0001/simple
            </span>
            <span className="text-brutal-border">•</span>
            <span>$0.0005/medium</span>
            <span className="text-brutal-border">•</span>
            <span>$0.006/complex</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary text-lg flex items-center justify-center gap-2">
              Start for Free
              <RiArrowRightLine className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="btn-outline text-lg">
              Learn How It Works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16"
        >
          <div className="glass p-4 max-w-lg mx-auto">
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-mono text-gray-400">
                  Claude Haiku 4.5 · score 48 · $0.0004 · ✓ Clean
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  &quot;Explain the difference between TCP and UDP...&quot;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
