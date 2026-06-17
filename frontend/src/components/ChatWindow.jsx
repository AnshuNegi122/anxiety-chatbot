import { useEffect, useRef } from 'react';
import { BrainCircuit, Wifi } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatWindow({ messages, isLoading, sendMessage }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 bg-[#5b6af0]">
        <div>
          <h1 className="text-white font-bold text-xl leading-tight tracking-tight">MindChat</h1>
          <p className="text-indigo-200 text-xs font-medium mt-0.5">Your friendly companion</p>
        </div>

        {/* Avatar with online dot */}
        <div className="relative flex-shrink-0">
          <div className="w-11 h-11 rounded-full bg-indigo-400/40 border-2 border-white/40 flex items-center justify-center shadow-md">
            <BrainCircuit className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>
          <span className="online-dot absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
        </div>
      </div>

      {/* ── Messages ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-5 bg-[#f5f6fb] min-h-0">

        {/* Date chip */}
        <div className="flex justify-center mb-5">
          <span className="text-[11px] text-gray-400 bg-white rounded-full px-3 py-1 shadow-sm font-medium">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-end gap-2 mb-4 msg-in">
            <BotAvatar />
            <div className="bg-white rounded-3xl rounded-bl-lg px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ───────────────────────────────────────── */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

/* Shared bot avatar used in typing indicator */
export function BotAvatar({ size = 'sm' }) {
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0 shadow-sm">
      <BrainCircuit className="w-4 h-4 text-indigo-500" strokeWidth={1.8} />
    </div>
  );
}
