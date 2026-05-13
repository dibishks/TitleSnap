import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/AdminAuthContext';

const navItems: Array<{ label: string; to: string; exact?: boolean }> = [
  { label: 'Dashboard', to: '/admin', exact: true },
  { label: 'Users', to: '/admin/users' },
  { label: 'TitleSnaps', to: '/admin/titlesnaps' },
  { label: 'Contact', to: '/admin/contact-messages' },
  { label: 'Beta', to: '/admin/beta-users' },
];

const AdminLayout = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/img/logo-titlesnap-bg.png" alt="TitleSnap" className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:inline">
              Admin
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname === item.to ||
                  location.pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                {(user?.username || '?').charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user?.username || 'Admin'}</span>
              <span aria-hidden="true">▾</span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Signed in as
                  <div className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.username}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="border-t border-slate-200 px-2 py-2 dark:border-slate-800 md:hidden">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname === item.to ||
                  location.pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
