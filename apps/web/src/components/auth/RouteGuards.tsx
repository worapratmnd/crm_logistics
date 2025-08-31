import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  isProtectedRoute,
  validateReturnUrl,
  createLoginUrl,
  sanitizePathname,
  updateLastActivity,
  clearAuthStorage
} from '../../utils/routeUtils';

interface RouteGuardsProps {
  children: React.ReactNode;
}

export const RouteGuards: React.FC<RouteGuardsProps> = ({ children }) => {
  const { isAuthenticated, loading, safeSignOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation guards
  const handleNavigationGuard = useCallback(async () => {
    const currentPath = sanitizePathname(location.pathname);
    
    // Skip checks while loading
    if (loading) return;
    
    // Handle authenticated user on login page
    if (isAuthenticated && currentPath === '/login') {
      // Check for return URL
      const urlParams = new URLSearchParams(location.search);
      const returnUrl = urlParams.get('returnUrl');
      const validReturnUrl = validateReturnUrl(returnUrl);
      
      if (validReturnUrl) {
        navigate(validReturnUrl, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    
    // Handle unauthenticated user on protected routes
    if (!isAuthenticated && isProtectedRoute(currentPath)) {
      const loginUrl = createLoginUrl(currentPath);
      navigate(loginUrl, { replace: true });
      return;
    }
    
    // Update activity for authenticated users
    if (isAuthenticated) {
      updateLastActivity();
    }
  }, [isAuthenticated, loading, location, navigate]);

  // Run navigation guard on location change
  useEffect(() => {
    handleNavigationGuard();
  }, [handleNavigationGuard]);

  // Handle authentication state changes
  useEffect(() => {
    if (!loading && !isAuthenticated && isProtectedRoute(location.pathname)) {
      const loginUrl = createLoginUrl(location.pathname);
      navigate(loginUrl, { replace: true });
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  // Handle browser navigation events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent navigation to protected routes when not authenticated
      const targetPath = window.location.pathname;
      
      if (!isAuthenticated && isProtectedRoute(targetPath)) {
        event.preventDefault();
        const loginUrl = createLoginUrl(targetPath);
        window.history.replaceState(null, '', loginUrl);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated]);

  // Handle tab visibility changes for security
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Update activity when tab becomes visible
        updateLastActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Handle beforeunload for cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        updateLastActivity();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated]);

  // Cross-tab authentication synchronization
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleStorageChange = async (event: StorageEvent) => {
      // Handle logout from another tab
      if (event.key === 'auth_logout' && event.newValue) {
        clearAuthStorage();
        await safeSignOut();
        navigate('/login', { replace: true });
      }
      
      // Handle activity sync from other tabs
      if (event.key === 'lastActivity' && event.newValue) {
        // Update local state if needed
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, navigate, safeSignOut]);

  // Programmatic navigation security wrapper
  const secureNavigate = useCallback((to: string, options?: any) => {
    const sanitizedPath = sanitizePathname(to);
    
    // Check if user has permission to navigate to this route
    if (!isAuthenticated && isProtectedRoute(sanitizedPath)) {
      const loginUrl = createLoginUrl(sanitizedPath);
      navigate(loginUrl, { replace: true });
      return;
    }
    
    navigate(sanitizedPath, options);
  }, [isAuthenticated, navigate]);

  // Provide secure navigation to child components through context if needed
  const guardedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // Could inject secure navigation function if needed
        secureNavigate,
      } as any);
    }
    return child;
  });

  return <>{guardedChildren}</>;
};

// Higher-order component for adding route guards to specific components
export const withRouteGuards = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const GuardedComponent: React.FC<P> = (props) => (
    <RouteGuards>
      <WrappedComponent {...props} />
    </RouteGuards>
  );
  
  GuardedComponent.displayName = `withRouteGuards(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return GuardedComponent;
};

export default RouteGuards;