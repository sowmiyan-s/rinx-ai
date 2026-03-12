import { User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';
import logoImg from '@/assets/branding/logo.png';

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
    <div className={cn(
      'group py-8 px-4 md:px-0 transition-colors',
      !isUser && 'bg-secondary/10 backdrop-blur-sm'
    )}>
      <div className="max-w-3xl mx-auto flex gap-5">
        {/* Avatar */}
        <div className={cn(
          'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-1 border border-white/5 shadow-lg overflow-hidden transition-transform group-hover:scale-105',
          isUser ? 'bg-gradient-to-br from-secondary to-background' : 'bg-white'
        )}>
          {isUser ? (
            <User className="h-4 w-4 text-foreground" />
          ) : (
            <img src={logoImg} alt="Rin AI" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60">
              {isUser ? 'You' : 'Rin AI'}
            </span>
            {!isUser && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-bold uppercase tracking-tighter">
                Mistral Large
              </span>
            )}
          </div>

          {isUser ? (
            <p className="text-[15px] text-foreground/90 whitespace-pre-wrap leading-relaxed font-medium">
              {message.content}
            </p>
          ) : (
            <div className="text-[15px] text-foreground/90 leading-relaxed space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3 first:mt-0">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="leading-7 mb-4 last:mb-0 text-foreground/80">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-foreground">{children}</strong>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="px-1.5 py-0.5 rounded-md bg-white/5 text-primary font-mono text-[13px] border border-white/5">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="relative group/code my-4">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-transparent rounded-xl blur opacity-0 group-hover/code:opacity-100 transition duration-500" />
                        <code className={cn(
                          'relative block p-4 rounded-xl bg-[#0d0d0d] border border-white/5 font-mono text-[13px] overflow-x-auto scrollbar-thin shadow-2xl',
                          className
                        )} {...props}>
                          {children}
                        </code>
                      </div>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="rounded-xl overflow-hidden shadow-2xl">{children}</pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-2 mb-4 text-foreground/80">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-2 mb-4 text-foreground/80">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic text-muted-foreground/80 my-5 bg-primary/5 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 transition-all">
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 border border-white/5 rounded-xl">
                      <table className="min-w-full text-sm">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-white/5 text-left font-bold text-foreground border-b border-white/5">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-foreground/80 border-b border-white/5">{children}</td>
                  ),
                  hr: () => <hr className="my-8 border-white/5" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isLatest && (
                <span className="inline-block w-2.5 h-5 bg-primary/50 ml-1 rounded-sm animate-pulse align-middle" />
              )}
            </div>
          )}

          {/* Copy button */}
          {!isUser && !isLatest && (
            <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
              >
                {copied ? <><Check className="h-3 w-3 text-green-400" /> Copied</> : <><Copy className="h-3 w-3" /> Copy Text</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="py-8 px-4 md:px-0 bg-secondary/5 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto flex gap-5">
        <div className="shrink-0 w-8 h-8 rounded-xl bg-white flex items-center justify-center mt-1 border border-white/5 shadow-lg overflow-hidden animate-pulse">
          <img src={logoImg} alt="Rin AI" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60">Rin AI</span>
          </div>
          <div className="typing-indicator flex gap-1.5 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
