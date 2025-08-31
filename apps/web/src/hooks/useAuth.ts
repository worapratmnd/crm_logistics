import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { User } from '../../../../packages/shared/types';
import { 
  hasRoutePermission,
  isProtectedRoute,
  isPublicRoute,
  validateReturnUrl,
  createLoginUrl,
  sanitizePathname,
  updateLastActivity,
  clearAuthStorage
} from '../utils/routeUtils';

// Extended hook with additional utilities and helper functions
export const useAuth = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to check if user has specific role or higher
  const hasRole = useCallback((requiredRole: User['role']): boolean => {
    if (!auth.user) return false;

    const roleHierarchy: Record<User['role'], number> = {
      'operator': 1,
      'manager': 2,
      'admin': 3,
    };

    const userRoleLevel = roleHierarchy[auth.user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  }, [auth.user]);

  // Helper to check if user can access a specific feature
  const canAccess = useCallback((feature: string): boolean => {
    if (!auth.user) return false;

    // Define feature permissions based on roles
    const permissions: Record<User['role'], string[]> = {
      'admin': [
        'users:create',
        'users:read',
        'users:update',
        'users:delete',
        'customers:create',
        'customers:read',
        'customers:update',
        'customers:delete',
        'jobs:create',
        'jobs:read',
        'jobs:update',
        'jobs:delete',
        'reports:read',
        'settings:read',
        'settings:update',
      ],
      'manager': [
        'customers:create',
        'customers:read',
        'customers:update',
        'customers:delete',
        'jobs:create',
        'jobs:read',
        'jobs:update',
        'jobs:delete',
        'reports:read',
        'users:read',
      ],
      'operator': [
        'customers:read',
        'customers:update',
        'jobs:read',
        'jobs:update',
      ],
    };

    const userPermissions = permissions[auth.user.role] || [];
    return userPermissions.includes(feature);
  }, [auth.user]);

  // Helper to get user display name
  const displayName = useMemo(() => {
    if (!auth.user) return '';
    return auth.user.name || auth.user.email || 'Unknown User';
  }, [auth.user]);

  // Helper to get user initials for avatar
  const initials = useMemo(() => {
    if (!auth.user) return '';
    const name = auth.user.name || auth.user.email;
    return name
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, [auth.user]);

  // Helper to get role display name in Thai
  const roleDisplayName = useMemo(() => {
    if (!auth.user) return '';
    
    const roleNames: Record<User['role'], string> = {
      'admin': 'ผู้ดูแลระบบ',
      'manager': 'ผู้จัดการ',
      'operator': 'พนักงานปฏิบัติการ',
    };

    return roleNames[auth.user.role] || 'ไม่ระบุ';
  }, [auth.user]);

  // Helper to check if current user is the same as provided user ID
  const isCurrentUser = useCallback((userId: string): boolean => {
    return auth.user?.id === userId;
  }, [auth.user]);

  // Helper to format user account age
  const accountAge = useMemo(() => {
    if (!auth.user) return '';
    
    const now = new Date();
    const created = auth.user.createdAt;
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'วันนี้';
    } else if (diffDays === 1) {
      return 'เมื่อวานนี้';
    } else if (diffDays < 30) {
      return `${diffDays} วันที่แล้ว`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} เดือนที่แล้ว`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ปีที่แล้ว`;
    }
  }, [auth.user]);

  // Helper to safely sign in with error handling
  const safeSignIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await auth.signIn({ email, password });
      return result;
    } catch (error) {
      console.error('Safe sign in error:', error);
      return {
        user: null,
        error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
      };
    }
  }, [auth]);

  // Helper to safely sign out with error handling
  const safeSignOut = useCallback(async () => {
    try {
      clearAuthStorage();
      await auth.signOut();
    } catch (error) {
      console.error('Safe sign out error:', error);
    }
  }, [auth]);

  // Route protection utilities
  const canAccessRoute = useCallback((pathname?: string): boolean => {
    const targetPath = pathname || location.pathname;
    return hasRoutePermission(targetPath, auth.user?.role || null);
  }, [auth.user?.role, location.pathname]);

  const canAccessCurrentRoute = useCallback((): boolean => {
    return canAccessRoute(location.pathname);
  }, [canAccessRoute, location.pathname]);

  const isCurrentRouteProtected = useCallback((): boolean => {
    return isProtectedRoute(location.pathname);
  }, [location.pathname]);

  const isCurrentRoutePublic = useCallback((): boolean => {
    return isPublicRoute(location.pathname);
  }, [location.pathname]);

  // Secure navigation with authentication checks
  const secureNavigate = useCallback((to: string, options?: any) => {
    const sanitizedPath = sanitizePathname(to);
    
    // Check authentication for protected routes
    if (!auth.isAuthenticated && isProtectedRoute(sanitizedPath)) {
      const loginUrl = createLoginUrl(sanitizedPath);
      navigate(loginUrl, { replace: true });
      return false;
    }
    
    // Check permissions
    if (!hasRoutePermission(sanitizedPath, auth.user?.role || null)) {
      console.warn('User does not have permission to access:', sanitizedPath);
      return false;
    }
    
    navigate(sanitizedPath, options);
    return true;
  }, [auth.isAuthenticated, auth.user?.role, navigate]);

  // Navigate to login with return URL
  const navigateToLogin = useCallback((returnUrl?: string) => {
    const loginUrl = createLoginUrl(returnUrl || location.pathname);
    navigate(loginUrl, { replace: true });
  }, [navigate, location.pathname]);

  // Navigate after successful login
  const navigateAfterLogin = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const returnUrl = urlParams.get('returnUrl');
    const validReturnUrl = validateReturnUrl(returnUrl);
    
    if (validReturnUrl) {
      navigate(validReturnUrl, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, location.search]);

  // Check if user should be redirected from current route
  const shouldRedirectFromCurrentRoute = useCallback((): { redirect: boolean; to: string } => {
    const currentPath = location.pathname;
    
    // Authenticated user on login page should be redirected
    if (auth.isAuthenticated && currentPath === '/login') {
      const urlParams = new URLSearchParams(location.search);
      const returnUrl = urlParams.get('returnUrl');
      const validReturnUrl = validateReturnUrl(returnUrl);
      
      return {
        redirect: true,
        to: validReturnUrl || '/'
      };
    }
    
    // Unauthenticated user on protected route should be redirected to login
    if (!auth.isAuthenticated && isProtectedRoute(currentPath)) {
      return {
        redirect: true,
        to: createLoginUrl(currentPath)
      };
    }
    
    return { redirect: false, to: '' };
  }, [auth.isAuthenticated, location]);

  // Update user activity
  const trackActivity = useCallback(() => {
    if (auth.isAuthenticated) {
      updateLastActivity();
    }
  }, [auth.isAuthenticated]);

  // Enhanced sign out with navigation
  const signOutAndRedirect = useCallback(async (redirectTo: string = '/login') => {
    try {
      clearAuthStorage();
      await auth.signOut();
      
      // Broadcast logout to other tabs
      try {
        localStorage.setItem('auth_logout', Date.now().toString());
        localStorage.removeItem('auth_logout'); // Clean up immediately
      } catch (error) {
        console.warn('Could not broadcast logout:', error);
      }
      
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Sign out and redirect error:', error);
      // Still navigate even if sign out failed
      navigate(redirectTo, { replace: true });
    }
  }, [auth, navigate]);

  return {
    // Original auth context
    ...auth,
    
    // Additional helpers
    hasRole,
    canAccess,
    displayName,
    initials,
    roleDisplayName,
    isCurrentUser,
    accountAge,
    safeSignIn,
    safeSignOut,
    
    // Route protection utilities
    canAccessRoute,
    canAccessCurrentRoute,
    isCurrentRouteProtected,
    isCurrentRoutePublic,
    secureNavigate,
    navigateToLogin,
    navigateAfterLogin,
    shouldRedirectFromCurrentRoute,
    trackActivity,
    signOutAndRedirect,
  };
};

export default useAuth;