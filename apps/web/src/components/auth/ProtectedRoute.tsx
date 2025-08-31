import React, { useEffect, useCallback, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  createLoginUrl, 
  hasRoutePermission, 
  sanitizePathname,
  isSessionExpired,
  getLastActivity,
  updateLastActivity,
  clearAuthStorage
} from '../../utils/routeUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType;
  requiredRole?: 'admin' | 'manager' | 'operator';
  allowedRoles?: Array<'admin' | 'manager' | 'operator'>;
}

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "กำลังตรวจสอบสิทธิ์..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

const SessionExpiredState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-4">
        <svg 
          className="mx-auto h-12 w-12 text-yellow-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        เซสชันหมดอายุ
      </h2>
      <p className="text-gray-600 mb-4">
        เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่
      </p>
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        เข้าสู่ระบบใหม่
      </button>
    </div>
  </div>
);

const UnauthorizedState: React.FC<{ userRole?: string; requiredRole?: string }> = ({ 
  userRole, 
  requiredRole 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-4">
        <svg 
          className="mx-auto h-12 w-12 text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-7V6a3 3 0 00-3-3H6a3 3 0 00-3 3v3a3 3 0 003 3h3a3 3 0 003-3z" 
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        ไม่มีสิทธิ์เข้าถึง
      </h2>
      <p className="text-gray-600 mb-2">
        คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
      </p>
      {userRole && requiredRole && (
        <p className="text-sm text-gray-500 mb-4">
          สิทธิ์ปัจจุบัน: {userRole} | จำเป็นต้องมี: {requiredRole}
        </p>
      )}
      <button
        onClick={() => window.history.back()}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        ย้อนกลับ
      </button>
    </div>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackComponent: FallbackComponent,
  requiredRole,
  allowedRoles,
}) => {
  const { 
    user, 
    loading, 
    isAuthenticated,
    safeSignOut 
  } = useAuth();
  
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // Activity tracking and session management
  useEffect(() => {
    const checkSession = () => {
      if (isAuthenticated) {
        const lastActivity = getLastActivity();
        if (isSessionExpired(lastActivity ?? undefined)) {
          setShowSessionExpired(true);
          return;
        }
        updateLastActivity();
      }
      setSessionChecked(true);
    };

    checkSession();
  }, [isAuthenticated]);

  // Handle session expired retry
  const handleSessionExpiredRetry = useCallback(async () => {
    clearAuthStorage();
    await safeSignOut();
    setShowSessionExpired(false);
    
    // Create login URL with return URL
    const sanitizedPathname = sanitizePathname(location.pathname);
    const loginUrl = createLoginUrl(sanitizedPathname);
    window.location.href = loginUrl;
  }, [safeSignOut, location.pathname]);

  // Update activity on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => updateLastActivity();
    
    const events = ['click', 'keydown', 'scroll', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  // Show session expired screen
  if (showSessionExpired) {
    return <SessionExpiredState onRetry={handleSessionExpiredRetry} />;
  }

  // Show loading state while checking authentication or session
  if (loading || !sessionChecked) {
    return <LoadingState message="กำลังตรวจสอบสิทธิ์..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const sanitizedPathname = sanitizePathname(location.pathname);
    const loginUrl = createLoginUrl(sanitizedPathname);
    return <Navigate to={loginUrl} replace />;
  }

  // Check role-based permissions
  const userRole = user?.role;
  const currentPathname = location.pathname;

  // Check if user has route permission
  if (!hasRoutePermission(currentPathname, userRole || null)) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return (
      <UnauthorizedState 
        userRole={userRole} 
        requiredRole={requiredRole || allowedRoles?.join(', ')} 
      />
    );
  }

  // Additional role checks if specified
  if (requiredRole && userRole !== requiredRole) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return (
      <UnauthorizedState 
        userRole={userRole} 
        requiredRole={requiredRole} 
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(userRole as any)) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return (
      <UnauthorizedState 
        userRole={userRole} 
        requiredRole={allowedRoles.join(', ')} 
      />
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;