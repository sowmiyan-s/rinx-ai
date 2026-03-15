import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import logoImg from '@/assets/branding/logo.png';

type Stage = 'loading' | 'form' | 'success' | 'invalid';

export default function ResetPassword() {
  const [stage, setStage] = useState<Stage>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Supabase injects the recovery session via the URL hash when user clicks the link.
  // We listen for PASSWORD_RECOVERY event to confirm the link is valid.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStage('form');
      }
    });

    // Timeout fallback — if no event fires in 4s, treat the link as invalid/expired
    const timeout = setTimeout(() => {
      setStage((prev) => prev === 'loading' ? 'invalid' : prev);
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setStage('success');
      // Redirect to login after 2.5 seconds
      setTimeout(() => navigate('/auth', { replace: true }), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.card}>
        {/* Brand */}
        <div style={s.brand}>
          <img src={logoImg} alt="Rin" style={s.logo} />
          <span style={s.brandName}>Rin AI</span>
        </div>

        {/* ── Loading ── */}
        {stage === 'loading' && (
          <div style={s.centered}>
            <div style={s.spinner} />
            <p style={s.hint}>Verifying your reset link…</p>
          </div>
        )}

        {/* ── Invalid / expired link ── */}
        {stage === 'invalid' && (
          <div style={s.centered}>
            <div style={s.iconWrap}>
              <Lock size={26} strokeWidth={1.5} color="#c0392b" />
            </div>
            <h1 style={s.title}>Link expired</h1>
            <p style={s.sub}>This password reset link is invalid or has expired. Please request a new one.</p>
            <button style={s.btn} onClick={() => navigate('/auth')}>Back to sign in</button>
          </div>
        )}

        {/* ── New password form ── */}
        {stage === 'form' && (
          <>
            <div>
              <h1 style={s.title}>Set new password</h1>
              <p style={s.sub}>Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} style={s.form} noValidate>
              {/* New password */}
              <div style={s.fieldGroup}>
                <label htmlFor="new-password" style={s.label}>New password</label>
                <div style={{ ...s.inputWrap, ...(focusedField === 'new-password' ? s.inputWrapFocused : {}) }}>
                  <Lock style={s.icon} size={16} strokeWidth={1.8} />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('new-password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    style={{ ...s.input, paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn} tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div style={s.fieldGroup}>
                <label htmlFor="confirm-password" style={s.label}>Confirm password</label>
                <div style={{ ...s.inputWrap, ...(focusedField === 'confirm-password' ? s.inputWrapFocused : {}) }}>
                  <Lock style={s.icon} size={16} strokeWidth={1.8} />
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onFocus={() => setFocusedField('confirm-password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Re-enter password"
                    minLength={8}
                    required
                    autoComplete="new-password"
                    style={{ ...s.input, paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={s.eyeBtn} tabIndex={-1}>
                    {showConfirm ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>

              {/* Strength hint */}
              {password.length > 0 && (
                <div style={s.strengthRow}>
                  {[4, 6, 8, 10].map((min) => (
                    <div
                      key={min}
                      style={{
                        ...s.strengthBar,
                        background: password.length >= min
                          ? password.length >= 10 ? '#27ae60' : password.length >= 8 ? '#c0392b' : '#e67e22'
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                  <span style={s.strengthLabel}>
                    {password.length < 6 ? 'Too short' : password.length < 8 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}

              {error && (
                <div style={s.errorBox}>
                  <span style={s.errorDot} />
                  {error}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} style={{ ...s.btn, ...(isSubmitting ? s.btnDisabled : {}) }}>
                {isSubmitting ? <div style={s.spinner} /> : 'Update password'}
              </button>
            </form>
          </>
        )}

        {/* ── Success ── */}
        {stage === 'success' && (
          <div style={s.centered}>
            <div style={{ ...s.iconWrap, background: 'rgba(39,174,96,0.10)', border: '1px solid rgba(39,174,96,0.22)' }}>
              <CheckCircle size={28} strokeWidth={1.5} color="#27ae60" />
            </div>
            <h1 style={s.title}>Password updated!</h1>
            <p style={s.sub}>Your password has been changed successfully. Redirecting you to sign in…</p>
            <div style={s.spinner} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Styles ── */
const CRIMSON = '#c0392b';
const BG = '#0a0a0b';
const SURFACE = '#111114';
const BORDER = 'rgba(255,255,255,0.07)';
const BORDER_FOCUS = 'rgba(192,57,43,0.55)';
const TEXT_PRIMARY = '#f5f5f5';
const TEXT_MUTED = 'rgba(245,245,245,0.42)';
const TEXT_SUBTLE = 'rgba(245,245,245,0.26)';

const s: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' },
  card: { width: '100%', maxWidth: 420, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.65rem' },
  logo: { width: 34, height: 34, borderRadius: 9, objectFit: 'cover' },
  brandName: { fontSize: '1.05rem', fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.02em' },
  title: { fontSize: '1.3rem', fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '-0.03em', margin: '0 0 0.35rem' },
  sub: { fontSize: '0.83rem', color: TEXT_MUTED, margin: 0, fontWeight: 400, lineHeight: 1.55 },
  centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' },
  iconWrap: { width: 60, height: 60, borderRadius: '50%', background: 'rgba(192,57,43,0.10)', border: '1px solid rgba(192,57,43,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: '0.83rem', color: TEXT_MUTED, margin: 0 },

  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.45rem' },
  label: { fontSize: '0.75rem', fontWeight: 500, color: 'rgba(245,245,245,0.55)', letterSpacing: '0.01em' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 10, transition: 'border-color 0.2s, background 0.2s' },
  inputWrapFocused: { borderColor: BORDER_FOCUS, background: 'rgba(192,57,43,0.04)' },
  icon: { position: 'absolute', left: '0.85rem', color: TEXT_SUBTLE, pointerEvents: 'none', flexShrink: 0 },
  input: { flex: 1, height: 44, paddingLeft: '2.5rem', paddingRight: '0.85rem', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.875rem', color: TEXT_PRIMARY, fontFamily: 'inherit', width: '100%' },
  eyeBtn: { position: 'absolute', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: TEXT_SUBTLE, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, transition: 'color 0.2s' },

  strengthRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  strengthBar: { height: 3, flex: 1, borderRadius: 4, transition: 'background 0.3s' },
  strengthLabel: { fontSize: '0.7rem', color: TEXT_SUBTLE, marginLeft: '0.4rem', minWidth: 55, fontWeight: 500 },

  errorBox: { display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.8rem', color: '#e57c6e', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.18)', borderRadius: 8, padding: '0.65rem 0.85rem' },
  errorDot: { width: 6, height: 6, borderRadius: '50%', background: '#e57c6e', flexShrink: 0 },

  btn: { height: 44, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: CRIMSON, color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.2s', letterSpacing: '-0.01em' },
  btnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  spinner: { width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: CRIMSON, animation: 'spin 0.8s linear infinite' },
};
