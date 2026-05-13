import { useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import { useAdminList } from '../../hooks/useAdminList';
import { useSeo } from '../../hooks/useSeo';
import { PageHeader, TableShell, formatDateTime } from './adminUtils';

interface AdminUser {
  id: string;
  google_sub?: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

const Avatar = ({ user }: { user: AdminUser }) => {
  const [failed, setFailed] = useState(false);
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();
  if (user.picture && !failed) {
    return (
      <img
        src={user.picture}
        alt={user.name || user.email || 'user'}
        className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-semibold text-white">
      {initial}
    </div>
  );
};

const AdminUsers = () => {
  useSeo({
    title: 'Users · Admin | TitleSnap',
    description: 'Registered TitleSnap users.',
    canonicalPath: '/admin/users',
    robots: 'noindex, nofollow',
  });

  const { data, pagination, loading, error, page, setPage, setLimit } =
    useAdminList<AdminUser>('titlesnap/admin/users');

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="All registered TitleSnap users."
        total={pagination?.total ?? null}
      />

      <TableShell
        loading={loading}
        error={error}
        empty={!loading && data.length === 0}
        emptyLabel="No users yet."
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
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3 whitespace-nowrap">Last login</th>
              <th className="px-4 py-3 whitespace-nowrap">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {data.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900 dark:text-white">
                        {user.name || '—'}
                      </div>
                      <div
                        className="truncate font-mono text-xs text-slate-500 dark:text-slate-400"
                        title={user.id}
                      >
                        {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {user.email ? (
                    <a
                      href={`mailto:${user.email}`}
                      className="break-all text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {user.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.email_verified ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDateTime(user.last_login_at)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                  {formatDateTime(user.created_at)}
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

export default AdminUsers;
