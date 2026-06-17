const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CHAT_MODEL = 'llama-3.3-70b-versatile';

async function getChatResponse(messages, anxietyLevel = null) {
  const doctorNote =
    anxietyLevel === 'high'
      ? ' The user has been showing signs of HIGH anxiety. Gently and naturally recommend they consider speaking with a mental health professional or doctor — weave it in warmly, not abruptly.'
      : anxietyLevel === 'moderate'
      ? ' The user has been showing moderate signs of anxiety. If the moment feels right, gently suggest that talking to a professional could be helpful — do it naturally, not forcefully.'
      : '';

  const systemMessage = {
    role: 'system',
    content:
      "You are a warm, friendly companion — like a caring best friend who genuinely wants to know how you're doing. Chat naturally and casually, use everyday language, show enthusiasm and empathy, and make the user feel heard and comfortable. Ask follow-up questions to keep the conversation going. Be uplifting and supportive without being fake or over the top. Never give medical advice." +
      doctorNote,
  };

  const response = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_tokens: 512,
  });

  return response.choices[0].message.content;
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, sessionId, anxietyLevel } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const reply = await getChatResponse(messages, anxietyLevel || null);
    return res.json({ reply, sessionId: sessionId || null });
  } catch (error) {
    console.error('Error in /api/chat/message:', error);
    return res.status(500).json({ error: error.message || 'Failed to get chat response' });
  }
};
