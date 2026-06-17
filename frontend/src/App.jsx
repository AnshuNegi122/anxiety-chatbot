import ChatWindow from './components/ChatWindow';
import InsightPanel from './components/InsightPanel';
import useChat from './hooks/useChat';

export default function App() {
  const { messages, insights, isLoading, isAnalyzing, sendMessage } = useChat();

  return (
    /* Outer shell — soft gradient background matching the image */
    <div className="h-screen bg-gradient-to-br from-[#eef0f8] to-[#e8ecf7] flex items-center justify-center p-4 lg:p-8">

      {/* App card — phone-like on small screens, wide on desktop */}
      <div className="w-full max-w-5xl h-full max-h-[860px] bg-white rounded-3xl shadow-2xl shadow-indigo-200/60 overflow-hidden flex flex-col lg:flex-row">

        {/* ── Left: Chat ──────────────────────────────────── */}
        <div className="flex flex-col flex-1 lg:w-[58%] min-h-0 border-r border-gray-100">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            sendMessage={sendMessage}
          />
        </div>

        {/* ── Right: Insights ─────────────────────────────── */}
        <div className="flex flex-col lg:w-[42%] min-h-0 bg-[#f7f8fc]">
          <InsightPanel insights={insights} isAnalyzing={isAnalyzing} />
        </div>

      </div>
    </div>
  );
}
