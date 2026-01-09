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
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {showWelcome ? (
          <WelcomeScreen onSuggestionClick={onSend} />
        ) : (
          <div className="pb-4">
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
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        isLoading={isLoading}
      />
    </div>
  );
}
