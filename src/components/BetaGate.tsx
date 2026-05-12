import { useState, type FormEvent, type ReactNode } from 'react';
import { apiClient } from '../services/api';

// TEMPORARY: Beta access gate. Remove this whole file (and the wrapper in App.tsx)
// once the public launch ships.

const STORAGE_KEY = 'beta_access_granted';

const hasAccess = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const grantAccess = () => {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore — gate will just re-show on next visit
  }
};

// Non-blocking: we let the user through regardless of API outcome.
const submitBetaEmail = async (email: string) => {
  await apiClient.post('titlesnap/beta/user/registration', { email });
};

interface BetaGateProps {
  children: ReactNode;
}

const BetaGate = ({ children }: BetaGateProps) => {
  const [granted, setGranted] = useState<boolean>(hasAccess);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (granted) {
    return <>{children}</>;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await submitBetaEmail(email.trim());
    } catch (err) {
      console.warn('[beta] submit failed, letting user through anyway', err);
    }
    setSuccess(true);
    grantAccess();
    window.setTimeout(() => {
      setGranted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col">
      <header className="px-6 py-6 sm:px-10">
        <img
          src="/img/logo-titlesnap-bg.png"
          alt="TitleSnap"
          className="h-10 w-auto"
        />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Private Beta
          </span>

          <h1 className="mt-8 text-4xl font-bold leading-tight sm:text-5xl">
            The movie starts on screen.
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
              The story begins with the title.
            </span>
          </h1>

          <p className="mt-6 text-base text-slate-300 sm:text-lg">
            TitleSnap is opening doors to a handful of early users.
            Drop your email and we'll let you in right away.
          </p>

          {success ? (
            <div className="mt-10 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-5 text-emerald-200">
              <p className="text-lg font-semibold">You're in. Welcome to TitleSnap.</p>
              <p className="mt-1 text-sm text-emerald-300/80">Redirecting you to the home page…</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label htmlFor="beta-email" className="sr-only">
                Email address
              </label>
              <input
                id="beta-email"
                type="email"
                required
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-base text-white placeholder-slate-400 backdrop-blur focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60 sm:px-8"
              >
                {submitting ? 'Sending…' : 'Request Access'}
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-slate-400">
            No spam. We'll only reach out about the beta.
          </p>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-slate-500 sm:px-10">
        © {new Date().getFullYear()} TitleSnap · Private beta
      </footer>
    </div>
  );
};

export default BetaGate;
