'use client';
import { RiTrophyLine, RiEmotionSadLine, RiEmotionLine, RiRefreshLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function QuizResults({ results, onRetry }) {
  if (!results) return null;

  const { score, total, percentage, feedback } = results;
  
  const getTheme = () => {
    if (percentage >= 80) return { color: 'mint', icon: RiTrophyLine, msg: 'Excellent Work!' };
    if (percentage >= 50) return { color: 'sunny', icon: RiEmotionLine, msg: 'Good Effort!' };
    return { color: 'coral', icon: RiEmotionSadLine, msg: 'Keep Studying!' };
  };

  const theme = getTheme();
  const IconComp = theme.icon;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`neo-card p-10 md:p-14 bg-white border-t-[16px] border-t-${theme.color} relative text-center`}
    >
      {/* Decorative badge */}
      <div className="absolute -top-10 -right-6 md:-right-10 rotate-12">
        <div className={`w-32 h-32 bg-${theme.color} rounded-full border-[6px] border-ink flex items-center justify-center shadow-[8px_8px_0_#1A1A2E] animate-wiggle`}>
          <span className="font-black text-ink text-4xl">{percentage}%</span>
        </div>
      </div>

      <div className="mb-10 mt-6">
        <div className={`w-24 h-24 rounded-full bg-${theme.color} border-[4px] border-ink flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0_#1A1A2E]`}>
          <IconComp className="w-12 h-12 text-ink" />
        </div>
        
        <h3 className="text-7xl font-black text-ink mb-4">{score}<span className="text-4xl text-ink/40">/{total}</span></h3>
        <p className="text-4xl font-caveat font-bold text-ink/80 mt-6">{theme.msg}</p>
      </div>

      {feedback && (
        <div className="bg-cream rounded-3xl border-[4px] border-ink p-8 mb-10 relative text-left shadow-[6px_6px_0_#1A1A2E] mt-12">
          <div className="absolute -top-6 left-8 bg-iris-purple px-5 py-2 rounded-full border-[3px] border-ink text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_#1A1A2E]">
            AI Study Feedback
          </div>
          <p className="text-xl font-bold text-ink leading-relaxed whitespace-pre-wrap mt-4">
            {feedback}
          </p>
        </div>
      )}

      <button
        onClick={onRetry}
        className="btn-outline w-full justify-center text-2xl py-6 flex items-center gap-3 bg-cream hover:bg-iris-purple hover:text-white"
      >
        <RiRefreshLine className="w-8 h-8" />
        Create Another Quiz
      </button>
    </motion.div>
  );
}
