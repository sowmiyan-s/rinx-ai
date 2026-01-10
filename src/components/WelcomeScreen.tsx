import { Lightbulb, Code, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-3xl mx-auto">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">R</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-medium text-foreground text-center mb-2">
        How can I help you today?
      </h1>
      <p className="text-muted-foreground text-center mb-10">
        I'm RinX AI, your intelligent assistant
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSuggestionClick(suggestion.text)}
            className="h-auto py-4 px-4 justify-start text-left border-border bg-transparent hover:bg-secondary transition-colors group"
          >
            <suggestion.icon className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-foreground shrink-0" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">
              {suggestion.text}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
