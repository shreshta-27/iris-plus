'use client';
import { useState } from 'react';
import { RiLoader4Line, RiCheckDoubleLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function QuizCard({ quiz, onSubmit, loading }) {
  const [answers, setAnswers] = useState({});

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const isComplete = quiz?.questions?.length === Object.keys(answers).length;
  const progress = quiz?.questions?.length ? (Object.keys(answers).length / quiz.questions.length) * 100 : 0;

  return (
    <div className="space-y-8 pb-10">
      
      <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm p-4 border-b-3 border-ink shadow-[0_4px_0_#1A1A2E] flex justify-between items-center mb-8">
        <h2 className="font-black text-xl text-ink">Quiz in Progress</h2>
        <div className="flex items-center gap-3">
          <span className="font-bold text-ink">{Object.keys(answers).length} / {quiz?.questions?.length}</span>
          <div className="w-32 h-4 bg-white border-2 border-ink shadow-[2px_2px_0_#1A1A2E] overflow-hidden">
            <div className="h-full bg-sunny transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      {quiz?.questions?.map((question, index) => {
        const selected = answers[question.id];
        
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={question.id} 
            className="neo-card card-left-purple p-6 md:p-8 bg-white relative"
          >
            {/* Question Badge */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-iris-purple border-3 border-ink shadow-[2px_2px_0_#1A1A2E] flex items-center justify-center rotate-[-5deg]">
              <span className="font-black text-white text-xl">Q{index + 1}</span>
            </div>

            <div className="pl-6 mb-8 mt-2">
              <p className="text-xl font-bold text-ink leading-relaxed">{question.question}</p>
            </div>

            <div className="space-y-4">
              {question.options.map((opt, i) => {
                const isSelected = selected === i;
                const style = isSelected
                  ? 'border-ink bg-mint shadow-[4px_4px_0_#1A1A2E] translate-x-1 translate-y-1'
                  : 'border-ink bg-cream hover:bg-white hover:shadow-[4px_4px_0_#1A1A2E] shadow-[2px_2px_0_rgba(26,26,46,0.3)]';

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(question.id, i)}
                    className={`w-full text-left px-5 py-4 border-3 transition-all flex items-start gap-4 ${style}`}
                  >
                    <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 border-ink font-black text-sm ${isSelected ? 'bg-white text-ink' : 'bg-ink text-white'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-medium text-ink pt-1 text-base">{opt}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      <div className="pt-4">
        <button
          onClick={() => onSubmit(answers)}
          disabled={!isComplete || loading}
          className="btn-primary w-full p-6 flex items-center justify-center gap-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-iris-purple"
        >
          {loading ? (
            <>
              <RiLoader4Line className="w-8 h-8 animate-spin" />
              Grading Quiz...
            </>
          ) : (
            <>
              <RiCheckDoubleLine className="w-8 h-8" />
              Submit Answers
            </>
          )}
        </button>
        {!isComplete && (
          <p className="text-center font-bold text-coral mt-4 font-caveat text-xl">
            Answer all questions to submit!
          </p>
        )}
      </div>
    </div>
  );
}
