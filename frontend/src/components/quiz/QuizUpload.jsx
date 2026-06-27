'use client';
import { useState } from 'react';
import { RiUploadCloud2Line, RiLoader4Line, RiBookOpenLine } from 'react-icons/ri';

export default function QuizUpload({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [mode, setMode] = useState('topic');

  const handleSubmit = () => {
    if (mode === 'topic' && !topic.trim()) return;
    if (mode === 'notes' && !noteContent.trim()) return;

    onGenerate({
      topic: mode === 'topic' ? topic : '',
      noteContent: mode === 'notes' ? noteContent : '',
      difficulty,
      numQuestions,
    });
  };

  return (
    <div className="neo-card card-sunny p-6 md:p-8 bg-white">
      <h3 className="text-2xl font-black text-ink mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-sunny border-2 border-ink flex items-center justify-center shadow-[2px_2px_0_#1A1A2E]">
          <RiBookOpenLine className="w-5 h-5 text-ink" />
        </div>
        Configure Quiz
      </h3>

      <div className="flex gap-3 mb-6 bg-cream p-2 border-3 border-ink inline-flex shadow-[inset_2px_2px_0_rgba(0,0,0,0.05)]">
        {['topic', 'notes'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 font-bold uppercase tracking-widest text-sm transition-all border-2 ${
              mode === m 
                ? 'bg-ink text-cream border-ink shadow-[2px_2px_0_#FFD93D]' 
                : 'bg-transparent border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            {m === 'topic' ? 'Topic' : 'Notes'}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black text-ink uppercase tracking-widest mb-2">
          {mode === 'topic' ? 'Subject / Topic' : 'Study Notes Content'}
        </label>
        {mode === 'topic' ? (
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, Data Structures, WW2..."
            className="input-brutal text-lg p-4"
          />
        ) : (
          <textarea
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            placeholder="Paste your study notes here..."
            rows={6}
            className="input-brutal text-base p-4 resize-none"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xs font-black text-ink uppercase tracking-widest mb-2">
            Difficulty Level
          </label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="input-brutal text-lg p-4 appearance-none cursor-pointer pr-10"
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none border-l-3 border-ink bg-cream">
              <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-black text-ink uppercase tracking-widest mb-2">
            Number of Questions
          </label>
          <div className="relative">
            <select
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
              className="input-brutal text-lg p-4 appearance-none cursor-pointer pr-10"
            >
              {[3, 5, 7, 10].map(n => (
                <option key={n} value={n}>{n} Questions</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none border-l-3 border-ink bg-cream">
              <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-3 text-xl py-4 bg-iris-purple hover:bg-iris-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <RiLoader4Line className="w-6 h-6 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            <RiUploadCloud2Line className="w-6 h-6" />
            Generate Quiz Now
          </>
        )}
      </button>
    </div>
  );
}
