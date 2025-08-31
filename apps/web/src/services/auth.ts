import { supabase } from '../lib/supabase';
import type { User } from '../../../../packages/shared/types';
import type { AuthError, User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'operator';
}

// Thai error messages mapping
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'Email not confirmed': 'กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ',
  'User not found': 'ไม่พบบัญชีผู้ใช้นี้ในระบบ',
  'Invalid email': 'รูปแบบอีเมลไม่ถูกต้อง',
  'Password should be at least 6 characters': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
  'Network error': 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  'Signup disabled': 'การสมัครสมาชิกถูกปิดใช้งานชั่วคราว',
  'Too many requests': 'มีการร้องขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
  'Email already exists': 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น',
  'Weak password': 'รหัสผ่านไม่ปลอดภัยพอ กรุณาใช้รหัสผ่านที่แข็งแกร่งกว่านี้',
};

// Helper function to convert Supabase user to our User type
const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || supabaseUser.email || '',
  role: (supabaseUser.user_metadata?.role as User['role']) || 'operator',
  createdAt: new Date(supabaseUser.created_at),
  updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
});

// Helper function to translate error messages
const translateError = (error: AuthError | Error | null): string => {
  if (!error) return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
  
  const message = error.message || error.toString();
  return ERROR_MESSAGES[message] || `เกิดข้อผิดพลาด: ${message}`;
};

class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return {
          user: null,
          error: translateError(error),
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง',
        };
      }

      const user = mapSupabaseUser(data.user);
      
      return {
        user,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        error: translateError(error as Error),
      };
    }
  }

  /**
   * Sign up with email, password, and user info
   */
  async signUp({ email, password, name, role = 'operator' }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role,
          },
        },
      });

      if (error) {
        return {
          user: null,
          error: translateError(error),
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง',
        };
      }

      const user = mapSupabaseUser(data.user);

      return {
        user,
        error: null,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        error: translateError(error as Error),
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: translateError(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: translateError(error as Error) };
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      return mapSupabaseUser(user);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: translateError(error) };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: translateError(error as Error) };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: { name?: string; role?: User['role'] }): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        return {
          user: null,
          error: translateError(error),
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: 'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        };
      }

      const user = mapSupabaseUser(data.user);

      return {
        user,
        error: null,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        user: null,
        error: translateError(error as Error),
      };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (session?.user) {
        const user = mapSupabaseUser(session.user);
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;