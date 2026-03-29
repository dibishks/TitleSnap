import { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

/**
 * Custom Auth Hook
 * Provides typed authentication helpers and methods.
 */
export const useAuth = () => useContext(AuthContext);
