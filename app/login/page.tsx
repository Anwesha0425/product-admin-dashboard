import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Product Admin',
  description: 'Sign in to manage your product catalog.',
};

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: '#1c1007' }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#fde8c8' }}>Product Admin</h1>
          <p className="mt-1 text-sm" style={{ color: '#a07850' }}>Sign in to continue</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#2a1a0a', border: '1px solid #4a2e10' }}
        >
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-xs" style={{ color: '#5c3d1e' }}>
          Use{' '}
          <span style={{ color: '#c08040' }}>emilys</span>
          {' / '}
          <span style={{ color: '#c08040' }}>emilyspass</span>
        </p>
      </div>
    </main>
  );
}
