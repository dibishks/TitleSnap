import React from 'react';
import { useSeo } from '../hooks/useSeo';

const informationCollected = [
  'Name, if you choose to provide it',
  'Email address for account creation, support, or contact',
  'Profile details when user accounts are enabled',
  'Pages visited, downloads, and uploads',
  'Device, browser, and IP address information for security and analytics',
  'Uploaded images, including movie title snaps and related metadata',
];

const usagePurposes = [
  'Provide, maintain, and improve TitleSnap',
  'Enable image uploads and downloads on the platform',
  'Personalize the user experience',
  'Monitor platform performance, reliability, and security',
  'Respond to user questions and support requests',
];

const cookiePurposes = [
  'Improve website performance',
  'Analyze traffic and usage patterns',
  'Enhance overall user experience',
];

const thirdPartyExamples = ['analytics', 'hosting', 'other infrastructure providers'];

const sectionClassName =
  'rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800';

const PrivacyPolicy: React.FC = () => {
  useSeo({
    title: 'Privacy Policy | TitleSnap',
    description:
      'Read the TitleSnap Privacy Policy to understand what information we collect, how we use it, and how we protect your data.',
    keywords:
      'TitleSnap privacy policy, privacy policy, data protection, uploaded image privacy, cookies policy',
    canonicalPath: '/privacy-policy',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Privacy Policy',
      url: `${window.location.origin}/privacy-policy`,
      description:
        'Privacy Policy for TitleSnap covering data collection, use, cookies, third-party services, and contact information.',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-950 px-8 py-12 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            TitleSnap
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            Welcome to TitleSnap. Your privacy is important to us. This Privacy Policy explains
            how we collect, use, and protect your information when you use our platform.
          </p>
          <p className="mt-6 text-sm text-slate-300">Effective Date: April 3, 2026</p>
        </header>

        <div className="mt-10 space-y-6">
          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We may collect the following categories of information when you use TitleSnap:
            </p>
            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300">
              {informationCollected.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We use the information we collect to operate and improve the platform, including to:
            </p>
            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300">
              {usagePurposes.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              3. Data Protection
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>
                We take reasonable security measures to protect your information. However, no
                method of transmission over the internet or electronic storage is completely
                secure.
              </p>
              <p>We do not sell your personal data.</p>
              <p>We do not share sensitive data with third parties without your consent.</p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">4. Cookies</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We may use cookies and similar technologies to:
            </p>
            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300">
              {cookiePurposes.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
              You can manage or disable cookies through your browser settings.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              5. Third-Party Services
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We may use trusted third-party services, such as {thirdPartyExamples.join(', ')}, to
              help operate TitleSnap. Those providers may collect limited information in accordance
              with their own privacy policies.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              6. Content Ownership
            </h2>
            <div className="mt-4 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              <p>Users retain ownership of the images they upload.</p>
              <p>
                By uploading content to TitleSnap, you grant us a non-exclusive, worldwide license
                to display and distribute that content on the platform.
              </p>
            </div>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              7. Policy Updates
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with the revised effective date where applicable.
            </p>
          </section>

          <section className={sectionClassName}>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">8. Contact Us</h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              If you have any privacy-related questions, please contact us at{' '}
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
              Your trust matters. We are committed to keeping your data safe and your experience
              smooth.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
