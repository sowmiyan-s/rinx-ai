import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
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
    <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex items-end gap-3"
      >
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message RinX AI..."
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-2xl border border-border bg-secondary/50 px-4 py-3 pr-12',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
              'transition-all duration-200',
              'scrollbar-thin',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />
        </div>

        {isLoading ? (
          <Button
            type="button"
            onClick={onStop}
            size="icon"
            className="h-11 w-11 rounded-xl bg-destructive hover:bg-destructive/90"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            size="icon"
            className={cn(
              'h-11 w-11 rounded-xl transition-all duration-200',
              message.trim()
                ? 'bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>

      <p className="text-center text-xs text-muted-foreground mt-3 max-w-3xl mx-auto">
        RinX AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
