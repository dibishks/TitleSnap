/**
 * Navigation Types
 */

export interface SubMenuItem {
  label: string;
  url: string;
  onClick?: () => void;
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
