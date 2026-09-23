interface Props {
  message?: string;
  onRetry?: () => void;
}
export default function ErrorState({ message = 'Something went wrong.', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24" style={{ color: '#a07850' }}>
      <svg className="mb-4 h-16 w-16 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <p className="mb-4 text-lg font-medium" style={{ color: '#c8a060' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg px-5 py-2 text-sm font-semibold transition"
          style={{ backgroundColor: '#d97706', color: '#1c1007' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b45309'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#d97706'; }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
