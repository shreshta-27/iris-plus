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
      className={`neo-card p-8 md:p-12 bg-white card-${theme.color} relative text-center`}
    >
      {/* Decorative badge */}
      <div className="absolute -top-6 -right-6 rotate-12">
        <div className={`w-24 h-24 bg-${theme.color} rounded-full border-4 border-ink flex items-center justify-center shadow-[4px_4px_0_#1A1A2E]`}>
          <span className="font-black text-ink text-2xl">{percentage}%</span>
        </div>
      </div>

      <div className="mb-8">
        <div className={`w-20 h-20 bg-${theme.color} border-4 border-ink flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_#1A1A2E]`}>
          <IconComp className="w-10 h-10 text-ink" />
        </div>
        
        <h3 className="text-6xl font-black text-ink mb-2">{score}<span className="text-3xl text-ink/40">/{total}</span></h3>
        <p className="text-3xl font-caveat font-bold text-ink/80 mt-4">{theme.msg}</p>
      </div>

      {feedback && (
        <div className="bg-cream border-3 border-ink p-6 mb-8 relative text-left shadow-[4px_4px_0_#1A1A2E]">
          <div className="absolute -top-4 left-6 bg-iris-purple px-4 py-1 border-2 border-ink text-white font-black text-sm uppercase tracking-widest">
            AI Study Feedback
          </div>
          <p className="text-lg font-medium text-ink leading-relaxed whitespace-pre-wrap mt-2">
            {feedback}
          </p>
        </div>
      )}

      <button
        onClick={onRetry}
        className="btn-outline w-full justify-center text-xl py-4 flex items-center gap-2 bg-cream hover:bg-iris-purple hover:text-white"
      >
        <RiRefreshLine className="w-6 h-6" />
        Create Another Quiz
      </button>
    </motion.div>
  );
}
