import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end"
        >
          <div className="flex-1 relative border border-border rounded-2xl bg-secondary/50 focus-within:border-muted-foreground transition-colors">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Rin AI..."
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none bg-transparent px-4 py-3 pr-14',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none',
                'scrollbar-thin',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <Button
                  type="button"
                  onClick={onStop}
                  size="icon"
                  className="h-8 w-8 rounded-lg bg-foreground text-background hover:bg-foreground/90"
                >
                  <Square className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-lg transition-colors',
                    message.trim()
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Rin AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
