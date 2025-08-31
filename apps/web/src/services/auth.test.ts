import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from './auth';
import { supabase } from '../lib/supabase';

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

const mockSupabase = supabase as any;

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('signIn', () => {
    it('should sign in successfully with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_metadata: {
          name: 'Test User',
          role: 'admin',
        },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      });

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      expect(result.error).toBeNull();
    });

    it('should handle invalid credentials error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    });

    it('should handle network errors', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Network error'));

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    });

    it('should trim email input', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      });

      await authService.signIn({
        email: '  test@example.com  ',
        password: 'password123',
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('signUp', () => {
    it('should sign up successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_metadata: {
          name: 'Test User',
          role: 'operator',
        },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: {} },
        error: null,
      });

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'operator',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      expect(result.error).toBeNull();
    });

    it('should handle email already exists error', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' },
      });

      const result = await authService.signUp({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น');
    });

    it('should use default role when not specified', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Some error' },
      });

      await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
            role: 'operator',
          },
        },
      });
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await authService.signOut();

      expect(result.error).toBeNull();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out error', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: 'Logout failed' },
      });

      const result = await authService.signOut();

      expect(result.error).toBe('เกิดข้อผิดพลาด: Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_metadata: {
          name: 'Test User',
          role: 'admin',
        },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
    });

    it('should return null when no user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Error' },
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: null,
      });

      const result = await authService.resetPassword('test@example.com');

      expect(result.error).toBeNull();
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
    });

    it('should handle reset password error', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'User not found' },
      });

      const result = await authService.resetPassword('test@example.com');

      expect(result.error).toBe('ไม่พบบัญชีผู้ใช้นี้ในระบบ');
    });

    it('should trim email input', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: null,
      });

      await authService.resetPassword('  test@example.com  ');

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(Object)
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        user_metadata: {
          name: 'Updated User',
          role: 'manager',
        },
      };

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.updateProfile({
        name: 'Updated User',
        role: 'manager',
      });

      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        name: 'Updated User',
        role: 'manager',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      expect(result.error).toBeNull();
    });

    it('should handle update profile error', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Update failed' },
      });

      const result = await authService.updateProfile({
        name: 'Updated User',
      });

      expect(result.user).toBeNull();
      expect(result.error).toBe('เกิดข้อผิดพลาด: Update failed');
    });
  });

  describe('onAuthStateChange', () => {
    it('should subscribe to auth state changes', () => {
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      });

      authService.onAuthStateChange(mockCallback);

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });
});