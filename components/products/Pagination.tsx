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

  // Build page number array with ellipsis
  function getPageNums(): (number | '...')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Info + page size */}
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>
          Showing <span className="font-semibold text-white">{from}–{to}</span> of{' '}
          <span className="font-semibold text-white">{total}</span>
        </span>
        <div className="relative">
          <select
            id="page-size"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="appearance-none rounded-lg bg-slate-800 border border-slate-700 py-1.5 pl-2 pr-7 text-sm text-white outline-none focus:border-indigo-500"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          id="prev-page"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {getPageNums().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-500">…</span>
          ) : (
            <button
              key={p}
              id={`page-${p}`}
              onClick={() => onPageChange(p as number)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                p === page
                  ? 'border-indigo-500 bg-indigo-600 text-white'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          id="next-page"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
