import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import bannerImg from '@/assets/banner.png';
import logoImg from '@/assets/logo.png';

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
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={bannerImg}
          alt="Rin AI"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 w-full">
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Rin AI" className="w-10 h-10 rounded-lg object-cover" />
            <h1 className="text-3xl font-bold text-foreground">Rin AI</h1>
          </div>
          <p className="text-muted-foreground text-base max-w-sm leading-relaxed">
            Your intelligent assistant for conversations, coding, and creative tasks.
          </p>
          <a
            href="https://github.com/sowmiyan-s"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            github.com/sowmiyan-s
          </a>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Rin AI" className="w-9 h-9 rounded-lg object-cover" />
            <h1 className="text-xl font-semibold text-foreground">Rin AI</h1>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isLogin
                  ? 'Sign in to continue to Rin AI'
                  : 'Sign up to get started with Rin AI'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="displayName" className="text-sm text-muted-foreground">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="pl-9 h-10 bg-secondary border-border text-foreground"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-9 h-10 bg-secondary border-border text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="pl-9 h-10 bg-secondary border-border text-foreground"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-medium"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-foreground hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
