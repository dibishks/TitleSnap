import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderSliderProps {
  cityName?: string;
}

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  accentClassName: string;
}

const AUTOPLAY_DELAY = 5000;

const HeaderSlider = ({ cityName }: HeaderSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: Slide[] = [
    {
      id: 'titlesnap',
      eyebrow: 'TitleSnap',
      title: 'Capture the title moment without missing the movie',
      description:
        'A community-powered place to discover movie title snaps, download HD title cards, and share the moment without disturbing anyone in the theatre.',
      points: [
        'Movie title snaps in one place',
        'HD images for status and stories',
        'Community uploads from real movie lovers',
      ],
      ctaLabel: 'Explore Title Snaps',
      ctaHref: '/movies',
      secondaryLabel: 'How It Works',
      secondaryHref: '/about',
      accentClassName: 'from-violet-500/40 via-fuchsia-500/18 to-transparent',
    },
    {
      id: 'offers',
      eyebrow: 'Offers',
      title: 'Snap. Share. Win.',
      description:
        'Upload your movie title snap and win your favorite movie ticket every month!',
      points: [
        'Perfect for promotions and offers',
        'Works for contests or campaign banners',
        'Simple content area you can update anytime',
      ],
      ctaLabel: 'View Contests',
      ctaHref: '/contests',
      secondaryLabel: 'Contact Us',
      secondaryHref: '/contact',
      accentClassName: 'from-purple-500/35 via-violet-500/18 to-transparent',
    },
    {
      id: 'streaming',
      eyebrow: 'Latest Streaming Movies',
      title: cityName
        ? `Trending streaming picks for ${cityName}`
        : 'Discover the latest streaming movies',
      description:
        'Keep this slide ready for upcoming OTT highlights, title-card collections, and shareable movie moments from the newest streaming releases.',
      points: [
        'Space for new OTT releases',
        'Streaming highlights and title images',
        'Easy swap for final poster artwork later',
      ],
      ctaLabel: 'Browse Movies',
      ctaHref: '/movies',
      secondaryLabel: 'Latest Releases',
      secondaryHref: '/movies',
      accentClassName: 'from-violet-500/38 via-purple-500/18 to-transparent',
    },
  ];

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(76,29,149,0.34),_transparent_42%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div
          className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_24px_80px_rgba(76,29,149,0.35)] backdrop-blur-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <article
                key={slide.id}
                className="relative min-w-full overflow-hidden px-6 py-8 sm:px-8 md:px-10 md:py-12"
                aria-hidden={index !== activeIndex}
              >
                <div
                  className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l ${slide.accentClassName}`}
                />
                <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-end">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/60">
                      {slide.eyebrow}
                    </p>
                    {index === 0 ? (
                      <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>
                    ) : (
                      <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h2>
                    )}
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={slide.ctaHref}
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
                      >
                        {slide.ctaLabel}
                      </Link>
                      <Link
                        to={slide.secondaryHref}
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5 shadow-2xl">
                      <div className="space-y-3">
                        {slide.points.map((point) => (
                          <div
                            key={point}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                          >
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/35 hover:bg-white/60'
                }`}
                aria-label={`Go to ${slide.eyebrow} slide`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
              }
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Previous slide"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Next slide"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderSlider;
