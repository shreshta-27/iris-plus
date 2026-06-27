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
    <div className="neo-card p-6">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <RiBookOpenLine className="w-5 h-5 text-iris-400" />
        Generate a Quiz
      </h3>

      <div className="flex gap-2 mb-4">
        {['topic', 'notes'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-xs font-bold uppercase ${mode === m ? 'bg-iris-600 text-white border-2 border-iris-600' : 'bg-brutal-black text-gray-400 border-2 border-brutal-border hover:border-iris-600'}`}
          >
            {m === 'topic' ? 'Enter Topic' : 'Paste Notes'}
          </button>
        ))}
      </div>

      {mode === 'topic' ? (
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g., Photosynthesis, Data Structures, WW2"
          className="input-brutal mb-4"
        />
      ) : (
        <textarea
          value={noteContent}
          onChange={e => setNoteContent(e.target.value)}
          placeholder="Paste your study notes here..."
          rows={6}
          className="input-brutal mb-4 resize-none"
        />
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="input-brutal"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Questions
          </label>
          <select
            value={numQuestions}
            onChange={e => setNumQuestions(Number(e.target.value))}
            className="input-brutal"
          >
            {[3, 5, 7, 10].map(n => (
              <option key={n} value={n}>{n} questions</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RiLoader4Line className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <RiUploadCloud2Line className="w-5 h-5" />
            Generate Quiz
          </>
        )}
      </button>
    </div>
  );
}
