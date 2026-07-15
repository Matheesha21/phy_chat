import React, { useState } from 'react'
import { Mic, MicOff, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useChat } from '../../context/ChatContext'
import { useSpeechToText } from '../../hooks/useSpeechToText'
import { cn } from '../Layout/Sidebar'
export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('')
  const { sendMessage, isLoading } = useChat()

  const { isListening, isSupported, toggleListening } = useSpeechToText({
    onResult: (transcript) => setInput((prev) => (prev ? `${prev} ${transcript}` : transcript)),
    onError: (message) => toast.error(message),
  })

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : 'Ask about physics concepts, formulas, or problem solving...'}
          disabled={isLoading}
          autoComplete="off"
          className={cn(
            'w-full pl-4 py-3.5 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm disabled:opacity-50',
            isSupported ? 'pr-20' : 'pr-12'
          )}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              className={cn(
                'p-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50',
                isListening
                  ? 'bg-destructive/10 text-destructive animate-pulse'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
