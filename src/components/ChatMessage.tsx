import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 py-6 px-4 md:px-8 message-fade-in',
        isUser ? 'bg-user-message' : 'bg-assistant-message'
      )}
    >
      <div
        className={cn(
          'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isUser
            ? 'bg-primary/20 text-primary'
            : 'bg-gradient-to-br from-primary to-cyan-500'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {isUser ? 'You' : 'RinX AI'}
        </p>
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">
            {message.content}
            {isLatest && !isUser && (
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-4 py-6 px-4 md:px-8 bg-assistant-message message-fade-in">
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-cyan-500">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">RinX AI</p>
        <div className="typing-indicator flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
