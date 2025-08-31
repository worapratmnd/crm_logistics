import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Sidebar } from './Sidebar';
import { AuthContext } from '../../contexts/AuthContext';
import type { User } from '../../../../../packages/shared/types';

// Mock the useAuth hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'operator',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock AuthContext value
const createMockAuthContextValue = (overrides = {}) => ({
  user: mockUser,
  loading: false,
  error: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
  clearError: vi.fn(),
  isAuthenticated: true,
  isAdmin: false,
  isManager: false,
  isOperator: true,
  ...overrides,
});

// Helper to render Sidebar with AuthContext
const renderSidebarWithAuth = (authContextValue = {}) => {
  const mockAuthValue = createMockAuthContextValue(authContextValue);
  
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

// Mock window.confirm
const originalConfirm = window.confirm;

describe('Sidebar - Logout Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = originalConfirm;
  });

  describe('Logout Button Rendering', () => {
    it('should render logout button with correct Thai text', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should render logout button with logout icon', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      const icon = logoutButton.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display user information in footer', () => {
      renderSidebarWithAuth();
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should not display user information when user is null', () => {
      renderSidebarWithAuth({ user: null, isAuthenticated: false });
      
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });
  });

  describe('Logout Button States', () => {
    it('should be enabled when not loading', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).not.toBeDisabled();
    });

    it('should be disabled when auth is loading', () => {
      renderSidebarWithAuth({ loading: true });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).toBeDisabled();
    });

    it('should show loading state when logging out', async () => {
      const mockSignOut = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      window.confirm = vi.fn().mockReturnValue(true);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByText('กำลังออกจากระบบ...')).toBeInTheDocument();
      });
      
      expect(logoutButton).toBeDisabled();
    });
  });

  describe('Logout Functionality', () => {
    it('should show confirmation dialog when logout button is clicked', () => {
      window.confirm = vi.fn().mockReturnValue(false);
      
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      expect(window.confirm).toHaveBeenCalledWith('คุณต้องการออกจากระบบหรือไม่?');
    });

    it('should not call signOut when user cancels confirmation', () => {
      const mockSignOut = vi.fn();
      window.confirm = vi.fn().mockReturnValue(false);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('should call signOut when user confirms logout', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      window.confirm = vi.fn().mockReturnValue(true);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledTimes(1);
      });
    });

    it('should navigate to login page after successful logout', async () => {
      const mockSignOut = vi.fn().mockResolvedValue(undefined);
      window.confirm = vi.fn().mockReturnValue(true);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('should handle logout errors gracefully', async () => {
      const mockSignOut = vi.fn().mockRejectedValue(new Error('Logout failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      window.confirm = vi.fn().mockReturnValue(true);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should be properly accessible as a button', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton.tagName).toBe('BUTTON');
    });

    it('should be focusable', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      logoutButton.focus();
      expect(logoutButton).toHaveFocus();
    });

    it('should have proper disabled state styling', () => {
      renderSidebarWithAuth({ loading: true });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Visual States', () => {
    it('should have correct styling for normal state', () => {
      renderSidebarWithAuth();
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      expect(logoutButton).toHaveClass(
        'text-red-700',
        'bg-red-50',
        'hover:bg-red-100',
        'focus:ring-red-500'
      );
    });

    it('should show loading spinner when logging out', async () => {
      const mockSignOut = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      window.confirm = vi.fn().mockReturnValue(true);
      
      renderSidebarWithAuth({ signOut: mockSignOut });
      
      const logoutButton = screen.getByRole('button', { name: /ออกจากระบบ/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        const spinner = logoutButton.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Items', () => {
    it('should render all navigation items', () => {
      renderSidebarWithAuth();
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('ลูกค้า')).toBeInTheDocument();
      expect(screen.getByText('รายการงาน')).toBeInTheDocument();
    });

    it('should not interfere with navigation functionality', () => {
      renderSidebarWithAuth();
      
      const dashboardButton = screen.getByText('Dashboard');
      fireEvent.click(dashboardButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Version Display', () => {
    it('should display version information', () => {
      renderSidebarWithAuth();
      
      expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    });
  });
});