const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fast, capable model available on Groq's free tier
const CHAT_MODEL = 'llama-3.3-70b-versatile';
const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';

/**
 * Get a chat response from the AI assistant.
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @param {string|null} anxietyLevel - Current anxiety level: 'low' | 'moderate' | 'high' | null
 * @returns {Promise<string>} - The assistant's reply
 */
async function getChatResponse(messages, anxietyLevel = null) {
  const doctorNote =
    anxietyLevel === 'high'
      ? " The user has been showing signs of HIGH anxiety. Gently and naturally recommend they consider speaking with a mental health professional or doctor — weave it in warmly, not abruptly."
      : anxietyLevel === 'moderate'
      ? " The user has been showing moderate signs of anxiety. If the moment feels right, gently suggest that talking to a professional could be helpful — do it naturally, not forcefully."
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

/**
 * Analyze the user's mental state based on conversation history.
 * @param {Array<{role: string, content: string}>} conversationHistory - Full conversation history
 * @returns {Promise<Object>} - Mental state analysis as a JSON object
 */
async function analyzeUserMentalState(conversationHistory) {
  const userMessages = conversationHistory
    .filter((msg) => msg.role === 'user')
    .map((msg) => msg.content)
    .join('\n---\n');

  const systemPrompt = `You are a mental health analysis assistant. Analyze ONLY the user messages provided and return a JSON object with the following exact shape. Return valid JSON and nothing else — no markdown, no explanation, no code fences.

{
  "anxietyLevel": "low|moderate|high",
  "anxietyScore": 0-100,
  "mood": "one of: happy|sad|anxious|neutral|frustrated|hopeful|overwhelmed|calm",
  "moodIntensity": 0-100,
  "behaviorPattern": "one of: expressive|withdrawn|avoidant|engaged|agitated|reflective",
  "summary": "2-3 sentence summary of the user's mental state based on the conversation",
  "confidence": 0-100
}

Rules:
- anxietyScore is a numeric value 0-100 (0 = no anxiety, 100 = extreme anxiety)
- moodIntensity is a numeric value 0-100 reflecting how strongly the mood is expressed
- confidence is a numeric value 0-100 reflecting how confident you are in the analysis given the available data
- Return ONLY the JSON object, no other text`;

  const response = await groq.chat.completions.create({
    model: ANALYSIS_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Here are the user messages from the conversation:\n\n${userMessages}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 512,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content;
  return JSON.parse(raw);
}

module.exports = { getChatResponse, analyzeUserMentalState };
