'use client';
import { useState } from 'react';
import { RiRocketLine, RiLoader4Line, RiBriefcase4Line, RiCodeBoxLine } from 'react-icons/ri';

export default function ResumeUpload({ onAnalyze, loading }) {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');

  const handleSubmit = () => {
    if (!targetRole.trim() && !currentSkills.trim()) return;
    onAnalyze({ targetRole, currentSkills });
  };

  return (
    <div className="neo-card card-peach p-6 md:p-8 bg-white">
      <h3 className="text-2xl font-black text-ink mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-peach border-2 border-ink flex items-center justify-center shadow-[2px_2px_0_#1A1A2E]">
          <RiRocketLine className="w-5 h-5 text-ink" />
        </div>
        Path Setup
      </h3>

      <div className="space-y-6 mb-8">
        <div>
          <label className="flex items-center gap-2 text-xs font-black text-ink uppercase tracking-widest mb-2">
            <RiBriefcase4Line className="text-peach w-4 h-4" /> Dream Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g., Full Stack Developer, ML Engineer, Product Manager..."
            className="input-brutal text-lg p-4 bg-cream focus:bg-white"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-black text-ink uppercase tracking-widest mb-2">
            <RiCodeBoxLine className="text-peach w-4 h-4" /> Current Skills
          </label>
          <textarea
            value={currentSkills}
            onChange={e => setCurrentSkills(e.target.value)}
            placeholder="e.g., Python, React, SQL, basic ML, communication, teamwork..."
            rows={4}
            className="input-brutal text-base p-4 resize-none bg-cream focus:bg-white"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || (!targetRole.trim() && !currentSkills.trim())}
        className="btn-primary w-full flex items-center justify-center gap-3 text-xl py-4 bg-ink text-white hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RiLoader4Line className="w-6 h-6 animate-spin text-peach" />
            <span className="text-peach">Simulating Paths...</span>
          </>
        ) : (
          <>
            <RiRocketLine className="w-6 h-6 text-peach" />
            Generate Career Plan
          </>
        )}
      </button>
    </div>
  );
}
