import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('')
  const { sendMessage, isLoading } = useChat()
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <div className="p-4 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about physics concepts, formulas, or problem solving..."
          disabled={isLoading}
          className="w-full pl-4 pr-12 py-3.5 bg-secondary border-transparent rounded-xl focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
