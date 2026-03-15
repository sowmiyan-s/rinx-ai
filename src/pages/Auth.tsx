import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ChevronLeft, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import logoImg from '@/assets/branding/logo.png';
import bannerImg from '@/assets/branding/banner.png';

type View = 'login' | 'signup' | 'forgot' | 'forgot-sent';

export default function Auth() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { user, signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) navigate('/');
  }, [user, isLoading, navigate]);

  /* ── Forgot password ── */
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setView('forgot-sent');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Login / Signup ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (view === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message.includes('Invalid login credentials')
            ? 'Invalid email or password.' : error.message);
        }
      } else {
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setIsSubmitting(false); return; }
        const { error } = await signUp(email, password, displayName);
        if (error) {
          setError(error.message.includes('already registered')
            ? 'This email is already registered. Please sign in.' : error.message);
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchView = (v: View) => { setView(v); setError(''); };

  if (isLoading) return (
    <div style={styles.loadingWrapper}><div style={styles.spinner} /></div>
  );

  return (
    <div style={styles.root}>
      {/* ── Left panel (desktop only) ── */}
      <div className="auth-left-panel" style={styles.leftPanel}>
        <img src={bannerImg} alt="Rin AI" style={styles.leftBg} />
        <div style={styles.leftOverlay} />
        <div style={styles.leftTop}>
          <img src={logoImg} alt="Rin" style={styles.leftLogo} />
          <span style={styles.leftBrand}>Rin AI</span>
        </div>
        <div style={styles.leftBottom}>
          <h2 style={styles.leftHeadline}>Built to think.<br />Designed to feel.</h2>
          <p style={styles.leftSub}>
            Powered by Mistral's most advanced language models — your creative co‑pilot is ready.
          </p>
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

          {/* ══ FORGOT PASSWORD — email entry ══ */}
          {view === 'forgot' && (
            <>
              <div style={styles.cardHead}>
                <button style={styles.backBtn} onClick={() => switchView('login')}>
                  <ChevronLeft size={15} strokeWidth={2} />
                  Back to sign in
                </button>
                <h1 style={styles.cardTitle}>Reset password</h1>
                <p style={styles.cardSub}>Enter your email and we'll send you a reset link.</p>
              </div>

              <form onSubmit={handleForgotPassword} style={styles.form} noValidate>
                <div style={styles.fieldGroup}>
                  <label htmlFor="forgot-email" style={styles.label}>Email address</label>
                  <div style={{ ...styles.inputWrap, ...(focusedField === 'forgot-email' ? styles.inputWrapFocused : {}) }}>
                    <Mail style={styles.icon} size={16} strokeWidth={1.8} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('forgot-email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      style={styles.input}
                    />
                  </div>
                </div>

                {error && (
                  <div style={styles.errorBox}>
                    <span style={styles.errorDot} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} style={{ ...styles.submitBtn, ...(isSubmitting ? styles.submitBtnDisabled : {}) }}>
                  {isSubmitting ? <div style={styles.submitSpinner} /> : (
                    <>
                      <Send size={15} strokeWidth={2} />
                      Send reset link
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ══ FORGOT PASSWORD — sent confirmation ══ */}
          {view === 'forgot-sent' && (
            <div style={styles.sentWrap}>
              <div style={styles.sentIcon}>
                <Mail size={28} strokeWidth={1.5} color="#c0392b" />
              </div>
              <h1 style={{ ...styles.cardTitle, textAlign: 'center' }}>Check your inbox</h1>
              <p style={{ ...styles.cardSub, textAlign: 'center', maxWidth: 300, margin: '0 auto' }}>
                We've sent a password reset link to <strong style={{ color: '#f5f5f5' }}>{email}</strong>.
                It may take a minute or two to arrive.
              </p>
              <p style={{ ...styles.cardSub, textAlign: 'center', fontSize: '0.77rem', marginTop: '0.5rem' }}>
                Didn't receive it? Check your spam folder or{' '}
                <button style={styles.inlineBtn} onClick={() => switchView('forgot')}>try again</button>.
              </p>
              <button style={{ ...styles.submitBtn, marginTop: '0.5rem' }} onClick={() => switchView('login')}>
                Back to sign in
              </button>
            </div>
          )}

          {/* ══ LOGIN / SIGNUP ══ */}
          {(view === 'login' || view === 'signup') && (
            <>
              <div style={styles.cardHead}>
                <h1 style={styles.cardTitle}>
                  {view === 'login' ? 'Welcome back' : 'Create account'}
                </h1>
                <p style={styles.cardSub}>
                  {view === 'login' ? 'Sign in to continue to your workspace' : 'Join and start exploring Rin AI'}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form} noValidate>
                {view === 'signup' && (
                  <div style={styles.fieldGroup}>
                    <label htmlFor="displayName" style={styles.label}>Display Name</label>
                    <div style={{ ...styles.inputWrap, ...(focusedField === 'displayName' ? styles.inputWrapFocused : {}) }}>
                      <User style={styles.icon} size={16} strokeWidth={1.8} />
                      <input
                        id="displayName" type="text" value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        onFocus={() => setFocusedField('displayName')} onBlur={() => setFocusedField(null)}
                        placeholder="Your name" autoComplete="name" style={styles.input}
                      />
                    </div>
                  </div>
                )}

                <div style={styles.fieldGroup}>
                  <label htmlFor="email" style={styles.label}>Email address</label>
                  <div style={{ ...styles.inputWrap, ...(focusedField === 'email' ? styles.inputWrapFocused : {}) }}>
                    <Mail style={styles.icon} size={16} strokeWidth={1.8} />
                    <input
                      id="email" type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                      placeholder="name@example.com" required autoComplete="email" style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <div style={styles.labelRow}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    {view === 'login' && (
                      <button type="button" style={styles.forgotBtn} onClick={() => switchView('forgot')}>
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div style={{ ...styles.inputWrap, ...(focusedField === 'password' ? styles.inputWrapFocused : {}) }}>
                    <Lock style={styles.icon} size={16} strokeWidth={1.8} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                      placeholder="••••••••" required minLength={6}
                      autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                      style={{ ...styles.input, paddingRight: '2.75rem' }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn} tabIndex={-1}>
                      {showPassword ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={styles.errorBox}>
                    <span style={styles.errorDot} />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} style={{ ...styles.submitBtn, ...(isSubmitting ? styles.submitBtnDisabled : {}) }}>
                  {isSubmitting ? <div style={styles.submitSpinner} /> : (
                    <>
                      {view === 'login' ? 'Sign in' : 'Create account'}
                      <ArrowRight size={16} strokeWidth={2} style={styles.submitArrow} />
                    </>
                  )}
                </button>
              </form>

              <p style={styles.toggleText}>
                {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => switchView(view === 'login' ? 'signup' : 'login')} style={styles.toggleBtn}>
                  {view === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <a href="https://github.com/sowmiyan-s" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
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
   Styles
───────────────────────────────────────── */
const CRIMSON = '#c0392b';
const BG = '#0a0a0b';
const SURFACE = '#111114';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_FOCUS = 'rgba(192,57,43,0.55)';
const TEXT_PRIMARY = '#f5f5f5';
const TEXT_MUTED = 'rgba(245,245,245,0.42)';
const TEXT_SUBTLE = 'rgba(245,245,245,0.26)';

const styles: Record<string, React.CSSProperties> = {
  loadingWrapper: { minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: CRIMSON, animation: 'spin 0.8s linear infinite' },

  root: { minHeight: '100vh', minWidth: '100vw', display: 'flex', background: BG, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' },

  leftPanel: { display: 'none', position: 'relative', overflow: 'hidden', flexShrink: 0, flexBasis: '46%', maxWidth: '620px' } as React.CSSProperties,
  leftBg: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } as React.CSSProperties,
  leftOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(10,10,11,0.30) 0%, rgba(10,10,11,0.70) 60%, rgba(10,10,11,0.96) 100%)' } as React.CSSProperties,
  leftTop: { position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '2.25rem 2.5rem' } as React.CSSProperties,
  leftLogo: { width: 36, height: 36, borderRadius: 10, objectFit: 'cover' },
  leftBrand: { fontSize: '1.05rem', fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.02em' },
  leftBottom: { position: 'absolute', zIndex: 2, bottom: 0, left: 0, right: 0, padding: '2.5rem' } as React.CSSProperties,
  leftHeadline: { fontSize: 'clamp(1.7rem, 2.4vw, 2.25rem)', fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.22, letterSpacing: '-0.03em', margin: '0 0 1rem' },
  leftSub: { fontSize: '0.85rem', color: 'rgba(245,245,245,0.55)', lineHeight: 1.65, maxWidth: 320, margin: '0 0 1.5rem', fontWeight: 400 },
  pillRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' as const },
  pill: { fontSize: '0.7rem', fontWeight: 500, color: 'rgba(245,245,245,0.55)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 100, padding: '0.3rem 0.75rem', letterSpacing: '0.04em' },

  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', overflowY: 'auto' as const, gap: '2rem' },

  mobileHeader: { display: 'flex', alignItems: 'center', gap: '0.85rem' },
  mobileLogoImg: { width: 44, height: 44, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.09)' },
  mobileBrand: { fontSize: '1.25rem', fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.025em', lineHeight: 1.25 },

  card: { width: '100%', maxWidth: 420, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '2.25rem 2.25rem', display: 'flex', flexDirection: 'column' as const, gap: '1.75rem' },
  cardHead: { display: 'flex', flexDirection: 'column' as const, gap: '0.35rem' },
  cardTitle: { fontSize: '1.35rem', fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.03em', margin: 0 },
  cardSub: { fontSize: '0.83rem', color: TEXT_MUTED, margin: 0, fontWeight: 400 },

  /* Back button */
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: '0.78rem', fontWeight: 500, padding: 0, marginBottom: '0.5rem', transition: 'color 0.2s', fontFamily: 'inherit' },

  /* Sent confirmation */
  sentWrap: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1rem', textAlign: 'center' as const },
  sentIcon: { width: 60, height: 60, borderRadius: '50%', background: 'rgba(192,57,43,0.10)', border: '1px solid rgba(192,57,43,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inlineBtn: { background: 'none', border: 'none', cursor: 'pointer', color: CRIMSON, fontSize: 'inherit', fontWeight: 600, padding: 0, fontFamily: 'inherit' },

  form: { display: 'flex', flexDirection: 'column' as const, gap: '1.1rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '0.45rem' },
  labelRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: '0.75rem', fontWeight: 500, color: 'rgba(245,245,245,0.55)', letterSpacing: '0.01em' },
  forgotBtn: { fontSize: '0.72rem', fontWeight: 500, color: TEXT_MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.01em', transition: 'color 0.2s', fontFamily: 'inherit' },
  inputWrap: { position: 'relative' as const, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 10, transition: 'border-color 0.2s, background 0.2s' },
  inputWrapFocused: { borderColor: BORDER_FOCUS, background: 'rgba(192,57,43,0.04)' },
  icon: { position: 'absolute' as const, left: '0.85rem', color: TEXT_SUBTLE, pointerEvents: 'none' as const, flexShrink: 0 },
  input: { flex: 1, height: 44, paddingLeft: '2.5rem', paddingRight: '0.85rem', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: TEXT_PRIMARY, fontFamily: 'inherit', width: '100%' },
  eyeBtn: { position: 'absolute' as const, right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUBTLE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'color 0.2s' },

  errorBox: { display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: '#e57c6e', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: 8, padding: '0.65rem 0.85rem', fontWeight: 400 },
  errorDot: { width: 6, height: 6, borderRadius: '50%', background: '#e57c6e', flexShrink: 0 },

  submitBtn: { height: 44, width: '100%', marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: CRIMSON, color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', letterSpacing: '-0.01em', cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' },
  submitBtnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  submitArrow: { transition: 'transform 0.2s' },
  submitSpinner: { width: 18, height: 18, border: '2px solid rgba(255,255,255,0.25)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.75s linear infinite' },

  toggleText: { textAlign: 'center' as const, fontSize: '0.82rem', color: TEXT_MUTED, margin: 0, fontWeight: 400 },
  toggleBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: CRIMSON, fontWeight: 600, padding: 0, fontFamily: 'inherit', letterSpacing: '-0.01em' },

  footer: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  footerLink: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: TEXT_MUTED, textDecoration: 'none', fontWeight: 400, transition: 'color 0.2s' },
  footerDot: { color: TEXT_SUBTLE, fontSize: '0.75rem' },
  footerNote: { fontSize: '0.75rem', color: TEXT_SUBTLE },
};
