const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

const router = express.Router();

// In-memory fallback cache when MongoDB is connecting or unavailable
let memoryChats = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * GET /api/chats
 * List all chats with title and timestamp, sorted newest first
 */
router.get('/chats', async (req, res) => {
  try {
    if (isDbConnected()) {
      const chats = await Chat.find()
        .select('title createdAt')
        .sort({ createdAt: -1 });
      return res.json(chats);
    }
    // Fallback if MongoDB is offline
    const list = memoryChats
      .map((c) => ({ _id: c._id, title: c.title, createdAt: c.createdAt }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to retrieve chats' });
  }
});

/**
 * GET /api/chats/:id
 * Retrieve a single chat with all its messages
 */
router.get('/chats/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const chat = await Chat.findById(req.params.id);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      return res.json(chat);
    }

    // Fallback
    const chat = memoryChats.find((c) => String(c._id) === req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to retrieve chat' });
  }
});

/**
 * POST /api/chat
 * Send a user message, call Google Gemini API (or fallback if key not configured), save both messages
 */
router.post('/chat', async (req, res) => {
  const { message, chatId } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    let chat = null;

    if (isDbConnected()) {
      if (chatId) {
        chat = await Chat.findById(chatId);
      }
      if (!chat) {
        const cleanTitle = message.trim();
        const title = cleanTitle.length > 40 ? cleanTitle.slice(0, 40) + '...' : cleanTitle;
        chat = new Chat({
          title,
          messages: []
        });
      }
    } else {
      if (chatId) {
        chat = memoryChats.find((c) => String(c._id) === chatId);
      }
      if (!chat) {
        const cleanTitle = message.trim();
        const title = cleanTitle.length > 40 ? cleanTitle.slice(0, 40) + '...' : cleanTitle;
        chat = {
          _id: new mongoose.Types.ObjectId().toString(),
          title,
          messages: [],
          createdAt: new Date()
        };
        memoryChats.push(chat);
      }
    }

    // Build chat history for Gemini API
    const history = chat.messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    let replyContent = '';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
      // Call Google Gemini API
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
      const model = genAI.getGenerativeModel({ model: modelName });

      const chatSession = model.startChat({ history });
      const result = await chatSession.sendMessage(message.trim());
      replyContent = result.response.text();
    } else {
      // Helpful interactive response when GEMINI_API_KEY is not yet added to server/.env
      const promptLower = message.trim().toLowerCase();
      if (promptLower.includes('hello') || promptLower.includes('hi')) {
        replyContent = "Hello! I am Nebula, your modern AI chatbot. Everything is up and running smoothly! To connect directly with Google's live Gemini LLM, remember to add your free GEMINI_API_KEY in server/.env.";
      } else if (promptLower.includes('who are you') || promptLower.includes('what are you')) {
        replyContent = "I am Nebula, a ChatGPT/Claude-style AI chatbot built with the MERN stack (MongoDB, Express, React, Node.js) and styled with refined dark aesthetics.";
      } else {
        replyContent = `Thank you for your message! Nebula is currently running in local demonstration mode. Once you add your free GEMINI_API_KEY into server/.env, I will connect directly to Google's live Gemini LLM.\n\nYour message was: "${message.trim()}"`;
      }
    }

    // Append user & model messages
    if (isDbConnected()) {
      chat.messages.push({ role: 'user', content: message.trim() });
      chat.messages.push({ role: 'model', content: replyContent });
      await chat.save();
    } else {
      chat.messages.push({ role: 'user', content: message.trim() });
      chat.messages.push({ role: 'model', content: replyContent });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error in chat generation:', error);
    const errorMsg = error?.message || 'Error communicating with AI service';
    res.status(500).json({ error: errorMsg });
  }
});

/**
 * DELETE /api/chats/:id
 * Delete a chat session and all its messages
 */
router.delete('/chats/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const chat = await Chat.findByIdAndDelete(req.params.id);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      return res.json({ message: 'Chat deleted successfully', id: req.params.id });
    }

    // Fallback
    const initialLen = memoryChats.length;
    memoryChats = memoryChats.filter((c) => String(c._id) !== req.params.id);
    if (memoryChats.length === initialLen) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json({ message: 'Chat deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;
