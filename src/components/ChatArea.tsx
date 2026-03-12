import { useEffect, useRef } from 'react';
import { ChatMessage, TypingIndicator } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import type { Message } from '@/hooks/useChat';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export function ChatArea({ messages, isLoading, onSend, onStop }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
        <div className="max-w-4xl mx-auto w-full flex flex-col min-h-full">
          {showWelcome ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <WelcomeScreen onSuggestionClick={onSend} />
            </div>
          ) : (
            <div className="py-2 space-y-0">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLatest={
                    index === messages.length - 1 &&
                    message.role === 'assistant' &&
                    isLoading
                  }
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="px-4">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} className="h-20" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0">
        <ChatInput
          onSend={onSend}
          onStop={onStop}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
