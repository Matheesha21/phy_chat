import React, { useState, createContext, useContext, ReactNode } from 'react'
import { ChatMessage, chatService } from '../services/chatService'
import { ApiError } from '../services/httpClient'
import { toast } from 'sonner'
interface ChatContextType {
  messages: ChatMessage[]
  isLoading: boolean
  sendMessage: (text: string) => Promise<void>
}
const ChatContext = createContext<ChatContextType | undefined>(undefined)
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      text: 'Hello! I am the USJ Physics AI Assistant. Ask me about concepts, formulas, or problem solving.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text,
      sender: 'user',
      timestamp: new Date(),
    }
    const history = messages
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)
    try {
      const aiReply = await chatService.sendMessage(text, history)
      setMessages((prev) => [...prev, aiReply])
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to connect to the AI service. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
