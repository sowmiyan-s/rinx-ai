import { User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';
import logoImg from '@/assets/logo.png';

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group py-5 px-4 md:px-0')}>
      <div className="max-w-2xl mx-auto flex gap-3">
        {/* Avatar */}
        <div className={cn(
          'shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5',
          isUser ? 'bg-secondary' : ''
        )}>
          {isUser ? (
            <User className="h-3.5 w-3.5 text-foreground" />
          ) : (
            <img src="/logo.png" alt="Rin AI" className="w-7 h-7 rounded-full object-cover" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            {isUser ? 'You' : 'Rin AI'}
          </p>

          {isUser ? (
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="text-sm text-foreground leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold text-foreground mt-4 mb-2 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-semibold text-foreground mt-4 mb-2 first:mt-0">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-semibold text-foreground mt-3 mb-1.5">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground leading-7 mb-3 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1 py-0.5 rounded bg-secondary text-foreground font-mono text-[13px]">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className={cn('block p-3 rounded-md bg-secondary font-mono text-[13px] overflow-x-auto', className)} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="my-3 rounded-md overflow-hidden">{children}</pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1 mb-3 text-foreground">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1 mb-3 text-foreground">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground my-3">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-muted-foreground">
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full text-sm border border-border rounded-md">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-1.5 bg-secondary text-left font-medium text-foreground border-b border-border">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-1.5 text-foreground border-b border-border">{children}</td>
                  ),
                  hr: () => <hr className="my-4 border-border" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isLatest && (
                <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-pulse" />
              )}
            </div>
          )}

          {/* Copy button */}
          {!isUser && !isLatest && (
            <button
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="py-5 px-4 md:px-0">
      <div className="max-w-2xl mx-auto flex gap-3">
        <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden mt-0.5">
          <img src="/logo.png" alt="Rin AI" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Rin AI</p>
          <div className="typing-indicator flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
