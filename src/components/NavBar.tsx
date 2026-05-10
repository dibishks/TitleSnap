import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import type { CitiesResponse, CityLocationItem } from '../types/location';
import GlobalSearchBox from './GlobalSearchBox';

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
  const [popularCities, setPopularCities] = useState<CityLocationItem[]>([]);
  const { isAuthenticated } = useAuth();
  const { setSelectedLocation } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularCities = async () => {
      try {
        const response = await apiClient.get<CitiesResponse>('titlesnap/states', {
          params: { is_popular_city: true },
        });

        const uniqueCities = Array.from(
          new Map(
            (response.data || [])
              .filter((item) => item.city_id && item.city_name)
              .map((item) => [item.city_id, item])
          ).values()
        ).sort((left, right) => left.city_name.localeCompare(right.city_name));

        setPopularCities(uniqueCities);
      } catch (error) {
        if (!(error instanceof ApiError)) {
          console.error('Failed to fetch popular cities', error);
        }
        setPopularCities([]);
      }
    };

    void fetchPopularCities();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const moviesSubItems =
    popularCities.length > 0
      ? popularCities.map((city) => ({
          label: city.city_name,
          url: '/',
          onClick: () => {
            setSelectedLocation(city);
            navigate('/');
          },
        }))
      : [];

  const theatresSubItems =
    popularCities.length > 0
      ? popularCities.map((city) => ({
          label: city.city_name,
          url: `/theatres?location=${encodeURIComponent(city.city_key || city.cleaned_city_name || city.city_name)}`,
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
