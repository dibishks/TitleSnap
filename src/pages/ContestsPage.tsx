import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

const howItWorks = [
  'Upload a movie title snap on TitleSnap.',
  'Our team reviews all eligible uploads submitted during the month.',
  'One qualifying snap is selected every month.',
  'The selected participant receives one complimentary movie ticket.',
];

const prizeDetails = [
  'One movie ticket with a maximum value of Rs. 250.',
  'Movie selection of your choice, subject to availability.',
  'Theatre preference based on availability in your location.',
];

const deliverySteps = [
  'The winner is contacted through email.',
  'Our team coordinates the movie and theatre preference.',
  'A digital ticket is sent to the registered email address.',
];

const terms = [
  'All uploaded images are manually reviewed before final selection.',
  'The maximum ticket value is limited to Rs. 250.',
  'Winner selection is final and based on internal review.',
  'The selected user must coordinate with the TitleSnap team for movie and theatre confirmation.',
  'The ticket is issued only through email.',
];

const restrictions = [
  'No cancellations are allowed after the ticket is issued.',
  'Only a one-time ticket delivery is provided.',
  'Seat selection depends on theatre availability.',
  'TitleSnap is not responsible if the selected movie is unavailable or no longer showing.',
];

const submissionGuidelines = [
  'Clear and high-quality image',
  'Relevant to the movie title moment',
  'Original and genuine submission',
];

const cardClassName =
  'rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800';

const listItemClassName = 'flex gap-3 text-base leading-7 text-gray-600 dark:text-gray-300';

const ContestsPage: React.FC = () => {
  const { slug } = useParams();
  const canonicalPath = slug ? `/contests/${slug}` : '/contests';

  useSeo({
    title: 'Title Snap Giveaway | TitleSnap',
    description:
      'Join the TitleSnap monthly giveaway for a chance to win a complimentary movie ticket by uploading your best movie title snap.',
    keywords:
      'TitleSnap giveaway, movie ticket giveaway, title snap contest, monthly contest, free movie ticket',
    canonicalPath,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'Title Snap Giveaway',
      description:
        'Monthly TitleSnap community giveaway where one selected participant receives a complimentary movie ticket after review of eligible title snap uploads.',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      organizer: {
        '@type': 'Organization',
        name: 'TitleSnap',
      },
      url: `${window.location.origin}${canonicalPath}`,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Monthly Contest
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Win a Free Movie Ticket Every Month
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            Upload your best movie title snap and stand a chance to watch your next movie at no
            cost. Every month, TitleSnap selects one winner from eligible community submissions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              One winner every month
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              Complimentary ticket up to Rs. 250
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2">
              Digital delivery by email
            </span>
          </div>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Overview
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              Turn your snap into a movie experience
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              The Title Snap Giveaway is designed to reward contributors who share standout title
              moments with the community. A single submission can become your entry for the monthly
              selection, provided it meets our review standards.
            </p>

            <div className="mt-8 rounded-3xl bg-slate-100 p-6 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Selection Note
              </p>
              <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">
                Selection is based on submission quality, relevance, and compliance with TitleSnap
                review guidelines.
              </p>
            </div>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              What You Win
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              Prize details
            </h2>
            <ul className="mt-6 space-y-4">
              {prizeDetails.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              How It Works
            </p>
            <ol className="mt-6 space-y-4">
              {howItWorks.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-base leading-7 text-gray-600 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Ticket Delivery
            </p>
            <ul className="mt-6 space-y-4">
              {deliverySteps.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Submission Standards
            </p>
            <ul className="mt-6 space-y-4">
              {submissionGuidelines.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Terms And Conditions
            </p>
            <ul className="mt-6 space-y-4">
              {terms.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Restrictions
            </p>
            <ul className="mt-6 space-y-4">
              {restrictions.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Participate
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                Upload your snap and be the next winner
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                Explore movie pages, upload an eligible title snap, and take part in the monthly
                selection. For contest-related questions, contact the TitleSnap team directly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/movies"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Explore Movies
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
              >
                Contact TitleSnap
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContestsPage;
