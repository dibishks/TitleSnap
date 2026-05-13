import { useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import { useAdminList } from '../../hooks/useAdminList';
import { useSeo } from '../../hooks/useSeo';
import { PageHeader, TableShell, formatDateTime, truncate } from './adminUtils';

interface ContactMessage {
  id: string;
  name?: string;
  email?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminContactMessages = () => {
  useSeo({
    title: 'Contact Messages · Admin | TitleSnap',
    description: 'Inbound contact form submissions.',
    canonicalPath: '/admin/contact-messages',
    robots: 'noindex, nofollow',
  });

  const { data, pagination, loading, error, page, setPage, setLimit } =
    useAdminList<ContactMessage>('titlesnap/admin/contactus-messages');

  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        subtitle="Messages submitted through the public contact form."
        total={pagination?.total ?? null}
      />

      <TableShell
        loading={loading}
        error={error}
        empty={!loading && data.length === 0}
        emptyLabel="No messages yet."
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
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3 whitespace-nowrap">Received</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {data.map((msg) => {
              const isOpen = expanded.has(msg.id);
              const text = msg.message || '';
              const isLong = text.length > 160;
              return (
                <tr
                  key={msg.id}
                  className="align-top transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {msg.name || '—'}
                    </div>
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {msg.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {isOpen || !isLong ? text : truncate(text, 160)}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDateTime(msg.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggle(msg.id)}
                        className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {isOpen ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableShell>

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Page {page} · {pagination?.limit ?? 20} per page
      </p>
    </div>
  );
};

export default AdminContactMessages;
