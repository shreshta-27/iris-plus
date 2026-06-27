'use client';
import { useState } from 'react';
import { RiRocketLine, RiLoader4Line } from 'react-icons/ri';

export default function ResumeUpload({ onAnalyze, loading }) {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');

  const handleSubmit = () => {
    if (!targetRole.trim() && !currentSkills.trim()) return;
    onAnalyze({ targetRole, currentSkills });
  };

  return (
    <div className="neo-card p-6">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <RiRocketLine className="w-5 h-5 text-emerald-400" />
        Career Simulator
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Target Role / Dream Job
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g., Full Stack Developer, Data Scientist, ML Engineer"
            className="input-brutal"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Current Skills
          </label>
          <textarea
            value={currentSkills}
            onChange={e => setCurrentSkills(e.target.value)}
            placeholder="e.g., Python, React, SQL, basic ML, statistics..."
            rows={3}
            className="input-brutal resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || (!targetRole.trim() && !currentSkills.trim())}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RiLoader4Line className="w-5 h-5 animate-spin" />
              Analyzing with Web Search...
            </>
          ) : (
            <>
              <RiRocketLine className="w-5 h-5" />
              Generate Career Paths
            </>
          )}
        </button>
      </div>
    </div>
  );
}
