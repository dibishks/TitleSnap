import React from 'react';
import { useSeo } from '../hooks/useSeo';

const platformPurposes = [
  'Upload movie title snaps',
  'Browse and download images',
  'Discover movies and theatres',
];

const userContentConfirmations = [
  'You own the content or have permission to share it',
  'The content does not violate copyright, trademarks, or applicable laws',
  'The content is appropriate and not offensive',
];

const prohibitedUploads = [
  'Pirated or illegal content',
  'Harmful, abusive, or misleading material',
  'Content that violates intellectual property rights',
];

const prohibitedActivities = [
  'Spam or misuse the platform',
  'Attempt to hack, interfere with, or disrupt the service',
  'Use bots or automated scraping tools',
  'Upload fake or misleading content',
];

const liabilityItems = [
  'Content accuracy',
  'User-uploaded material',
  'Any losses resulting from platform use',
];

const sectionClassName =
  'rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800';

const bulletClassName = 'mt-6 space-y-3 text-gray-600 dark:text-gray-300';

const TermsAndConditions: React.FC = () => {
  useSeo({
    title: 'Terms and Conditions | TitleSnap',
    description:
      'Read the TitleSnap Terms and Conditions covering platform use, user content rules, prohibited activities, liability limits, and governing law.',
    keywords:
      'TitleSnap terms and conditions, terms of use, user content rules, platform rules, governing law',
    canonicalPath: '/terms-and-conditions',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms and Conditions',
      url: `${window.location.origin}/terms-and-conditions`,
      description:
        'Terms and Conditions for TitleSnap covering acceptable use, user responsibilities, content rules, liability, and contact information.',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-950 px-8 py-12 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            TitleSnap
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            By using TitleSnap, you agree to the following Terms and Conditions. Please read them
            carefully.
          </p>
          <p className="mt-6 text-sm text-slate-300">Effective Date: April 3, 2026</p>
        </header>

        <div className="mt-10 space-y-6">
          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>By accessing or using TitleSnap, you agree to comply with these terms.</p>
              <p>If you do not agree, please do not use the platform.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              2. Platform Purpose
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              TitleSnap is a community-driven platform that allows users to:
            </p>
            <ul className={bulletClassName}>
              {platformPurposes.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              3. User Content Rules
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              By uploading content, you confirm that:
            </p>
            <ul className={bulletClassName}>
              {userContentConfirmations.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base font-medium leading-7 text-gray-900 dark:text-white">
              You must not upload:
            </p>
            <ul className={bulletClassName}>
              {prohibitedUploads.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              4. Copyright and Responsibility
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>Users are fully responsible for the content they upload.</p>
              <p>TitleSnap is not liable for user-generated content.</p>
              <p>We reserve the right to remove any content without notice.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              5. Content Usage
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>Downloaded images are for personal use only.</p>
              <p>Commercial use without permission is not allowed.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              6. Prohibited Activities
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              You agree not to:
            </p>
            <ul className={bulletClassName}>
              {prohibitedActivities.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              7. Account Responsibility
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>If user accounts are enabled, you are responsible for maintaining account security.</p>
              <p>Any activity under your account is your responsibility.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              8. Service Availability
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>We may modify or discontinue features.</p>
              <p>We may perform maintenance without prior notice.</p>
              <p>We are not liable for downtime or service interruptions.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              9. Limitation of Liability
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              TitleSnap is provided on an &quot;as is&quot; basis.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We are not responsible for:
            </p>
            <ul className={bulletClassName}>
              {liabilityItems.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              10. Changes to Terms
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We may update these terms at any time. Your continued use of TitleSnap after changes
              are posted means you accept the updated terms.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              11. Governing Law
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              These terms are governed by the laws of India.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">12. Contact</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              If you have questions about these Terms and Conditions, please contact us at{' '}
              <a
                href="mailto:startupsevens@gmail.com"
                className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700 dark:text-white dark:decoration-slate-500"
              >
                startupsevens@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-100 px-8 py-8 dark:border-slate-700 dark:bg-slate-800/80">
            <p className="text-lg font-medium leading-8 text-slate-900 dark:text-white">
              Use responsibly. Share respectfully. Enjoy cinema the right way.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
