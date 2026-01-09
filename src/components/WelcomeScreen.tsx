import { Sparkles, Zap, Shield, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  { icon: Sparkles, text: 'Explain quantum computing in simple terms' },
  { icon: Zap, text: 'Write a Python script to analyze data' },
  { icon: Shield, text: 'What are best practices for web security?' },
  { icon: MessageSquare, text: 'Help me brainstorm startup ideas' },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/25">
          <span className="text-3xl font-bold text-primary-foreground">R</span>
        </div>
        <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-xl -z-10 pulse-ring" />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
        <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
          How can I help you today?
        </span>
      </h1>
      <p className="text-muted-foreground text-center mb-12 max-w-md">
        I'm RinX AI, your intelligent assistant powered by Mistral. Ask me anything!
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onSuggestionClick(suggestion.text)}
            className="h-auto py-4 px-4 justify-start text-left hover:bg-secondary/80 hover:border-primary/50 transition-all duration-200 group"
          >
            <suggestion.icon className="h-5 w-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm text-foreground/90">{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
