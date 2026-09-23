interface Props {
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
}

export default function Pagination({ total, page, limit, onPageChange, onLimitChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  function getPageNums(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  const btnBase: React.CSSProperties = {
    borderRadius: '0.5rem',
    border: '1px solid #5a3518',
    backgroundColor: '#2a1a0a',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    color: '#c8a060',
    cursor: 'pointer',
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm" style={{ color: '#a07850' }}>
        <span>
          Showing <span className="font-semibold" style={{ color: '#fde8c8' }}>{from}–{to}</span> of{' '}
          <span className="font-semibold" style={{ color: '#fde8c8' }}>{total}</span>
        </span>
        <div className="relative">
          <select
            id="page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ ...btnBase, paddingRight: '1.75rem', appearance: 'none' }}
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
          <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#a07850' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          id="prev-page"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          style={{ ...btnBase, opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
          onMouseEnter={(e) => { if (page > 1) e.currentTarget.style.backgroundColor = '#361f0c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2a1a0a'; }}
        >
          Previous
        </button>

        {getPageNums().map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="px-1" style={{ color: '#7c5030' }}>…</span>
          ) : (
            <button
              key={p}
              id={`page-${p}`}
              onClick={() => onPageChange(p as number)}
              style={p === page
                ? { ...btnBase, backgroundColor: '#d97706', borderColor: '#d97706', color: '#1c1007', fontWeight: 600 }
                : btnBase
              }
              onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.backgroundColor = '#361f0c'; }}
              onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.backgroundColor = '#2a1a0a'; }}
            >
              {p}
            </button>
          )
        )}

        <button
          id="next-page"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={{ ...btnBase, opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
          onMouseEnter={(e) => { if (page < totalPages) e.currentTarget.style.backgroundColor = '#361f0c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2a1a0a'; }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
