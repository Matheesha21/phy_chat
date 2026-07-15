import React, { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import { MessageBubble } from './MessageBubble'
import { ChatEmptyState } from './ChatEmptyState'
import { ChatInput } from './ChatInput'
import { Sparkles } from 'lucide-react'
export const ChatWindow: React.FC = () => {
  const { messages, isLoading, isHistoryLoading } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isLoading])
  const isEmpty = !isHistoryLoading && messages.length === 0 && !isLoading
  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-6 lg:px-12">
        {isEmpty && <ChatEmptyState />}

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

      <ChatInput />
    </div>
  )
}
