import Pagination from '../../components/admin/Pagination';
import { useAdminList } from '../../hooks/useAdminList';
import { useSeo } from '../../hooks/useSeo';
import { PageHeader, TableShell, formatDateTime } from './adminUtils';

interface BetaUser {
  id: string;
  email?: string;
  approve_status?: boolean;
  created_at?: string;
  updated_at?: string;
}

const ApproveStatusPill = ({ approved }: { approved?: boolean }) => {
  if (approved) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Pending
    </span>
  );
};

const AdminBetaUsers = () => {
  useSeo({
    title: 'Beta Users · Admin | TitleSnap',
    description: 'Beta access registrations.',
    canonicalPath: '/admin/beta-users',
    robots: 'noindex, nofollow',
  });

  const { data, pagination, loading, error, page, setPage, setLimit } =
    useAdminList<BetaUser>('titlesnap/admin/beta-users');

  return (
    <div>
      <PageHeader
        title="Beta Users"
        subtitle="Email submissions from the beta access gate."
        total={pagination?.total ?? null}
      />

      <TableShell
        loading={loading}
        error={error}
        empty={!loading && data.length === 0}
        emptyLabel="No beta signups yet."
        footer={
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
            onLimitChange={setLimit}
            loading={loading}
          />
        }
      >
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900/60">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Requested</th>
              <th className="px-4 py-3 whitespace-nowrap">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {data.map((entry) => (
              <tr
                key={entry.id}
                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3">
                  {entry.email ? (
                    <a
                      href={`mailto:${entry.email}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {entry.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  <ApproveStatusPill approved={entry.approve_status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDateTime(entry.created_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDateTime(entry.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Page {page} · {pagination?.limit ?? 20} per page
      </p>
    </div>
  );
};

export default AdminBetaUsers;
