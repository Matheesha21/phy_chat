import React from 'react'
import { ChatWindow } from '../components/Chat/ChatWindow'
export const ChatPage: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground">
          AI Physics Assistant
        </h2>
        <p className="text-sm text-muted-foreground">
          Get clear explanations, formulas, and study support for physics.
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  )
}
