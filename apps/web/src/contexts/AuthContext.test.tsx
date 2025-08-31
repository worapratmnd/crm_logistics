import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/auth';
import React from 'react';

// Mock auth service
vi.mock('../services/auth', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

const mockAuthService = authService as any;

// Test component to access auth context
const TestComponent: React.FC = () => {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{auth.loading ? 'true' : 'false'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user">{auth.user?.name || 'no user'}</div>
      <div data-testid="error">{auth.error || 'no error'}</div>
      <div data-testid="admin">{auth.isAdmin ? 'true' : 'false'}</div>
      <div data-testid="manager">{auth.isManager ? 'true' : 'false'}</div>
      <div data-testid="operator">{auth.isOperator ? 'true' : 'false'}</div>
      <button onClick={() => auth.signIn({ email: 'test@example.com', password: 'password' })}>
        Sign In
      </button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <button onClick={() => auth.clearError()}>Clear Error</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mocks
    mockAuthService.getCurrentUser.mockResolvedValue(null);
    mockAuthService.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with loading state', async () => {
    renderWithProvider();

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
  });

  it('should load current user on initialization', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('admin')).toHaveTextContent('true');
    });
  });

  it('should handle sign in success', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'manager' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.signIn.mockResolvedValue({
      user: mockUser,
      error: null,
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signInButton = screen.getByText('Sign In');
    await act(async () => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('manager')).toHaveTextContent('true');
    });
  });

  it('should handle sign in error', async () => {
    mockAuthService.signIn.mockResolvedValue({
      user: null,
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signInButton = screen.getByText('Sign In');
    await act(async () => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  it('should handle sign out', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'operator' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
    mockAuthService.signOut.mockResolvedValue({ error: null });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('operator')).toHaveTextContent('true');
    });

    const signOutButton = screen.getByText('Sign Out');
    await act(async () => {
      signOutButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  it('should clear error', async () => {
    mockAuthService.signIn.mockResolvedValue({
      user: null,
      error: 'Test error',
    });

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const signInButton = screen.getByText('Sign In');
    await act(async () => {
      signInButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Test error');
    });

    const clearErrorButton = screen.getByText('Clear Error');
    await act(async () => {
      clearErrorButton.click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('no error');
  });

  it('should handle role-based permissions correctly', async () => {
    const adminUser = {
      id: '123',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.getCurrentUser.mockResolvedValue(adminUser);

    renderWithProvider();

    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('true');
      expect(screen.getByTestId('manager')).toHaveTextContent('false');
      expect(screen.getByTestId('operator')).toHaveTextContent('false');
    });
  });

  it('should handle auth state changes', async () => {
    let authChangeCallback: (user: any) => void;

    mockAuthService.onAuthStateChange.mockImplementation((callback: (user: any) => void) => {
      authChangeCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    renderWithProvider();

    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'manager' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await act(async () => {
      authChangeCallback!(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await act(async () => {
      authChangeCallback!(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });
});

describe('useAuth hook', () => {
  it('should throw error when used outside AuthProvider', () => {
    const TestComponentOutsideProvider: React.FC = () => {
      useAuth();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponentOutsideProvider />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });
});