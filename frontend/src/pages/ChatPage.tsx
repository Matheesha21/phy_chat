import React from 'react'
import { Trash2 } from 'lucide-react'
import { ChatWindow } from '../components/Chat/ChatWindow'
import { useChat } from '../context/ChatContext'
export const ChatPage: React.FC = () => {
  const { clearChat, messages } = useChat()
  const isChatEmpty = messages.length === 0
  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            AI Physics Assistant
          </h2>
          <p className="text-sm text-muted-foreground">
            Get clear explanations, formulas, and study support for physics.
          </p>
        </div>
        <button
          onClick={clearChat}
          disabled={isChatEmpty}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive border border-border rounded-lg hover:border-destructive/50 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-muted-foreground disabled:hover:border-border"
        >
          <Trash2 className="w-4 h-4" />
          Clear chat
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  )
}
