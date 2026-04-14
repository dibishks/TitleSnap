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
    label: 'Contests',
    url: '/contests',
    subItems: [
      { label: 'Title Snap Giveaway', url: '/contests/title-snap' },
    ],
  },
  {
    label: 'Title Snaps',
    url: '/titlesnaps',
  },
];

/**
 * NavBar Component
 * Main navigation bar with responsive design and Google sign-in integration
 */
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    ...baseMenuItems.slice(1),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {menuItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>

          {/* Right: Location + Auth (Desktop) */}
          <div className="hidden md:flex items-center">
            <LocationPicker />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Auth0LoginButton />
            )}
          </div>

          {/* Mobile: Hamburger Menu */}
          <div className="md:hidden">
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
