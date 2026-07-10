import { httpClient } from './httpClient';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  reply: string;
}

const toHistoryEntry = (message: ChatMessage): ChatHistoryEntry => ({
  role: message.sender === 'user' ? 'user' : 'assistant',
  content: message.text
});

export const chatService = {
  sendMessage: async (message: string, history: ChatMessage[]): Promise<ChatMessage> => {
    const { reply } = await httpClient.post<ChatResponse>('/chat/', {
      message,
      history: history.map(toHistoryEntry)
    });

    return {
      id: Math.random().toString(36).substring(7),
      text: reply,
      sender: 'ai',
      timestamp: new Date()
    };
  }
};
