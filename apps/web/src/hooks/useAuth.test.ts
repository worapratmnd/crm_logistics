import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as AuthContext from '../contexts/AuthContext';

// Mock the auth context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUseAuthContext = vi.mocked(AuthContext.useAuth);

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAuthContextValue = {
    user: {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    loading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
    clearError: vi.fn(),
    isAuthenticated: true,
    isAdmin: true,
    isManager: false,
    isOperator: false,
  };

  it('should return all auth context values', () => {
    mockUseAuthContext.mockReturnValue(mockAuthContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockAuthContextValue.user);
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it('should check role hierarchy correctly', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: { ...mockAuthContextValue.user, role: 'manager' },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole('operator')).toBe(true);
    expect(result.current.hasRole('manager')).toBe(true);
    expect(result.current.hasRole('admin')).toBe(false);
  });

  it('should return false for hasRole when user is null', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: null,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole('operator')).toBe(false);
    expect(result.current.hasRole('admin')).toBe(false);
  });

  it('should check permissions correctly for admin', () => {
    mockUseAuthContext.mockReturnValue(mockAuthContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current.canAccess('users:create')).toBe(true);
    expect(result.current.canAccess('customers:delete')).toBe(true);
    expect(result.current.canAccess('settings:update')).toBe(true);
  });

  it('should check permissions correctly for manager', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: { ...mockAuthContextValue.user, role: 'manager' },
      isAdmin: false,
      isManager: true,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.canAccess('customers:create')).toBe(true);
    expect(result.current.canAccess('jobs:delete')).toBe(true);
    expect(result.current.canAccess('users:create')).toBe(false);
    expect(result.current.canAccess('settings:update')).toBe(false);
  });

  it('should check permissions correctly for operator', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: { ...mockAuthContextValue.user, role: 'operator' },
      isAdmin: false,
      isManager: false,
      isOperator: true,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.canAccess('customers:read')).toBe(true);
    expect(result.current.canAccess('jobs:update')).toBe(true);
    expect(result.current.canAccess('customers:delete')).toBe(false);
    expect(result.current.canAccess('users:create')).toBe(false);
  });

  it('should return false for canAccess when user is null', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: null,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.canAccess('customers:read')).toBe(false);
  });

  it('should return correct display name', () => {
    mockUseAuthContext.mockReturnValue(mockAuthContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current.displayName).toBe('Test User');
  });

  it('should fallback to email for display name', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: { ...mockAuthContextValue.user, name: '' },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.displayName).toBe('test@example.com');
  });

  it('should return empty string for display name when no user', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: null,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.displayName).toBe('');
  });

  it('should return correct initials', () => {
    mockUseAuthContext.mockReturnValue(mockAuthContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current.initials).toBe('TU');
  });

  it('should return initials from email when no name', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: { ...mockAuthContextValue.user, name: '' },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.initials).toBe('T');
  });

  it('should return correct Thai role display name', () => {
    const testCases = [
      { role: 'admin' as const, expected: 'ผู้ดูแลระบบ' },
      { role: 'manager' as const, expected: 'ผู้จัดการ' },
      { role: 'operator' as const, expected: 'พนักงานปฏิบัติการ' },
    ];

    testCases.forEach(({ role, expected }) => {
      mockUseAuthContext.mockReturnValue({
        ...mockAuthContextValue,
        user: { ...mockAuthContextValue.user, role },
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.roleDisplayName).toBe(expected);
    });
  });

  it('should check if current user correctly', () => {
    mockUseAuthContext.mockReturnValue(mockAuthContextValue);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isCurrentUser('123')).toBe(true);
    expect(result.current.isCurrentUser('456')).toBe(false);
  });

  it('should return false for isCurrentUser when no user', () => {
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      user: null,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isCurrentUser('123')).toBe(false);
  });

  it('should format account age correctly', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 366 * 24 * 60 * 60 * 1000);

    const testCases = [
      { createdAt: now, expected: 'วันนี้' },
      { createdAt: yesterday, expected: 'เมื่อวานนี้' },
      { createdAt: oneWeekAgo, expected: '7 วันที่แล้ว' },
      { createdAt: oneMonthAgo, expected: '1 เดือนที่แล้ว' },
      { createdAt: oneYearAgo, expected: '1 ปีที่แล้ว' },
    ];

    testCases.forEach(({ createdAt, expected }) => {
      mockUseAuthContext.mockReturnValue({
        ...mockAuthContextValue,
        user: { ...mockAuthContextValue.user, createdAt },
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.accountAge).toBe(expected);
    });
  });

  it('should handle safe sign in with error', async () => {
    const mockSignIn = vi.fn().mockRejectedValue(new Error('Network error'));
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      signIn: mockSignIn,
    });

    const { result } = renderHook(() => useAuth());

    const response = await result.current.safeSignIn('test@example.com', 'password');

    expect(response).toEqual({
      user: null,
      error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง',
    });
  });

  it('should handle safe sign out with error', async () => {
    const mockSignOut = vi.fn().mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockUseAuthContext.mockReturnValue({
      ...mockAuthContextValue,
      signOut: mockSignOut,
    });

    const { result } = renderHook(() => useAuth());

    await result.current.safeSignOut();

    expect(consoleSpy).toHaveBeenCalledWith('Safe sign out error:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });
});