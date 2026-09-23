export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-center px-4">
      <p className="text-8xl font-black text-indigo-500">404</p>
      <h1 className="text-2xl font-bold text-white">Page not found</h1>
      <p className="text-slate-400">The page you are looking for does not exist.</p>
      <a
        href="/products"
        className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Back to products
      </a>
    </div>
  );
}
