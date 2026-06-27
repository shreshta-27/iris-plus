'use client';
import { RiArrowRightSLine, RiTimeLine, RiMoneyDollarCircleLine, RiStarLine } from 'react-icons/ri';

const difficultyColors = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function CareerPath({ report }) {
  const paths = Array.isArray(report) ? report : [];

  return (
    <div className="space-y-6">
      {paths.map((path, index) => (
        <div key={index} className="neo-card p-6 border-l-4 border-iris-600">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold font-mono text-iris-400 bg-iris-600/10 px-2 py-0.5 border border-iris-600/20">
                Path {index + 1}
              </span>
              <h3 className="text-xl font-black text-white mt-2">{path.title}</h3>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${difficultyColors[path.difficulty] || difficultyColors.beginner}`}>
              {path.difficulty}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <RiTimeLine className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">{path.timeframe}</span>
            </div>
            <div className="flex items-center gap-2">
              <RiMoneyDollarCircleLine className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-bold">{path.salaryRange}</span>
            </div>
          </div>

          {path.skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Key Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {path.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs font-mono bg-brutal-black border border-brutal-border text-gray-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {path.steps?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Action Steps</p>
              <div className="space-y-1.5">
                {path.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <RiArrowRightSLine className="w-4 h-4 text-iris-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
