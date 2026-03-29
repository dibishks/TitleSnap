interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * HamburgerMenu Component
 * Animated hamburger icon for mobile menu toggle
 */
const HamburgerMenu = ({ isOpen, onClick }: HamburgerMenuProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      aria-expanded={isOpen}
      aria-label="Toggle navigation menu"
      aria-controls="mobile-menu"
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      
      {/* Animated Hamburger Icon */}
      <div className="w-6 h-5 flex flex-col justify-between">
        <span
          className={`block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-current transform transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </div>
    </button>
  );
};

export default HamburgerMenu;

