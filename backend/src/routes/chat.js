/**
 * Chat API Routes
 * Location: backend/src/routes/chat.js
 * 
 * Handles chat messages, conversation management, and AI responses
 */

const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const { ChatMessage, SymptomChecker, User } = require('../models');
const { verifyToken, optionalVerifyToken } = require('../middleware/auth');

/**
 * POST /api/chat/send
 * Send a message and get AI response
 */
router.post('/send', optionalVerifyToken, async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;
    const userId = req.user?.id || 'demo-user';
    const resolvedConversationId = conversationId || new Date().getTime().toString();

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get user profile for personalization
    const user = await User.findById(userId);

    // Get recent message history for context
    let conversationHistory = [];
    if (conversationId) {
      const recentMessages = await ChatMessage.find({
        conversationId,
        userId,
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();

      conversationHistory = recentMessages
        .reverse()
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
    }

    // Get AI response; provide a graceful fallback if upstream AI fails.
    let aiResponse;
    try {
      aiResponse = await AIService.getChatResponse(
        message,
        conversationHistory,
        user?.healthProfile || {}
      );
    } catch (error) {
      aiResponse = {
        message: 'I could not reach the AI service right now. Please try again in a moment.',
        emotion: 'concerned',
      };
    }

    // Save user message
    await ChatMessage.create({
      userId,
      conversationId: resolvedConversationId,
      role: 'user',
      content: message,
      messageType: 'text',
      emotion: 'neutral',
    });

    // Save AI response
    await ChatMessage.create({
      userId,
      conversationId: resolvedConversationId,
      role: 'assistant',
      content: aiResponse.message,
      messageType: 'text',
      emotion: aiResponse.emotion,
    });

    res.json({
      success: true,
      message: aiResponse.message,
      emotion: aiResponse.emotion,
      conversationId: resolvedConversationId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send message',
    });
  }
});

/**
 * POST /api/chat/symptom-check
 * Analyze symptoms with conversational questioning
 */
router.post('/symptom-check', verifyToken, async (req, res) => {
  try {
    const { symptoms, conversationId } = req.body;
    const userId = req.user.id;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Please provide symptoms' });
    }

    const user = await User.findById(userId);

    // Get conversation history if exists
    let history = [];
    if (conversationId) {
      const messages = await ChatMessage.find({
        conversationId,
        userId,
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .exec();

      history = messages
        .reverse()
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
    }

    // Analyze symptoms
    const analysis = await AIService.analyzeSymptoms(
      symptoms,
      history,
      user?.healthProfile || {}
    );

    // Save analysis
    const newConversationId = conversationId || new Date().getTime().toString();
    await SymptomChecker.create({
      userId,
      conversationId: newConversationId,
      symptoms,
      severity: analysis.severity,
      shouldSeekDoctor: analysis.shouldSeekDoctor,
      messages: [
        {
          role: 'assistant',
          content: analysis.message,
          timestamp: new Date(),
        },
      ],
    });

    res.json({
      success: true,
      message: analysis.message,
      isEmergency: analysis.isEmergency,
      severity: analysis.severity,
      shouldSeekDoctor: analysis.shouldSeekDoctor,
      conversationId: newConversationId,
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze symptoms',
    });
  }
});

/**
 * GET /api/chat/history/:conversationId
 * Get conversation history
 */
router.get('/history/:conversationId', verifyToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await ChatMessage.find({
      conversationId,
      userId,
    })
      .sort({ createdAt: 1 })
      .exec();

    res.json({
      success: true,
      conversationId,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/chat/conversation/:conversationId
 * Delete conversation
 */
router.delete('/conversation/:conversationId', verifyToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await ChatMessage.deleteMany({
      conversationId,
      userId,
    });

    res.json({
      success: true,
      message: 'Conversation deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
