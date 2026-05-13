import type { ReactNode } from 'react';

export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

// Backend stores movie release_date as a unix-seconds string (e.g. "1776297600").
export const formatUnixSecondsDate = (value?: string | number | null): string => {
  if (value === undefined || value === null || value === '') return '—';
  const seconds = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(seconds)) return '—';
  const date = new Date(seconds * 1000);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncate = (text: string | undefined | null, max = 120): string => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  total?: number | null;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, total, actions }: PageHeaderProps) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Admin
      </p>
      <h1 className="mt-1 flex items-baseline gap-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
        {typeof total === 'number' && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {total.toLocaleString()}
          </span>
        )}
      </h1>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

interface TableShellProps {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const TableShell = ({
  loading,
  error,
  empty,
  emptyLabel = 'No records found.',
  children,
  footer,
}: TableShellProps) => (
  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    {error && (
      <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
        {error}
      </div>
    )}
    <div className="relative overflow-x-auto">
      {loading && (
        <div className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <div className="h-full w-1/3 animate-pulse bg-blue-500" />
        </div>
      )}
      {children}
      {empty && !loading && !error && (
        <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          {emptyLabel}
        </div>
      )}
    </div>
    {footer}
  </div>
);
