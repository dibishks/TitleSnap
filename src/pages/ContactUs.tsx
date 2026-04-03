import React from 'react';
import { useSeo } from '../hooks/useSeo';

const reasonsToReachOut = [
  'Report a problem or bug',
  'Suggest new features',
  'Collaboration or partnership inquiries',
  'Share your feedback',
];

const contactCardClassName =
  'rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800';

const inputClassName =
  'mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-slate-700/40';

const ContactUs: React.FC = () => {
  useSeo({
    title: 'Contact Us | TitleSnap',
    description:
      'Contact TitleSnap for feedback, bug reports, feature ideas, and partnership inquiries.',
    keywords:
      'TitleSnap contact, contact us, feedback, support email, bug report, feature request',
    canonicalPath: '/contact',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Us',
      url: `${window.location.origin}/contact`,
      description:
        'Contact page for TitleSnap with support email, address, and a message form for feedback and inquiries.',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-950 px-8 py-12 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Contact Us
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Let&apos;s Connect</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            Have a question, suggestion, or just want to say hi? We are always happy to hear from
            fellow movie lovers.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Whether it is feedback, feature ideas, or reporting an issue, we are here for you.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className={`${contactCardClassName} h-fit`}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Why Reach Out
            </h2>
            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300">
              {reasonsToReachOut.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h2>
              <div className="mt-5 space-y-5 text-base leading-7 text-gray-600 dark:text-gray-300">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <a
                    href="mailto:startupsevens@gmail.com"
                    className="mt-2 inline-block font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 dark:text-white dark:decoration-slate-500"
                  >
                    startupsevens@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                    Address
                  </p>
                  <address className="mt-2 not-italic">
                    MK Road
                    <br />
                    Kochi - 682305
                    <br />
                    Kerala, India
                  </address>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Response Time
              </h3>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">
                We usually respond within 24 to 48 hours.
              </p>
            </div>
          </section>

          <section className={contactCardClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              Fill out the form below and we will get back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-6" onSubmit={(event) => event.preventDefault()}>
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your name"
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-600 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  placeholder="Tell us how we can help"
                  className={`${inputClassName} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus:ring-slate-600"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
                Your feedback helps us build a better movie experience for everyone.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-100 px-8 py-8 dark:border-slate-700 dark:bg-slate-800/80">
          <p className="text-lg font-medium leading-8 text-slate-900 dark:text-white">
            Stay connected. Stay cinematic.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
