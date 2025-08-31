import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../../../../packages/shared/types';
import { authService, SignInData, SignUpData, AuthResponse } from '../services/auth';

interface AuthContextType {
  // State
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: { name?: string; role?: User['role'] }) => Promise<AuthResponse>;
  clearError: () => void;
  
  // Helpers
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange((user: User | null) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Clear error helper
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sign in function
  const signIn = useCallback(async (data: SignInData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signIn(data);
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      console.error('Sign in error:', error);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign up function
  const signUp = useCallback(async (data: SignUpData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signUp(data);
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'เกิดข้อผิดพลาดในการสร้างบัญชี กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      console.error('Sign up error:', error);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await authService.signOut();
      
      if (error) {
        setError(error);
      } else {
        setUser(null);
      }
    } catch (error) {
      const errorMessage = 'เกิดข้อผิดพลาดในการออกจากระบบ';
      setError(errorMessage);
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<{ error: string | null }> => {
    setError(null);
    
    try {
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน';
      setError(errorMessage);
      console.error('Reset password error:', error);
      return { error: errorMessage };
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (updates: { name?: string; role?: User['role'] }): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.updateProfile(updates);
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล';
      setError(errorMessage);
      console.error('Update profile error:', error);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isOperator = user?.role === 'operator';

  const value: AuthContextType = {
    // State
    user,
    loading,
    error,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
    
    // Helpers
    isAuthenticated,
    isAdmin,
    isManager,
    isOperator,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export context for testing
export { AuthContext };