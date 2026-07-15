import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChatMessage } from '../../services/chatService';
import { cn } from '../Layout/Sidebar';
import { Bot, User } from 'lucide-react';
interface MessageBubbleProps {
  message: ChatMessage;
}
const markdownComponents = {
  p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  ul: ({ ...props }) => <ul className="mb-2 last:mb-0 list-disc pl-5 space-y-1" {...props} />,
  ol: ({ ...props }) => <ol className="mb-2 last:mb-0 list-decimal pl-5 space-y-1" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  a: ({ ...props }) => (
    <a className="underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  h1: ({ ...props }) => <h1 className="text-base font-bold mb-2 mt-1 first:mt-0" {...props} />,
  h2: ({ ...props }) => <h2 className="text-base font-bold mb-2 mt-1 first:mt-0" {...props} />,
  h3: ({ ...props }) => <h3 className="text-sm font-bold mb-2 mt-1 first:mt-0" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className="border-l-2 border-current/30 pl-3 italic opacity-80 mb-2 last:mb-0" {...props} />
  ),
  pre: ({ ...props }) => (
    <pre className="bg-black/85 text-white rounded-lg p-3 overflow-x-auto mb-2 last:mb-0 text-[13px]" {...props} />
  ),
  code: ({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
    const isBlock = /language-/.test(className || '') || String(children).includes('\n');
    if (isBlock) {
      return (
        <code className={cn('font-mono', className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-black/10" {...props}>
        {children}
      </code>
    );
  },
  table: ({ ...props }) => (
    <div className="overflow-x-auto mb-2 last:mb-0">
      <table className="border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ ...props }) => <th className="border border-current/20 px-2 py-1 text-left font-semibold" {...props} />,
  td: ({ ...props }) => <td className="border border-current/20 px-2 py-1" {...props} />,
};
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
        
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}>
              {message.text}
            </ReactMarkdown>
          </div>
        )}
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