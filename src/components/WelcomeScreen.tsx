import { Lightbulb, Code, Shield, Sparkles } from 'lucide-react';
import logoImg from '@/assets/branding/logo.png';
import bannerImg from '@/assets/branding/banner.png';

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
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full">
      <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-white/5 shadow-2xl group">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <img 
          src={bannerImg} 
          alt="Rin AI Banner" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="relative mb-4 group/logo">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover/logo:bg-primary/30 transition duration-1000" />
            <img src={logoImg} alt="Rin AI" className="relative w-20 h-20 rounded-2xl object-cover shadow-2xl border border-white/10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-white text-glow">Rin AI</h1>
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mt-2">The Intelligence Nexus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-3xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-secondary/20 hover:bg-secondary/40 hover:border-white/10 transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 p-2 rounded-lg bg-background/50 border border-white/5 group-hover:border-white/10 transition-colors">
              <suggestion.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <div className="relative z-10 flex-1 pt-1">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                {suggestion.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
