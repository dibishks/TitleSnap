import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../services/api';
import { useAdminAuth } from '../../hooks/AdminAuthContext';
import { useSeo } from '../../hooks/useSeo';

interface LocationState {
  from?: string;
}

const AdminLogin = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeo({
    title: 'Admin Login | TitleSnap',
    description: 'TitleSnap admin sign-in.',
    canonicalPath: '/admin/login',
    robots: 'noindex, nofollow',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unable to sign in. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col">
      <header className="px-6 py-6 sm:px-10">
        <img src="/img/logo-titlesnap-bg.png" alt="TitleSnap" className="h-10 w-auto" />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-200">
                Admin Console
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Sign In</h1>
              <p className="mt-3 text-sm text-slate-300">
                Restricted area. Authorized personnel only.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 disabled:opacity-60"
                  placeholder="admin"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 pr-20 text-base text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 disabled:opacity-60"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 my-auto h-7 rounded-md px-2 text-xs font-medium text-slate-300 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Trouble signing in? Contact the platform team.
          </p>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500 sm:px-10">
        © {new Date().getFullYear()} TitleSnap · Admin
      </footer>
    </div>
  );
};

export default AdminLogin;
