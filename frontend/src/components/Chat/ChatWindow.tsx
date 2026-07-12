import React, { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { Sparkles } from 'lucide-react'
export const ChatWindow: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isLoading])
  const quickActions = [
    "Explain Newton's laws",
    'Physics formulas',
    'How does a capacitor work?',
    'Study tips for electricity',
  ]
  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-background">
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex w-full gap-4 mb-6 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-1">
              <div
                className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                style={{
                  animationDelay: '0ms',
                }}
              />
              <div
                className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                style={{
                  animationDelay: '150ms',
                }}
              />
              <div
                className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                style={{
                  animationDelay: '300ms',
                }}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-4 max-w-4xl mx-auto w-full">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            Suggested Queries
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      <ChatInput />
    </div>
  )
}
