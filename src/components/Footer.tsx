import React from 'react';
import { Link } from 'react-router-dom';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.38-1.88a1.12 1.12 0 1 1 0 2.24 1.12 1.12 0 0 1 0-2.24Z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8.25h2.77l.42-3.22H13.5V8.47c0-.94.26-1.57 1.6-1.57h1.72V4.02c-.3-.04-1.33-.12-2.53-.12-2.5 0-4.22 1.53-4.22 4.35v2.28H7.25v3.22h2.82V22h3.43Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.27l-4.91-6.46L6.36 22H3.25l7.25-8.28L.8 2h6.43l4.43 5.84L18.9 2Zm-1.1 18h1.73L6.28 3.9H4.43L17.8 20Z" />
      </svg>
    ),
  },
];

const footerLinks = [
  { label: 'All Title Snaps', to: '/titlesnaps' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms and Conditions', to: '/terms-and-conditions' },
  { label: 'Contact Us', to: '/contact' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/75 text-white backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center" aria-label="TitleSnap Home">
              <img
                src="/img/logo-titlesnap-bg.png"
                alt="TitleSnap"
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Discover movie title snaps, download HD title images, and explore the latest
              cinema moments without disturbing the theatre experience.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start lg:gap-12">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
                Explore
              </h2>
              <nav className="mt-4 flex flex-col gap-3 text-sm">
                {footerLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-white/80 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
                Follow
              </h2>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} TitleSnap. All rights reserved.</p>
          <p>The movie starts on screen, but the story begins with the title.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
