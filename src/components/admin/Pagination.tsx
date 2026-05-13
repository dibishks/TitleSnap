import type { PaginationMeta } from '../../hooks/useAdminList';

interface PaginationProps {
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  loading?: boolean;
}

const limitOptions = [10, 20, 50, 100];

const Pagination = ({ pagination, onPageChange, onLimitChange, loading }: PaginationProps) => {
  if (!pagination) return null;
  const { page, limit, total, has_more } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800 sm:flex-row sm:items-center">
      <div className="text-slate-600 dark:text-slate-400">
        {total === 0 ? 'No results' : `Showing ${start}–${end} of ${total}`}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onLimitChange && (
          <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 transition focus:border-slate-900 focus:outline-none disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Previous
        </button>
        <span className="rounded-lg bg-slate-900 px-3 py-1.5 font-semibold text-white dark:bg-white dark:text-slate-900">
          {page}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!has_more || loading}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
