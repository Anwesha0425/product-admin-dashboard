'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/api/auth';
import Spinner from '@/components/ui/Spinner';

// Autumn palette tokens
const c = {
  bg:          '#1c1007',   // deep charred brown
  card:        '#2a1a0a',   // dark walnut
  inputBg:     '#361f0c',   // warm dark brown
  border:      '#5a3518',   // sienna
  borderFocus: '#d97706',   // amber-600
  text:        '#fde8c8',   // warm cream
  textMuted:   '#a07850',   // muted tan
  placeholder: '#6b4a28',   // mid brown
  accent:      '#d97706',   // amber
  accentHover: '#b45309',   // amber-700
  error:       '#ef4444',
  errorBg:     '#3b0e0e',
  errorBorder: '#7f1d1d',
};

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);
  const [showPass, setShowPass] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    inFlight.current = true;
    setLoading(true);
    setApiError('');

    try {
      await loginUser({ username, password });
      router.push('/products');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setApiError(
        status === 400 || status === 401
          ? 'Invalid username or password.'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }

  const inputStyle = (hasError?: string) => ({
    width: '100%',
    borderRadius: '0.5rem',
    backgroundColor: c.inputBg,
    border: `1px solid ${hasError ? c.error : c.border}`,
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    color: c.text,
    outline: 'none',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {apiError && (
        <p
          className="rounded-lg px-3 py-2.5 text-sm"
          style={{ backgroundColor: c.errorBg, border: `1px solid ${c.errorBorder}`, color: '#fca5a5' }}
        >
          {apiError}
        </p>
      )}

      {/* Username */}
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: c.text }}
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: undefined })); }}
          style={inputStyle(errors.username)}
          onFocus={(e) => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${c.accent}33`; }}
          onBlur={(e)  => { e.target.style.borderColor = errors.username ? c.error : c.border; e.target.style.boxShadow = 'none'; }}
          placeholder="emilys"
        />
        {errors.username && (
          <p className="mt-1 text-xs" style={{ color: c.error }}>{errors.username}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium"
          style={{ color: c.text }}
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
            style={{ ...inputStyle(errors.password), paddingRight: '2.5rem' }}
            onFocus={(e) => { e.target.style.borderColor = c.borderFocus; e.target.style.boxShadow = `0 0 0 3px ${c.accent}33`; }}
            onBlur={(e)  => { e.target.style.borderColor = errors.password ? c.error : c.border; e.target.style.boxShadow = 'none'; }}
            placeholder="emilyspass"
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition"
            style={{ color: c.textMuted }}
          >
            {showPass ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs" style={{ color: c.error }}>{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all"
        style={{
          backgroundColor: loading ? c.accentHover : c.accent,
          color: '#1c1007',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = c.accentHover; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = c.accent; }}
      >
        {loading ? <Spinner size="sm" /> : null}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
