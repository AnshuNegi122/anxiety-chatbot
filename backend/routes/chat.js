const express = require('express');
const router = express.Router();
const { getChatResponse, analyzeUserMentalState } = require('../services/openai');

/**
 * POST /api/chat/message
 * Get an AI response for the current conversation.
 * Body: { messages: [{role, content}], sessionId: string }
 */
router.post('/message', async (req, res) => {
  try {
    const { messages, sessionId, anxietyLevel } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const reply = await getChatResponse(messages, anxietyLevel || null);

    return res.json({ reply, sessionId: sessionId || null });
  } catch (error) {
    console.error('Error in POST /api/chat/message:', error);
    return res.status(500).json({ error: error.message || 'Failed to get chat response' });
  }
});

/**
 * POST /api/chat/analyze
 * Analyze the user's mental state from conversation history.
 * Body: { messages: [{role, content}] }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Only analyze if there are at least 3 user messages
    const userMessageCount = messages.filter((m) => m.role === 'user').length;
    if (userMessageCount < 3) {
      return res.json({ insights: null });
    }

    const insights = await analyzeUserMentalState(messages);

    return res.json({ insights });
  } catch (error) {
    console.error('Error in POST /api/chat/analyze:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze mental state' });
  }
});

module.exports = router;
