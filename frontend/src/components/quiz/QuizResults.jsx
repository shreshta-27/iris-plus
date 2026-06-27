'use client';
import { RiTrophyLine, RiEmotionSadLine, RiEmotionLine } from 'react-icons/ri';

export default function QuizResults({ results, feedback }) {
  if (!results) return null;

  const { score, total, percentage } = results;
  const icon = percentage >= 70 ? RiTrophyLine : percentage >= 40 ? RiEmotionLine : RiEmotionSadLine;
  const IconComp = icon;
  const color = percentage >= 70 ? 'text-emerald-400' : percentage >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="neo-card p-6 border-t-4 border-iris-600">
      <div className="text-center mb-6">
        <IconComp className={`w-12 h-12 mx-auto mb-3 ${color}`} />
        <h3 className="text-3xl font-black text-white">{score}/{total}</h3>
        <p className={`text-lg font-bold ${color}`}>{percentage}%</p>
        <p className="text-sm text-gray-400 mt-1">
          {percentage >= 70 ? 'Excellent work!' : percentage >= 40 ? 'Good effort, keep studying!' : 'Keep practicing!'}
        </p>
      </div>

      {feedback && (
        <div className="bg-brutal-black border border-brutal-border p-4 mt-4">
          <p className="text-xs font-bold text-iris-400 uppercase tracking-widest mb-2">
            AI Study Tips
          </p>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{feedback}</p>
        </div>
      )}
    </div>
  );
}
