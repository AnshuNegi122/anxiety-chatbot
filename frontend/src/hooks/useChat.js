import { useState, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// In production on Vercel the API is on the same domain (/api/...).
// Set VITE_API_BASE_URL in your Vercel env vars only if you host the
// backend separately.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Hey! 👋 So glad you're here. I'm your friendly companion — always up for a good chat. How's your day going? Tell me everything! 😊",
  timestamp: new Date().toISOString(),
};

export default function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionId] = useState(() => uuidv4());

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const userMessage = {
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      // Build updated messages array with the new user message
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        // Strip timestamps before sending to API — API only needs role + content
        const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

        // Get chat response
        const chatRes = await axios.post(`${API_BASE}/api/chat/message`, {
          messages: apiMessages,
          sessionId,
          anxietyLevel: insights?.anxietyLevel || null,
        });

        const assistantMessage = {
          role: 'assistant',
          content: chatRes.data.reply,
          timestamp: new Date().toISOString(),
        };

        const allMessages = [...updatedMessages, assistantMessage];
        setMessages(allMessages);
        setIsLoading(false);

        // Analyze if at least 3 user messages have been sent
        const userMessageCount = allMessages.filter((m) => m.role === 'user').length;
        if (userMessageCount >= 3) {
          setIsAnalyzing(true);
          try {
            const analyzeRes = await axios.post(`${API_BASE}/api/chat/analyze`, {
              messages: allMessages.map(({ role, content }) => ({ role, content })),
            });
            if (analyzeRes.data.insights) {
              setInsights(analyzeRes.data.insights);
            }
          } catch (err) {
            console.error('Analysis error:', err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      } catch (err) {
        console.error('Chat error:', err);
        setIsLoading(false);
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm sorry, I ran into an issue. Please try again in a moment.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [messages, sessionId]
  );

  return { messages, insights, isLoading, isAnalyzing, sendMessage };
}
