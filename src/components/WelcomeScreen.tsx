import { Lightbulb, Code, Shield, Sparkles } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  { icon: Lightbulb, text: 'Explain quantum computing in simple terms' },
  { icon: Code, text: 'Write a Python script to analyze data' },
  { icon: Shield, text: 'What are best practices for web security?' },
  { icon: Sparkles, text: 'Help me brainstorm startup ideas' },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <img src={logoImg} alt="Rin AI" className="w-10 h-10 rounded-lg object-cover" />
      </div>
      <h1 className="text-xl font-medium text-foreground text-center mb-1">
        How can I help you today?
      </h1>
      <p className="text-muted-foreground text-sm text-center mb-8">
        Ask me anything — coding, writing, research, or creative tasks.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-left group"
          >
            <suggestion.icon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground shrink-0" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground leading-snug">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
