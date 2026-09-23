'use client';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4" style={{ backgroundColor: '#1c1007' }}>
      <p className="text-8xl font-black" style={{ color: '#d97706' }}>404</p>
      <h1 className="text-2xl font-bold" style={{ color: '#fde8c8' }}>Page not found</h1>
      <p style={{ color: '#a07850' }}>The page you are looking for does not exist.</p>
      <a
        href="/products"
        className="mt-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition"
        style={{ backgroundColor: '#d97706', color: '#1c1007' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b45309'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; }}
      >
        Back to products
      </a>
    </div>
  );
}
