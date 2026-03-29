/**
 * Navigation Types
 */

export interface SubMenuItem {
  label: string;
  url: string;
}

export interface MenuItem {
  label: string;
  url?: string;
  subItems?: SubMenuItem[];
}

export interface NavBarProps {
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

