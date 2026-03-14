import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';
import logoImg from '@/assets/branding/logo.png';
import bannerImg from '@/assets/branding/banner.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* ── Left panel (desktop only) ── */}
      <div className="auth-left-panel" style={styles.leftPanel}>
        <img src={bannerImg} alt="Rin AI" style={styles.leftBg} />
        <div style={styles.leftOverlay} />

        {/* Top brand mark */}
        <div style={styles.leftTop}>
          <img src={logoImg} alt="Rin" style={styles.leftLogo} />
          <span style={styles.leftBrand}>Rin AI</span>
        </div>

        {/* Bottom copy */}
        <div style={styles.leftBottom}>

          <h2 style={styles.leftHeadline}>
            Built to think.<br />Designed to feel.
          </h2>
          <p style={styles.leftSub}>
            Powered by Mistral's most advanced language models — your creative co‑pilot is ready.
          </p>

          {/* small proof dots */}
          <div style={styles.pillRow}>
            {['Fast', 'Private', 'Creative'].map((t) => (
              <span key={t} style={styles.pill}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={styles.rightPanel}>

        {/* Mobile header */}
        <div style={styles.mobileHeader}>
          <img src={logoImg} alt="Rin" style={styles.mobileLogoImg} />
          <div style={styles.mobileBrand}>Rin AI</div>
        </div>

        {/* Card */}
        <div style={styles.card}>

          {/* Heading */}
          <div style={styles.cardHead}>
            <h1 style={styles.cardTitle}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={styles.cardSub}>
              {isLogin
                ? 'Sign in to continue to your workspace'
                : 'Join and start exploring Rin AI'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form} noValidate>

            {/* Display Name (signup only) */}
            {!isLogin && (
              <div style={styles.fieldGroup}>
                <label htmlFor="displayName" style={styles.label}>Display Name</label>
                <div style={{
                  ...styles.inputWrap,
                  ...(focusedField === 'displayName' ? styles.inputWrapFocused : {})
                }}>
                  <User style={styles.icon} size={16} strokeWidth={1.8} />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    onFocus={() => setFocusedField('displayName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your name"
                    autoComplete="name"
                    style={styles.input}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <div style={{
                ...styles.inputWrap,
                ...(focusedField === 'email' ? styles.inputWrapFocused : {})
              }}>
                <Mail style={styles.icon} size={16} strokeWidth={1.8} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <div style={styles.labelRow}>
                <label htmlFor="password" style={styles.label}>Password</label>
                {isLogin && (
                  <button type="button" style={styles.forgotBtn}>Forgot password?</button>
                )}
              </div>
              <div style={{
                ...styles.inputWrap,
                ...(focusedField === 'password' ? styles.inputWrapFocused : {})
              }}>
                <Lock style={styles.icon} size={16} strokeWidth={1.8} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  style={{ ...styles.input, paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff size={15} strokeWidth={1.8} />
                    : <Eye size={15} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorDot} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {})
              }}
            >
              {isSubmitting ? (
                <div style={styles.submitSpinner} />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight size={16} strokeWidth={2} style={styles.submitArrow} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              setError('');
              try {
                const result = await lovable.auth.signInWithOAuth('google', {
                  redirect_uri: window.location.origin,
                });
                if (result?.error) setError('Google sign-in failed. Please try again.');
              } catch {
                setError('Google sign-in failed. Please try again.');
              } finally {
                setGoogleLoading(false);
              }
            }}
            style={{
              ...styles.githubBtn,
              ...(googleLoading ? styles.submitBtnDisabled : {})
            }}
          >
            {googleLoading ? (
              <div style={styles.submitSpinner} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Toggle */}
          <p style={styles.toggleText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={styles.toggleBtn}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <a
            href="https://github.com/sowmiyan-s"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.footerLink}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub Repository</span>
          </a>
          <span style={styles.footerDot}>·</span>
          <span style={styles.footerNote}>Rin AI © 2025</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Inline styles — precise, no utility chaos
───────────────────────────────────────── */
const CRIMSON = '#c0392b';
const CRIMSON_DARK = '#a93226';
const BG = '#0a0a0b';
const SURFACE = '#111114';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_FOCUS = 'rgba(192,57,43,0.55)';
const TEXT_PRIMARY = '#f5f5f5';
const TEXT_MUTED = 'rgba(245,245,245,0.42)';
const TEXT_SUBTLE = 'rgba(245,245,245,0.26)';

const styles: Record<string, React.CSSProperties> = {
  /* ── Loading ── */
  loadingWrapper: {
    minHeight: '100vh',
    background: BG,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.1)',
    borderTopColor: CRIMSON,
    animation: 'spin 0.8s linear infinite',
  },

  /* ── Root layout ── */
  root: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    background: BG,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  },

  /* ── Left panel ── */
  leftPanel: {
    display: 'none',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    flexBasis: '46%',
    maxWidth: '620px',
  } as React.CSSProperties,
  leftBg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as React.CSSProperties,
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, rgba(10,10,11,0.30) 0%, rgba(10,10,11,0.70) 60%, rgba(10,10,11,0.96) 100%)',
  } as React.CSSProperties,
  leftTop: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '2.25rem 2.5rem',
  } as React.CSSProperties,
  leftLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    objectFit: 'cover',
  },
  leftBrand: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: TEXT_PRIMARY,
    letterSpacing: '-0.02em',
  },
  leftBottom: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '2.5rem',
  } as React.CSSProperties,
  leftTagline: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: CRIMSON,
    marginBottom: '0.75rem',
    margin: '0 0 0.75rem',
  },
  leftHeadline: {
    fontSize: 'clamp(1.7rem, 2.4vw, 2.25rem)',
    fontWeight: 700,
    color: TEXT_PRIMARY,
    lineHeight: 1.22,
    letterSpacing: '-0.03em',
    margin: '0 0 1rem',
  },
  leftSub: {
    fontSize: '0.85rem',
    color: 'rgba(245,245,245,0.55)',
    lineHeight: 1.65,
    maxWidth: 320,
    margin: '0 0 1.5rem',
    fontWeight: 400,
  },
  pillRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  pill: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'rgba(245,245,245,0.55)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 100,
    padding: '0.3rem 0.75rem',
    letterSpacing: '0.04em',
  },

  /* ── Right panel ── */
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 1.5rem',
    overflowY: 'auto' as const,
    gap: '2rem',
  },

  /* ── Mobile header ── */
  mobileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  mobileLogoImg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.09)',
  },
  mobileBrand: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: TEXT_PRIMARY,
    letterSpacing: '-0.025em',
    lineHeight: 1.25,
  },
  mobileTagline: {
    fontSize: '0.72rem',
    color: TEXT_MUTED,
    fontWeight: 400,
    letterSpacing: '0.04em',
    marginTop: 2,
  },

  /* ── Card ── */
  card: {
    width: '100%',
    maxWidth: 420,
    background: SURFACE,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: '2.25rem 2.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.75rem',
  },
  cardHead: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
  },
  cardTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: TEXT_PRIMARY,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  cardSub: {
    fontSize: '0.83rem',
    color: TEXT_MUTED,
    margin: 0,
    fontWeight: 400,
  },

  /* ── Form ── */
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.1rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.45rem',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'rgba(245,245,245,0.55)',
    letterSpacing: '0.01em',
  },
  forgotBtn: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: TEXT_MUTED,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    letterSpacing: '0.01em',
    transition: 'color 0.2s',
  },
  inputWrap: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    transition: 'border-color 0.2s, background 0.2s',
  },
  inputWrapFocused: {
    borderColor: BORDER_FOCUS,
    background: 'rgba(192,57,43,0.04)',
  },
  icon: {
    position: 'absolute' as const,
    left: '0.85rem',
    color: TEXT_SUBTLE,
    pointerEvents: 'none' as const,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    height: 44,
    paddingLeft: '2.5rem',
    paddingRight: '0.85rem',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '0.875rem',
    color: TEXT_PRIMARY,
    fontFamily: 'inherit',
    width: '100%',
  },
  eyeBtn: {
    position: 'absolute' as const,
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: TEXT_SUBTLE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'color 0.2s',
  },

  /* ── Error ── */
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    fontSize: '0.8rem',
    color: '#e57c6e',
    background: 'rgba(192,57,43,0.08)',
    border: '1px solid rgba(192,57,43,0.18)',
    borderRadius: 8,
    padding: '0.65rem 0.85rem',
    fontWeight: 400,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#e57c6e',
    flexShrink: 0,
  },

  /* ── Submit button ── */
  submitBtn: {
    height: 44,
    width: '100%',
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: CRIMSON,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '0.875rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.15s',
  },
  submitBtnDisabled: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
  submitArrow: {
    transition: 'transform 0.2s',
  },
  submitSpinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(255,255,255,0.25)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite',
  },

  /* ── Divider ── */
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: BORDER,
  },
  dividerText: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: TEXT_SUBTLE,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  },

  /* ── Toggle ── */
  toggleText: {
    textAlign: 'center' as const,
    fontSize: '0.82rem',
    color: TEXT_MUTED,
    margin: 0,
    fontWeight: 400,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.82rem',
    color: CRIMSON,
    fontWeight: 600,
    padding: 0,
    fontFamily: 'inherit',
    letterSpacing: '-0.01em',
  },

  /* ── GitHub button ── */
  githubBtn: {
    height: 44,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    background: 'rgba(255,255,255,0.05)',
    color: TEXT_PRIMARY,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    fontSize: '0.875rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 0.2s, border-color 0.2s',
    letterSpacing: '-0.01em',
  },

  /* ── Footer ── */
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: TEXT_MUTED,
    textDecoration: 'none',
    fontWeight: 400,
    transition: 'color 0.2s',
  },
  footerDot: {
    color: TEXT_SUBTLE,
    fontSize: '0.75rem',
  },
  footerNote: {
    fontSize: '0.75rem',
    color: TEXT_SUBTLE,
  },
};
