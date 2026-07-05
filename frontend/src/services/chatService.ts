import { apiClient } from './api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const chatService = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    const lowerMsg = message.toLowerCase();
    let reply =
    'I couldn’t find that in the Physics Department database. Please contact the department office for more specific inquiries.';

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      reply =
      'Hello! I am the USJ Physics Department AI Assistant. How can I help you with lectures, lecturers, or physics concepts today?';
    } else if (lowerMsg.includes('lecture') && lowerMsg.includes('today')) {
      reply =
      "Today's scheduled lectures are:\n- Quantum Mechanics (PHY301) at 09:00 AM in Hall A\n- Thermodynamics (PHY202) at 11:00 AM in Hall B";
    } else if (lowerMsg.includes('formula') || lowerMsg.includes('newton')) {
      reply =
      "Newton's Second Law of Motion is expressed as F = ma, where F is the net force applied to an object, m is its mass, and a is its acceleration.";
    } else if (lowerMsg.includes('dr. perera') || lowerMsg.includes('perera')) {
      reply =
      'Dr. N. Perera is a Senior Lecturer in Quantum Physics. His office hours are Tuesday & Thursday, 10:00 AM - 12:00 PM in Room 402.';
    }

    return apiClient.post(
      '/api/chat',
      { message },
      {
        id: Math.random().toString(36).substring(7),
        text: reply,
        sender: 'ai',
        timestamp: new Date()
      }
    );
  }
};