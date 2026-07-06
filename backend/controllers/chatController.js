
import { generateChatReply } from '../services/geminiService.js';

// POST /api/chat  — mirrors chatService.sendMessage() on the frontend.
export async function postChat(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A "message" string is required.' });
    }

    const text = await generateChatReply(message.trim());

    res.json({
      id: Date.now().toString(36),
      text,
      sender: 'ai',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
}