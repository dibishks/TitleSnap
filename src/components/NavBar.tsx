import { useEffect, useState } from 'react';
import type { MenuItem } from '../types/navigation';
import Logo from './Logo';
import NavItem from './NavItem';
import HamburgerMenu from './HamburgerMenu';
import Auth0LoginButton from './auth/Auth0LoginButton';
import UserMenu from './auth/UserMenu';
import LocationPicker from './LocationPicker';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/LocationContext';
import { apiClient, ApiError } from '../services/api';
import type {
  PopularMoviesByStateItem,
  PopularMoviesByStateResponse,
} from '../types/film';
import type { TheatreItem, TheatresResponse } from '../types/theatre';
import GlobalSearchBox from './GlobalSearchBox';

const DEFAULT_MOVIES_STATE_NAME = 'Kerala';
const MOVIES_SUBMENU_LIMIT = 10;
const DEFAULT_THEATRES_CITY_KEY = 'thiruvananthapuram';
const THEATRES_SUBMENU_LIMIT = 10;

/**
 * Navigation Menu Data
 * Can be moved to a separate config file or fetched from API
 */
const baseMenuItems: MenuItem[] = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'Title Snap',
    subItems: [
      { label: 'Title Snap', url: '/titlesnaps' },
      { label: 'Contests', url: '/contests/title-snap' },
    ],
  },
];

/**
 * NavBar Component
 * Main navigation bar with responsive design and Google sign-in integration
 */
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [popularMovies, setPopularMovies] = useState<PopularMoviesByStateItem[]>([]);
  const [popularTheatres, setPopularTheatres] = useState<TheatreItem[]>([]);
  const { isAuthenticated } = useAuth();
  const { selectedLocation } = useLocation();

  const moviesStateName = selectedLocation?.state_name?.trim() || DEFAULT_MOVIES_STATE_NAME;
  const theatresCityKey =
    selectedLocation?.city_key?.trim() ||
    selectedLocation?.cleaned_city_name?.trim() ||
    DEFAULT_THEATRES_CITY_KEY;

  useEffect(() => {
    let cancelled = false;

    const fetchPopularTheatres = async () => {
      try {
        const response = await apiClient.get<TheatresResponse>('titlesnap/theatres', {
          params: {
            city_key: theatresCityKey,
            page: 1,
            limit: THEATRES_SUBMENU_LIMIT,
          },
        });

        if (cancelled) {
          return;
        }

        const theatres = (response.data?.theatres || []).filter(
          (theatre) => theatre.theatre_id && theatre.name
        );

        setPopularTheatres(theatres);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (!(error instanceof ApiError)) {
          console.error('Failed to fetch popular theatres', error);
        }
        setPopularTheatres([]);
      }
    };

    void fetchPopularTheatres();

    return () => {
      cancelled = true;
    };
  }, [theatresCityKey]);

  useEffect(() => {
    let cancelled = false;

    const fetchPopularMovies = async () => {
      try {
        const response = await apiClient.get<PopularMoviesByStateResponse>(
          'titlesnap/movies',
          {
            params: {
              state_name: moviesStateName,
              page: 1,
              limit: MOVIES_SUBMENU_LIMIT,
            },
          }
        );

        if (cancelled) {
          return;
        }

        const movies = (response.data?.movies || []).filter(
          (movie) => movie.movie_id && movie.name
        );

        setPopularMovies(movies);
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (!(error instanceof ApiError)) {
          console.error('Failed to fetch popular movies', error);
        }
        setPopularMovies([]);
      }
    };

    void fetchPopularMovies();

    return () => {
      cancelled = true;
    };
  }, [moviesStateName]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const moviesSubItems =
    popularMovies.length > 0
      ? popularMovies.map((movie) => ({
          label: movie.name,
          url: `/movies/${movie.movie_id}`,
        }))
      : [];

  const theatresSubItems =
    popularTheatres.length > 0
      ? popularTheatres.map((theatre) => ({
          label: theatre.name,
          url: `/theatres/${theatre.theatre_id}`,
        }))
      : [];

  const menuItems: MenuItem[] = [
    baseMenuItems[0],
    {
      label: 'Movies',
      subItems: moviesSubItems,
    },
    {
      label: 'Theatres',
      subItems: theatresSubItems,
    },
    {
      label: 'OTT Streaming',
      url: '/ott-movies',
    },
    ...baseMenuItems.slice(1),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-6 py-4">
          <div className="flex-shrink-0 pt-1">
            <Logo />
          </div>

          <div className="min-w-0">
            <div className="flex items-center justify-center space-x-1">
              {menuItems.map((item, index) => (
                <NavItem key={index} item={item} />
              ))}
            </div>
            <div className="mt-3">
              <GlobalSearchBox
                value={searchInput}
                onChange={setSearchInput}
                inputId="header-global-search"
                placeholder="Search theatres, movies, or OTT titles"
                className="w-full"
                inputClassName="bg-stone-50 dark:bg-gray-950"
              />
            </div>
          </div>

          <div className="flex items-center pt-1">
            <LocationPicker />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Auth0LoginButton />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-4 md:hidden">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div>
            <HamburgerMenu isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="py-2">
          <div className="px-4 pb-2 pt-3">
            <GlobalSearchBox
              value={searchInput}
              onChange={setSearchInput}
              inputId="mobile-header-global-search"
              placeholder="Search theatres, movies, or OTT titles"
              className="w-full"
              onItemSelect={closeMobileMenu}
            />
          </div>

          {/* Mobile Menu Items */}
          {menuItems.map((item, index) => (
            <NavItem key={index} item={item} isMobile onItemClick={closeMobileMenu} />
          ))}

          <LocationPicker isMobile />

          {/* Mobile Auth Button */}
          <div className="px-4 py-4">
            {isAuthenticated ? (
              <UserMenu isMobile />
            ) : (
              <Auth0LoginButton isMobile />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
