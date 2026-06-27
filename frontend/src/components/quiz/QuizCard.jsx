'use client';
import { useState } from 'react';
import { RiLoader4Line, RiCheckDoubleLine } from 'react-icons/ri';

export default function QuizCard({ quiz, onSubmit, loading }) {
  const [answers, setAnswers] = useState({});

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const isComplete = quiz?.questions?.length === Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {quiz?.questions?.map((question, index) => {
        const selected = answers[question.id];
        
        return (
          <div key={question.id} className="neo-card p-6 hover:border-iris-600 transition-colors">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-xs font-black font-mono text-iris-400 bg-iris-600/10 px-2 py-1 border border-iris-600/20 shrink-0 mt-1">
                Q{index + 1}
              </span>
              <p className="text-sm font-medium text-gray-200 leading-relaxed">{question.question}</p>
            </div>

            <div className="space-y-2">
              {question.options.map((opt, i) => {
                const isSelected = selected === i;
                const style = isSelected
                  ? 'border-iris-600 bg-iris-600/10 text-iris-400'
                  : 'border-brutal-border text-gray-400 hover:border-iris-600 hover:text-white';

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(question.id, i)}
                    className={`w-full text-left px-4 py-3 border-2 text-sm font-medium transition-all ${style}`}
                  >
                    <span className="font-mono font-bold mr-2 text-xs">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <button
        onClick={() => onSubmit(answers)}
        disabled={!isComplete || loading}
        className="btn-primary w-full p-4 flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RiLoader4Line className="w-5 h-5 animate-spin" />
            Submitting Quiz...
          </>
        ) : (
          <>
            <RiCheckDoubleLine className="w-5 h-5" />
            Submit Answers
          </>
        )}
      </button>
    </div>
  );
}
