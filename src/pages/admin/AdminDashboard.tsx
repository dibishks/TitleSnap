import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/AdminAuthContext';
import { useSeo } from '../../hooks/useSeo';

const quickLinks: Array<{
  label: string;
  to: string;
  description: string;
  accent: string;
}> = [
  {
    label: 'Users',
    to: '/admin/users',
    description: 'Manage registered TitleSnap users',
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'TitleSnaps',
    to: '/admin/titlesnaps',
    description: 'Review uploaded snaps and uploaders',
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    label: 'Contact Messages',
    to: '/admin/contact-messages',
    description: 'Inbound messages from the contact form',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Beta Users',
    to: '/admin/beta-users',
    description: 'Beta signups and approval status',
    accent: 'from-emerald-500 to-teal-500',
  },
];

const AdminDashboard = () => {
  const { user } = useAdminAuth();

  useSeo({
    title: 'Admin Dashboard | TitleSnap',
    description: 'TitleSnap admin dashboard.',
    canonicalPath: '/admin',
    robots: 'noindex, nofollow',
  });

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {user?.username || 'admin'}.
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${link.accent}`}
            />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {link.label}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {link.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition group-hover:gap-2 dark:text-blue-400">
              Open <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          More admin tools coming soon
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Moderation actions, exports, and analytics will live here next.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;
