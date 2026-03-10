import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isLoading, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  return (
    <div className="p-3 pb-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="border border-border rounded-xl bg-secondary/40 focus-within:border-muted-foreground/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Rin AI..."
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none bg-transparent px-4 py-3 pr-12 text-sm',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none scrollbar-thin',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="h-7 w-7 rounded-md bg-foreground text-background flex items-center justify-center hover:bg-foreground/90 transition-colors"
                >
                  <Square className="h-3 w-3" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  className={cn(
                    'h-7 w-7 rounded-md flex items-center justify-center transition-colors',
                    message.trim()
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
        <p className="text-center text-[11px] text-muted-foreground mt-2">
          Rin AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
