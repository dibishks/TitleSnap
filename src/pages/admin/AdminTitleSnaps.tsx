import { useState } from 'react';
import Pagination from '../../components/admin/Pagination';
import { useAdminList } from '../../hooks/useAdminList';
import { useSeo } from '../../hooks/useSeo';
import {
  PageHeader,
  TableShell,
  formatDateTime,
  formatUnixSecondsDate,
} from './adminUtils';

interface SnapUser {
  id: string;
  google_sub?: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface SnapMovie {
  movie_id: string;
  name?: string;
  image?: string;
  genres?: string[];
  censor?: string;
  release_date?: string;
  movie_variants?: Array<{ language: string; format: string }>;
}

interface AdminSnap {
  id: string;
  movie_id: string;
  user_id: string;
  image_url: string;
  image_key?: string;
  thumbnail_url?: string;
  status?: string;
  user?: SnapUser;
  movie?: SnapMovie;
  created_at?: string;
  updated_at?: string;
}

const Thumbnail = ({ snap }: { snap: AdminSnap }) => {
  const [failed, setFailed] = useState(false);
  // thumbnail_url comes back as "" sometimes — fall back to the full image.
  const src = snap.thumbnail_url || snap.image_url;
  if (!src || failed) {
    return (
      <div className="flex h-14 w-24 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        No image
      </div>
    );
  }
  return (
    <a
      href={snap.image_url || src}
      target="_blank"
      rel="noreferrer"
      title="Open full size"
    >
      <img
        src={src}
        alt="snap"
        className="h-14 w-24 flex-shrink-0 rounded-md object-cover ring-1 ring-slate-200 transition hover:ring-blue-400 dark:ring-slate-700"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </a>
  );
};

const StatusPill = ({ status }: { status?: string }) => {
  const s = (status || '').toLowerCase();
  let cls = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  if (s === 'approved' || s === 'active' || s === 'published') {
    cls = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  } else if (s === 'pending' || s === 'review') {
    cls = 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  } else if (s === 'rejected' || s === 'deleted' || s === 'blocked') {
    cls = 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cls}`}
    >
      {status || '—'}
    </span>
  );
};

const AdminTitleSnaps = () => {
  useSeo({
    title: 'TitleSnaps · Admin | TitleSnap',
    description: 'Uploaded TitleSnaps moderation.',
    canonicalPath: '/admin/titlesnaps',
    robots: 'noindex, nofollow',
  });

  const { data, pagination, loading, error, page, setPage, setLimit } =
    useAdminList<AdminSnap>('titlesnap/admin/titlesnaps');

  return (
    <div>
      <PageHeader
        title="TitleSnaps"
        subtitle="User-uploaded title cards with uploader and movie context."
        total={pagination?.total ?? null}
      />

      <TableShell
        loading={loading}
        error={error}
        empty={!loading && data.length === 0}
        emptyLabel="No TitleSnaps uploaded yet."
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
              <th className="px-4 py-3">Snap</th>
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Uploader</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Uploaded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            {data.map((snap) => {
              const uploader = snap.user;
              const movie = snap.movie;
              return (
                <tr
                  key={snap.id}
                  className="align-top transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">
                    <Thumbnail snap={snap} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {movie?.image && (
                        <img
                          src={movie.image}
                          alt={movie.name || ''}
                          className="h-14 w-10 flex-shrink-0 rounded object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="truncate font-medium text-slate-900 dark:text-white">
                          {movie?.name || '—'}
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          {movie?.censor && (
                            <span className="rounded border border-slate-300 px-1 py-0.5 text-[10px] font-semibold tracking-wide text-slate-600 dark:border-slate-600 dark:text-slate-300">
                              {movie.censor}
                            </span>
                          )}
                          {movie?.release_date && (
                            <span>{formatUnixSecondsDate(movie.release_date)}</span>
                          )}
                        </div>
                        {movie?.genres && movie.genres.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {movie.genres.slice(0, 3).map((g) => (
                              <span
                                key={g}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-slate-900 dark:text-white">
                        {uploader?.name || '—'}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {uploader?.email || (
                          <span className="font-mono">{snap.user_id}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <StatusPill status={snap.status} />
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDateTime(snap.created_at)}
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

export default AdminTitleSnaps;
