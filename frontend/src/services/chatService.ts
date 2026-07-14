import { httpClient } from './httpClient'

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface ChatMessageEntry {
  id: number
  role: 'user' | 'assistant'
  message: string
  created_at: string
}

interface ChatResponse {
  reply: string
}

const toChatMessage = (entry: ChatMessageEntry): ChatMessage => ({
  id: String(entry.id),
  text: entry.message,
  sender: entry.role === 'user' ? 'user' : 'ai',
  timestamp: new Date(entry.created_at),
})

export const chatService = {
  getHistory: async (): Promise<ChatMessage[]> => {
    const entries = await httpClient.get<ChatMessageEntry[]>('/chat/history')
    return entries.map(toChatMessage)
  },

  sendMessage: async (message: string): Promise<ChatMessage> => {
    const { reply } = await httpClient.post<ChatResponse>('/chat/', { message })

    return {
      id: Math.random().toString(36).substring(7),
      text: reply,
      sender: 'ai',
      timestamp: new Date(),
    }
  },

  clearHistory: async (): Promise<void> => {
    await httpClient.del('/chat/history')
  },
}
