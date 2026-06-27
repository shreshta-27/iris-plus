'use client';
import { RiArrowRightSLine, RiTimeLine, RiMoneyDollarCircleLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const getDifficultyTheme = (diff) => {
  const d = diff?.toLowerCase() || '';
  if (d.includes('beginner')) return { color: 'mint', label: 'Beginner' };
  if (d.includes('advanced')) return { color: 'coral', label: 'Advanced' };
  return { color: 'sunny', label: 'Intermediate' }; // default/intermediate
};

export default function CareerPath({ report }) {
  const paths = Array.isArray(report) ? report : [];

  return (
    <div className="space-y-8">
      {paths.map((path, index) => {
        const theme = getDifficultyTheme(path.difficulty);
        const cardColors = ['peach', 'sky', 'iris-purple'];
        const cardAccent = cardColors[index % cardColors.length];

        return (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            key={index} 
            className={`neo-card bg-white p-6 md:p-8 card-left-${cardAccent} relative`}
          >
            {/* Path Number Badge */}
            <div className={`absolute -top-4 -right-4 w-12 h-12 bg-${cardAccent} border-3 border-ink flex items-center justify-center shadow-[4px_4px_0_#1A1A2E] rotate-6`}>
              <span className="font-black text-ink text-xl">#{index + 1}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pr-8">
              <div>
                <h3 className="text-2xl font-black text-ink leading-tight mb-2">{path.title}</h3>
                <span className={`tag-sticker bg-${theme.color} text-ink border-2 shadow-[2px_2px_0_#1A1A2E]`}>
                  {theme.label}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 bg-cream p-4 border-3 border-ink shadow-[inset_2px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-ink">
                <RiTimeLine className="w-5 h-5 text-ink" />
                <span className="text-base font-bold text-ink">{path.timeframe}</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 border-2 border-ink">
                <RiMoneyDollarCircleLine className="w-5 h-5 text-mint" />
                <span className="text-base font-black text-ink">{path.salaryRange}</span>
              </div>
            </div>

            {path.skills?.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-black text-ink uppercase tracking-widest mb-3 border-b-2 border-ink/10 pb-1">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 text-sm font-bold bg-white border-2 border-ink text-ink shadow-[2px_2px_0_#1A1A2E] hover:-translate-y-1 hover:shadow-[4px_4px_0_#1A1A2E] transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {path.steps?.length > 0 && (
              <div className="bg-white border-3 border-ink p-6 shadow-[4px_4px_0_#1A1A2E]">
                <p className="text-sm font-black text-ink uppercase tracking-widest mb-4">Action Plan</p>
                <div className="space-y-4">
                  {path.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 flex-shrink-0 mt-0.5 rounded-full bg-${cardAccent} border-2 border-ink flex items-center justify-center font-bold text-ink text-xs`}>
                        {i + 1}
                      </div>
                      <span className="text-base font-medium text-ink pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
