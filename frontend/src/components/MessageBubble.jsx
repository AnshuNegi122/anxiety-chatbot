import { BrainCircuit, User } from 'lucide-react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  const timeLabel = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex items-end gap-2 mb-5 msg-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      {isUser ? (
        /* User avatar */
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <User className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
      ) : (
        /* Bot avatar */
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center flex-shrink-0 shadow-sm">
          <BrainCircuit className="w-4 h-4 text-indigo-500" strokeWidth={1.8} />
        </div>
      )}

      {/* Timestamp + bubble */}
      <div className={`flex items-end gap-2 max-w-[78%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Bubble */}
        {isUser ? (
          <div className="bg-[#5b6af0] text-white px-5 py-3 rounded-3xl rounded-br-md shadow-md shadow-indigo-200/50">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        ) : (
          <div className="bg-white text-gray-700 px-5 py-3 rounded-3xl rounded-bl-md shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        )}

        {/* Timestamp beside bubble */}
        {timeLabel && (
          <span className="flex-shrink-0 text-[11px] text-gray-400 pb-1">{timeLabel}</span>
        )}
      </div>
    </div>
  );
}
