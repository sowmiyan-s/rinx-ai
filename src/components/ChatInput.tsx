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
    <div className="p-4 pb-6 px-6">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative border border-white/5 rounded-2xl bg-secondary/20 backdrop-blur-xl focus-within:border-white/10 focus-within:bg-secondary/30 transition-all shadow-2xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="How can I help you today?"
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full resize-none bg-transparent px-5 py-4 pr-14 text-[15px]',
                'text-foreground placeholder:text-muted-foreground/60',
                'focus:outline-none scrollbar-thin leading-relaxed',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            />
            <div className="absolute right-2.5 bottom-2.5">
              {isLoading ? (
                <button
                  type="button"
                  onClick={onStop}
                  className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  <Square className="h-3 w-3 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!message.trim() || disabled}
                  className={cn(
                    'h-8 w-8 rounded-xl flex items-center justify-center transition-all shadow-lg',
                    message.trim()
                      ? 'bg-foreground text-background hover:scale-105 active:scale-95'
                      : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </form>
        <p className="text-center text-[11px] text-muted-foreground/50 mt-3 font-medium uppercase tracking-tight">
          Mistral model powered chatbot • Intelligence Optimized
        </p>
      </div>
    </div>
  );
}
