import React from 'react';
import { ChatMessage } from '../../services/chatService';
import { cn } from '../Layout/Sidebar';
import { Bot, User } from 'lucide-react';
interface MessageBubbleProps {
  message: ChatMessage;
}
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div
      className={cn(
        'flex w-full gap-4 mb-6',
        isUser ? 'justify-end' : 'justify-start'
      )}>
      
      {!isUser &&
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      }

      <div
        className={cn(
          'max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm',
          isUser ?
          'bg-primary text-primary-foreground rounded-br-sm' :
          'bg-card border border-border text-foreground rounded-bl-sm'
        )}>
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        <span
          className={cn(
            'text-[10px] block mt-2',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}>
          
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {isUser &&
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      }
    </div>);

};