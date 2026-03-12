import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import logoImg from '@/assets/branding/logo.png';
import bannerImg from '@/assets/branding/banner.png';
import loginBg1 from '@/assets/backgrounds/login_bg_1.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message.includes('Invalid login credentials')
            ? 'Invalid email or password.'
            : error.message);
        }
      } else {
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setError(error.message.includes('already registered')
            ? 'This email is already registered. Please sign in.'
            : error.message);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      {/* Main Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerImg} 
          alt="" 
          className="w-full h-full object-cover opacity-20 scale-105 blur-sm" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/40" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Premium Banner Container */}
        <div className="hidden lg:block relative group h-[620px]">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={bannerImg}
              alt="Rin AI"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 space-y-4">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="" className="w-10 h-10 rounded-xl" />
                <h2 className="text-3xl font-bold tracking-tighter text-white text-glow">Rin AI</h2>
              </div>
              <p className="text-white/70 text-sm max-w-xs font-medium leading-relaxed">
                Experience the next generation of creative intelligence, powered by Mistral's most advanced language models.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-[440px] mx-auto relative">
          {/* Mobile Background Banner */}
          <div className="lg:hidden absolute inset-0 -inset-x-6 -inset-y-12 z-0 opacity-20 pointer-events-none">
            <img 
              src={loginBg1} 
              alt="" 
              className="w-full h-full object-cover blur-2xl scale-125" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden relative z-10 flex flex-col items-center mb-10 text-center">
            <img 
              src={logoImg} 
              alt="Rin AI" 
              className="w-16 h-16 rounded-2xl object-cover shadow-2xl border border-white/10 mb-4" 
            />
            <h1 className="text-4xl font-bold text-foreground mb-2 text-glow">Rin AI</h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">The Intelligence Nexus</p>
          </div>

          <div className="relative z-10 bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 lg:p-10 shadow-2xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isLogin
                ? 'Enter your credentials to access your workspace'
                : 'Join us to start experimenting with Mistral AI'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                  Display Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-9 h-11 bg-white/[0.03] border-white/5 focus:border-white/20 focus:ring-0 text-foreground placeholder:text-muted-foreground/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="pl-9 h-11 bg-white/[0.03] border-white/5 focus:border-white/20 focus:ring-0 text-foreground placeholder:text-muted-foreground/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
                  Password
                </Label>
                {isLogin && (
                  <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-9 h-11 bg-white/[0.03] border-white/5 focus:border-white/20 focus:ring-0 text-foreground placeholder:text-muted-foreground/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs font-medium text-red-400 bg-red-400/10 px-3 py-2.5 rounded-lg border border-red-400/20 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-white text-black hover:bg-white/90 font-semibold rounded-xl transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-transparent px-2 text-muted-foreground/40">or continue with</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground font-medium">
            {isLogin ? "New to Rin AI? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-foreground hover:underline underline-offset-4 decoration-primary/30"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center items-center gap-6">
          <a
            href="https://github.com/sowmiyan-s"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  );
}
