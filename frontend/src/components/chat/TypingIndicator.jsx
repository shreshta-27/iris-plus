'use client';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 p-4 animate-fade-in">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-brutal-border text-iris-400 text-sm font-bold">
        ✦
      </div>
      <div className="flex items-center gap-1 pt-2">
        <span className="w-2 h-2 bg-iris-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-iris-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-iris-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-xs text-gray-500 ml-2 font-mono">IRIS is thinking...</span>
      </div>
    </div>
  );
}
