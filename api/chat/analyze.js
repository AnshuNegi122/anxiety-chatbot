const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';

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
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const userMessageCount = messages.filter((m) => m.role === 'user').length;
    if (userMessageCount < 3) {
      return res.json({ insights: null });
    }

    const insights = await analyzeUserMentalState(messages);
    return res.json({ insights });
  } catch (error) {
    console.error('Error in /api/chat/analyze:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze mental state' });
  }
};
