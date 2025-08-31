import { UserRole } from '../../../../packages/shared/types';

// Configuration for route protection
export const PROTECTED_ROUTES = [
  '/',
  '/customers',
  '/jobs',
  '/dashboard',
] as const;

export const PUBLIC_ROUTES = [
  '/login',
] as const;

// Return URL validation - whitelist approach for security
const ALLOWED_RETURN_URL_PATTERNS = [
  /^\/$/,                    // Dashboard root
  /^\/customers$/,           // Customers page
  /^\/jobs$/,               // Jobs page
  /^\/dashboard$/,          // Explicit dashboard
  /^\/customers\/[a-zA-Z0-9-]+$/, // Customer details (if implemented later)
  /^\/jobs\/[a-zA-Z0-9-]+$/,     // Job details (if implemented later)
];

export interface RouteProtectionConfig {
  requireAuth: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  preserveReturnUrl?: boolean;
}

// Route configuration map
export const ROUTE_CONFIG: Record<string, RouteProtectionConfig> = {
  '/login': {
    requireAuth: false,
    redirectTo: '/', // Redirect authenticated users away from login
  },
  '/': {
    requireAuth: true,
    allowedRoles: ['admin', 'manager', 'operator'],
    preserveReturnUrl: true,
  },
  '/customers': {
    requireAuth: true,
    allowedRoles: ['admin', 'manager', 'operator'],
    preserveReturnUrl: true,
  },
  '/jobs': {
    requireAuth: true,
    allowedRoles: ['admin', 'manager', 'operator'],
    preserveReturnUrl: true,
  },
};

/**
 * Validates and sanitizes return URL for security
 * @param returnUrl - The URL to validate
 * @returns Sanitized URL or null if invalid
 */
export const validateReturnUrl = (returnUrl: string | null): string | null => {
  if (!returnUrl) return null;
  
  try {
    // Parse URL to validate structure
    const url = new URL(returnUrl, window.location.origin);
    
    // Only allow same-origin URLs
    if (url.origin !== window.location.origin) {
      console.warn('Cross-origin return URL blocked:', returnUrl);
      return null;
    }
    
    // Check against allowed patterns
    const pathname = url.pathname;
    const isAllowed = ALLOWED_RETURN_URL_PATTERNS.some(pattern => 
      pattern.test(pathname)
    );
    
    if (!isAllowed) {
      console.warn('Return URL not in whitelist:', pathname);
      return null;
    }
    
    return pathname;
  } catch (error) {
    console.warn('Invalid return URL format:', returnUrl);
    return null;
  }
};

/**
 * Gets return URL from current location or search params
 */
export const getReturnUrl = (): string | null => {
  // Check URL search params first
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');
  
  if (returnUrl) {
    return validateReturnUrl(returnUrl);
  }
  
  // Use current pathname if it's a protected route
  const currentPath = window.location.pathname;
  if (PROTECTED_ROUTES.includes(currentPath as any)) {
    return validateReturnUrl(currentPath);
  }
  
  return null;
};

/**
 * Creates login URL with return URL parameter
 */
export const createLoginUrl = (returnUrl?: string): string => {
  const validatedReturnUrl = returnUrl ? validateReturnUrl(returnUrl) : getReturnUrl();
  
  if (validatedReturnUrl) {
    return `/login?returnUrl=${encodeURIComponent(validatedReturnUrl)}`;
  }
  
  return '/login';
};

/**
 * Checks if a route requires authentication
 */
export const isProtectedRoute = (pathname: string): boolean => {
  const config = ROUTE_CONFIG[pathname];
  return config ? config.requireAuth : PROTECTED_ROUTES.includes(pathname as any);
};

/**
 * Checks if a route is public (no authentication required)
 */
export const isPublicRoute = (pathname: string): boolean => {
  const config = ROUTE_CONFIG[pathname];
  return config ? !config.requireAuth : PUBLIC_ROUTES.includes(pathname as any);
};

/**
 * Checks if user has permission to access a route
 */
export const hasRoutePermission = (
  pathname: string, 
  userRole: UserRole | null
): boolean => {
  if (!userRole) return false;
  
  const config = ROUTE_CONFIG[pathname];
  if (!config) return true; // Default allow if no config
  
  if (!config.requireAuth) return true;
  if (!config.allowedRoles) return true; // Allow all authenticated users
  
  return config.allowedRoles.includes(userRole);
};

/**
 * Gets redirect destination for unauthorized access
 */
export const getUnauthorizedRedirect = (pathname: string): string => {
  const config = ROUTE_CONFIG[pathname];
  return config?.redirectTo || '/login';
};

/**
 * Sanitizes pathname to prevent XSS and path traversal
 */
export const sanitizePathname = (pathname: string): string => {
  return pathname
    .replace(/[<>'"]/g, '') // Remove potential XSS characters
    .replace(/\.\.+/g, '')  // Remove path traversal attempts
    .replace(/\/+/g, '/')   // Normalize multiple slashes
    .replace(/\/$/, '') || '/'; // Remove trailing slash except for root
};

/**
 * Checks if the current session should be considered expired
 * This could be extended with more sophisticated logic
 */
export const isSessionExpired = (lastActivity?: Date): boolean => {
  if (!lastActivity) return false;
  
  const now = new Date();
  const maxInactivity = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (now.getTime() - lastActivity.getTime()) > maxInactivity;
};

/**
 * Updates last activity timestamp in localStorage
 */
export const updateLastActivity = (): void => {
  try {
    localStorage.setItem('lastActivity', new Date().toISOString());
  } catch (error) {
    console.warn('Could not update last activity:', error);
  }
};

/**
 * Gets last activity timestamp from localStorage
 */
export const getLastActivity = (): Date | null => {
  try {
    const stored = localStorage.getItem('lastActivity');
    return stored ? new Date(stored) : null;
  } catch (error) {
    console.warn('Could not get last activity:', error);
    return null;
  }
};

/**
 * Clears stored authentication-related data
 */
export const clearAuthStorage = (): void => {
  try {
    localStorage.removeItem('lastActivity');
    // Add other auth-related storage cleanup as needed
  } catch (error) {
    console.warn('Could not clear auth storage:', error);
  }
};