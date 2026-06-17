import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 110) + 'px';
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3">
      <div className="flex items-center gap-3">

        {/* Input pill */}
        <div className="flex-1 flex items-center bg-[#f0f2f8] rounded-full px-4 py-2 gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Aa"
            rows={1}
            className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-sm resize-none outline-none leading-6 disabled:opacity-50 disabled:cursor-not-allowed min-h-[24px] max-h-[96px]"
            aria-label="Message input"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={isLoading || !hasText}
            aria-label="Send"
            className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5b6af0] flex items-center justify-center text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-sm shadow-indigo-300/40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

      </div>

      <p className="text-[10px] text-gray-300 text-center mt-2">
        Not a substitute for professional mental health care
      </p>
    </div>
  );
}
