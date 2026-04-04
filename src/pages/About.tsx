import React from 'react';
import { useSeo } from '../hooks/useSeo';

const platformHighlights = [
  'Discover movies currently playing in theatres',
  'Download high-quality movie title snaps',
  'Share your own captured movie moments with the community',
  'Use ready-made title snaps for WhatsApp status and Instagram stories',
];

const missionPoints = [
  'Preserve the theatre experience',
  'Provide high-quality title snaps for everyone',
  'Build a community of movie enthusiasts',
];

const reasonsToChoose = [
  'No more missing the title screen',
  'No phone distractions in theatres',
  'High-quality snaps shared by real users',
  'Ready-to-share images for social media',
];

const cardClassName =
  'rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800';

const listItemClassName = 'flex gap-3 text-base leading-7 text-gray-600 dark:text-gray-300';

const About: React.FC = () => {
  useSeo({
    title: 'About Us | TitleSnap',
    description:
      'Learn about TitleSnap, a community-driven platform built for movie lovers who want to preserve the theatre experience while sharing high-quality title snaps.',
    keywords:
      'About TitleSnap, movie title snaps, theatre experience, movie lovers community, title screen sharing',
    canonicalPath: '/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About TitleSnap',
      url: `${window.location.origin}/about`,
      description:
        'About page for TitleSnap, a community-driven platform for discovering and sharing movie title snaps while preserving the theatre experience.',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            About Us
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for people who value the theatre experience
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            TitleSnap is a platform for movie lovers who want to stay fully present during a film
            while still enjoying the joy of sharing that memorable title screen moment.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            We believe movies are meant to be experienced without distraction. No glowing screens,
            no missed scenes, and no interruption to the people around you. TitleSnap exists to
            make sharing possible without taking away from the cinema itself.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Who We Are
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              A community-first platform for movie moments
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We understand the excitement of capturing and sharing the title reveal that marks the
              beginning of a movie experience. Instead of encouraging people to reach for their
              phones inside theatres, TitleSnap creates a better alternative through a shared
              library of title moments contributed by the community.
            </p>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              The result is a space where movie fans can enjoy the moment, revisit it later, and
              share it with others in a more thoughtful way.
            </p>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              What We Do
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              Making title snaps easier to discover and share
            </h2>
            <ul className="mt-6 space-y-4">
              {platformHighlights.map((item) => (
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
              Our Mission
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              Protect the experience while keeping the joy of sharing alive
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              Our goal is to remove the need for taking photos inside theatres while still giving
              movie fans access to high-quality title snaps they can enjoy and share later.
            </p>
            <ul className="mt-6 space-y-4">
              {missionPoints.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Why TitleSnap
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              A more respectful way to preserve movie moments
            </h2>
            <ul className="mt-6 space-y-4">
              {reasonsToChoose.map((item) => (
                <li key={item} className={listItemClassName}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Core Idea
              </p>
              <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">
                No mobile distractions and high-quality status updates.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className={cardClassName}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Our Vision
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
              Becoming the go-to platform for shared movie moments
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
              We want TitleSnap to become the place people rely on for movie moments. Starting with
              title snaps, we plan to grow into a broader platform where users can explore movies,
              theatres, and community-driven experiences in one place.
            </p>
          </section>

          <section className="rounded-[2rem] bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 px-8 py-10 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Our Belief
            </p>
            <blockquote className="mt-4 text-2xl font-semibold leading-10 sm:text-3xl">
              The best way to enjoy a movie is to stay in the moment.
            </blockquote>
            <p className="mt-5 max-w-md text-base leading-7 text-white/80">
              Every decision behind TitleSnap starts with that principle.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
