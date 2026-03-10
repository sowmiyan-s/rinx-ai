import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Message } from '@/hooks/useChat';

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
    <div className={cn('group py-6 px-4 md:px-0', isUser ? '' : 'bg-secondary/30')}>
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div
          className={cn(
            'shrink-0 w-7 h-7 rounded-sm flex items-center justify-center overflow-hidden',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-transparent'
          )}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <img src="/logo.png" alt="Rin AI" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-medium text-foreground">
            {isUser ? 'You' : 'Rin AI'}
          </p>

          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-foreground mt-6 mb-3 first:mt-0 border-b border-border pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold text-foreground mt-5 mb-2 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold text-foreground mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground leading-7 mb-4 last:mb-0">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-foreground">{children}</em>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono text-sm">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code
                        className={cn(
                          'block p-4 rounded-lg bg-sidebar font-mono text-sm overflow-x-auto',
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="my-4 rounded-lg overflow-hidden bg-sidebar border border-border">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 space-y-2 mb-4 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground leading-7">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-border rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-secondary text-left font-semibold text-foreground border-b border-border">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-foreground border-b border-border">
                      {children}
                    </td>
                  ),
                  hr: () => <hr className="my-6 border-border" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isLatest && (
                <span className="inline-block w-0.5 h-5 bg-foreground ml-0.5 animate-pulse" />
              )}
            </div>
          )}

          {/* Copy button for assistant messages */}
          {!isUser && !isLatest && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="py-6 px-4 md:px-0 bg-secondary/30">
      <div className="max-w-3xl mx-auto flex gap-4">
        <div className="shrink-0 w-7 h-7 rounded-sm bg-transparent flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="Rin AI" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-medium text-foreground">Rin AI</p>
          <div className="typing-indicator flex gap-1">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
