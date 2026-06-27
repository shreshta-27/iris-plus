'use client';
import Link from 'next/link';
import { RiGithubLine, RiExternalLinkLine } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t-2 border-brutal-border bg-brutal-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-black">
              <span className="gradient-text">IRIS</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Intelligent Routing &amp; Injection-Safe System
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              Powered by
              <a
                href="https://otari.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-iris-400 font-bold hover:text-iris-300 flex items-center gap-1"
              >
                Mozilla Otari
                <RiExternalLinkLine className="w-3 h-3" />
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-brutal-border text-center text-xs text-gray-600">
          © 2026 IRIS — Built for Mozilla.ai Hackathon
        </div>
      </div>
    </footer>
  );
}
