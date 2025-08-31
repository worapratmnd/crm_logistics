import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../contexts/AuthContext';
import { authService } from '../services/auth';

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

// Mock react-router-dom Link component and navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

const mockAuthService = authService as any;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    
    // Setup default mocks
    mockAuthService.getCurrentUser.mockResolvedValue(null);
    mockAuthService.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    mockAuthService.signIn.mockResolvedValue({
      user: null,
      error: 'Test error',
    });
  });

  it('renders login form with all required elements', () => {
    renderWithRouter(<LoginPage />);

    // Check for page title and description
    expect(screen.getByText('ยินดีต้อนรับ')).toBeInTheDocument();
    expect(screen.getByText('เข้าสู่ระบบ CRM สำหรับธุรกิจขนส่งและโลจิสติกส์')).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeInTheDocument();
    expect(screen.getByLabelText('อีเมล')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();

    // Check for forgot password link
    expect(screen.getByText('ลืมรหัสผ่าน?')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('กรุณากรอกอีเมล')).toBeInTheDocument();
      expect(screen.getByText('กรุณากรอกรหัสผ่าน')).toBeInTheDocument();
    });
  });

  it('shows email format validation error', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText('อีเมล');
    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('รูปแบบอีเมลไม่ถูกต้อง')).toBeInTheDocument();
    });
  });

  it('shows password length validation error', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ');
    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);

    const passwordInput = screen.getByLabelText('รหัสผ่าน') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click to show password
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click to hide password again
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('submits form with valid data and shows success', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.signIn.mockResolvedValue({
      user: mockUser,
      error: null,
    });
    
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText('อีเมล');
    const passwordInput = screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ');
    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    await act(async () => {
      await user.click(submitButton);
    });

    // Check if auth service was called
    expect(mockAuthService.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('shows error message on login failure', async () => {
    const user = userEvent.setup();

    mockAuthService.signIn.mockResolvedValue({
      user: null,
      error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    });
    
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText('อีเมล');
    const passwordInput = screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ');
    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    
    await act(async () => {
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง')).toBeInTheDocument();
    });
  });

  it('redirects to dashboard when already authenticated', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
    
    renderWithRouter(<LoginPage />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('disables form during submission', async () => {
    const user = userEvent.setup();
    
    // Mock a slow sign in to test loading state
    mockAuthService.signIn.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ user: null, error: null }), 100)
      )
    );

    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByLabelText('อีเมล');
    const passwordInput = screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ');
    const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    await act(async () => {
      await user.click(submitButton);
    });

    // Check if loading state is shown
    await waitFor(() => {
      expect(screen.getByText('กำลังเข้าสู่ระบบ...')).toBeInTheDocument();
    });
  });

  it('renders forgot password link with correct href', () => {
    renderWithRouter(<LoginPage />);

    const forgotPasswordLink = screen.getByText('ลืมรหัสผ่าน?');
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  it('displays correct Thai placeholders and labels', () => {
    renderWithRouter(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('กรุณากรอกอีเมลของคุณ');
    const passwordInput = screen.getByPlaceholderText('กรุณากรอกรหัสผ่านของคุณ');
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(screen.getByText('กรอกข้อมูลเพื่อเข้าสู่ระบบ')).toBeInTheDocument();
  });
});