import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuItem } from '../types/navigation';

interface NavItemProps {
  item: MenuItem;
  isMobile?: boolean;
  onItemClick?: () => void;
}

/**
 * NavItem Component
 * Reusable navigation item with optional submenu/dropdown
 */
const NavItem = ({ item, isMobile = false, onItemClick }: NavItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const hasSubItems = item.subItems && item.subItems.length > 0;

  // Check if current route is active
  const isActive = item.url === location.pathname;

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isMobile]);

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
    setIsDropdownOpen(false);
    setIsMobileSubmenuOpen(false);
  };

  // Desktop rendering
  if (!isMobile) {
    return (
      <div
        className="relative"
        ref={dropdownRef}
        onMouseEnter={() => hasSubItems && setIsDropdownOpen(true)}
        onMouseLeave={() => hasSubItems && setIsDropdownOpen(false)}
      >
        {hasSubItems ? (
          // Menu item with submenu
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <span>{item.label}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          // Simple link without submenu
          <Link
            to={item.url || '/'}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={handleItemClick}
          >
            {item.label}
          </Link>
        )}

        {/* Desktop Dropdown Menu */}
        {hasSubItems && isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
            {item.subItems?.map((subItem, index) => (
              <Link
                key={index}
                to={subItem.url}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={handleItemClick}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Mobile rendering
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {hasSubItems ? (
        // Menu item with submenu
        <>
          <button
            onClick={() => setIsMobileSubmenuOpen(!isMobileSubmenuOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium transition-colors ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-expanded={isMobileSubmenuOpen}
            aria-haspopup="true"
          >
            <span>{item.label}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isMobileSubmenuOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Mobile Submenu */}
          {isMobileSubmenuOpen && (
            <div className="bg-gray-50 dark:bg-gray-800/50 py-2">
              {item.subItems?.map((subItem, index) => (
                <Link
                  key={index}
                  to={subItem.url}
                  className="block px-8 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={handleItemClick}
                >
                  {subItem.label}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        // Simple link without submenu
        <Link
          to={item.url || '/'}
          className={`block px-4 py-3 text-base font-medium transition-colors ${
            isActive
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          onClick={handleItemClick}
        >
          {item.label}
        </Link>
      )}
    </div>
  );
};

export default NavItem;

