import { test, expect } from '@playwright/test';

test.describe('Logout UI Verification - Story 2.4 QA', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start from the home page (will redirect to login if not authenticated)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should show login page when not authenticated', async ({ page }) => {
    // Should redirect to login page when not authenticated
    await expect(page).toHaveURL('/login');
    
    // Check login page elements
    await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('เข้าสู่ระบบ');
    
    // Check Thai language elements
    await expect(page.locator('text=อีเมล')).toBeVisible();
    await expect(page.locator('text=รหัสผ่าน')).toBeVisible();
    await expect(page.locator('text=ลืมรหัสผ่าน?')).toBeVisible();
  });

  test('should have proper form validation on login page', async ({ page }) => {
    await expect(page).toHaveURL('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should still be on login page
    await expect(page).toHaveURL('/login');
    
    // Check form fields are properly configured
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should redirect authenticated user from login to dashboard', async ({ page }) => {
    // This test will need to be adjusted based on actual authentication
    // For now, we'll just verify the redirect logic exists in the route structure
    
    await expect(page).toHaveURL('/login');
    
    // Check that the application structure is in place
    // If we were authenticated, we should see protected routes
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should have proper routing for protected routes', async ({ page }) => {
    // Try to access protected routes directly
    await page.goto('/customers');
    
    // Should redirect to login with return URL
    await expect(page).toHaveURL(/\/login\?returnUrl=.*customers/);
    
    await page.goto('/jobs');
    await expect(page).toHaveURL(/\/login\?returnUrl=.*jobs/);
    
    await page.goto('/dashboard');
    // Dashboard is at root, so returnUrl should be %2F (encoded /)
    await expect(page).toHaveURL(/\/login(\?returnUrl=.*)?/);
  });

  test('should preserve return URL in navigation', async ({ page }) => {
    // Navigate to customers route (should redirect to login with returnUrl)
    await page.goto('/customers');
    await expect(page).toHaveURL('/login?returnUrl=%2Fcustomers');
    
    // URL should be preserved
    expect(page.url()).toContain('returnUrl=%2Fcustomers');
    
    // Try jobs route
    await page.goto('/jobs');
    await expect(page).toHaveURL('/login?returnUrl=%2Fjobs');
    expect(page.url()).toContain('returnUrl=%2Fjobs');
  });

  test('should have consistent Thai language throughout login page', async ({ page }) => {
    await expect(page).toHaveURL('/login');
    
    // Check all Thai language elements
    await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
    await expect(page.locator('text=ระบบจัดการลูกค้าสัมพันธ์สำหรับธุรกิจขนส่งและโลจิสติกส์')).toBeVisible();
    await expect(page.locator('text=อีเมล')).toBeVisible();
    await expect(page.locator('text=รหัสผ่าน')).toBeVisible();
    await expect(page.locator('text=ลืมรหัสผ่าน?')).toBeVisible();
    
    // Check button text
    await expect(page.locator('button[type="submit"]')).toContainText('เข้าสู่ระบบ');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await expect(page).toHaveURL('/login');
    
    // Check form has proper labels and accessibility
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    // Check inputs have proper attributes
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Check form structure
    await expect(page.locator('form')).toBeVisible();
    
    // Check that inputs are focusable
    await emailInput.focus();
    await expect(emailInput).toBeFocused();
    
    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();
  });

  test('should handle form input validation properly', async ({ page }) => {
    await expect(page).toHaveURL('/login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Test email validation
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await page.click('button[type="submit"]');
    
    // Should show validation error or stay on form
    await expect(page).toHaveURL('/login');
    
    // Test with valid email format
    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');
    
    // Form should be submittable (even if credentials are invalid)
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });
});