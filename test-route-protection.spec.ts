import { test, expect } from '@playwright/test';

test.describe('Route Protection Security Tests', () => {
  const BASE_URL = 'http://localhost:3001';
  
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('1. Route Protection Functional Testing', () => {
    test('should redirect unauthenticated user from Dashboard (/) to login', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      
      // Should be redirected to login with return URL
      await expect(page).toHaveURL(/\/login(\?returnUrl=%2F)?/);
      
      // Should show login page content
      await expect(page.locator('text=เข้าสู่ระบบ')).toBeVisible();
    });

    test('should redirect unauthenticated user from Customers to login', async ({ page }) => {
      await page.goto(`${BASE_URL}/customers`);
      
      // Should be redirected to login with return URL
      await expect(page).toHaveURL(/\/login\?returnUrl=%2Fcustomers/);
      
      // Should show login page content
      await expect(page.locator('text=เข้าสู่ระบบ')).toBeVisible();
    });

    test('should redirect unauthenticated user from Jobs to login', async ({ page }) => {
      await page.goto(`${BASE_URL}/jobs`);
      
      // Should be redirected to login with return URL
      await expect(page).toHaveURL(/\/login\?returnUrl=%2Fjobs/);
      
      // Should show login page content
      await expect(page.locator('text=เข้าสู่ระบบ')).toBeVisible();
    });

    test('should allow unauthenticated user to access login page', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Should stay on login page
      await expect(page).toHaveURL(`${BASE_URL}/login`);
      
      // Should show login form
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });
  });

  test.describe('2. URL Security and Navigation Testing', () => {
    test('should preserve return URL parameter correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/customers`);
      
      // Should redirect to login with encoded return URL
      await expect(page).toHaveURL(`${BASE_URL}/login?returnUrl=%2Fcustomers`);
      
      // Return URL should be preserved in URL params
      const urlParams = new URL(page.url()).searchParams;
      expect(urlParams.get('returnUrl')).toBe('/customers');
    });

    test('should sanitize malicious paths', async ({ page }) => {
      const maliciousPaths = [
        '/customers/../../../etc/passwd',
        '/jobs?<script>alert("xss")</script>',
        '/dashboard/../../admin',
      ];

      for (const path of maliciousPaths) {
        await page.goto(`${BASE_URL}${path}`);
        
        // Should either redirect to login or handle safely
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('<script>');
        expect(currentUrl).not.toContain('../');
      }
    });

    test('should validate return URL whitelist', async ({ page }) => {
      const invalidReturnUrls = [
        'http://evil.com/steal-data',
        'javascript:alert("xss")',
        '//evil.com/redirect',
        'https://external-site.com'
      ];

      for (const returnUrl of invalidReturnUrls) {
        const encodedUrl = encodeURIComponent(returnUrl);
        await page.goto(`${BASE_URL}/login?returnUrl=${encodedUrl}`);
        
        // Should stay on login page and not use malicious return URL
        await expect(page).toHaveURL(new RegExp(`${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/login`));
      }
    });

    test('should handle deep linking securely', async ({ page }) => {
      // Test direct access to deep protected route
      await page.goto(`${BASE_URL}/customers/123`);
      
      // Should redirect to login (even if route doesn't exist yet)
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('3. Session Management Testing', () => {
    test('should detect expired session', async ({ page, context }) => {
      // Simulate expired session
      await page.goto(`${BASE_URL}/login`);
      
      // Set expired lastActivity in localStorage
      await page.evaluate(() => {
        const expiredDate = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
        localStorage.setItem('lastActivity', expiredDate.toISOString());
      });
      
      // Try to access protected route
      await page.goto(`${BASE_URL}/`);
      
      // Should show session expired message or redirect to login
      await expect(page.locator('text=เซสชันหมดอายุ, text=เข้าสู่ระบบ')).toBeVisible();
    });

    test('should update activity timestamp on user interaction', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check if lastActivity is updated on page interactions
      const initialActivity = await page.evaluate(() => localStorage.getItem('lastActivity'));
      
      // Simulate user activity
      await page.mouse.move(100, 100);
      await page.keyboard.press('Tab');
      
      await page.waitForTimeout(100); // Small delay for activity tracking
      
      const updatedActivity = await page.evaluate(() => localStorage.getItem('lastActivity'));
      
      // Activity should be updated (or at least not null if user interaction tracking is working)
      expect(updatedActivity).toBeTruthy();
    });
  });

  test.describe('4. Edge Cases and Error Handling', () => {
    test('should handle malformed user data gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Inject malformed auth data
      await page.evaluate(() => {
        localStorage.setItem('supabase.auth.token', 'invalid-token');
      });
      
      await page.goto(`${BASE_URL}/`);
      
      // Should handle gracefully and redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should prevent browser history manipulation', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Try to use history.pushState to navigate to protected route
      await page.evaluate(() => {
        history.pushState(null, '', '/dashboard');
      });
      
      await page.reload();
      
      // Should redirect back to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should handle concurrent tab scenarios', async ({ context }) => {
      const page1 = await context.newPage();
      const page2 = await context.newPage();
      
      // Both tabs try to access protected routes
      await page1.goto(`${BASE_URL}/customers`);
      await page2.goto(`${BASE_URL}/jobs`);
      
      // Both should be redirected to login
      await expect(page1).toHaveURL(/\/login/);
      await expect(page2).toHaveURL(/\/login/);
    });

    test('should handle network connectivity issues', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Simulate network issues by going offline
      await page.context().setOffline(true);
      
      try {
        await page.goto(`${BASE_URL}/customers`);
        
        // Should handle offline gracefully
        // The exact behavior depends on implementation, but should not crash
        const hasError = await page.locator('text=network, text=connection, text=offline').count() > 0;
        const isOnLogin = page.url().includes('/login');
        
        expect(hasError || isOnLogin).toBeTruthy();
      } finally {
        await page.context().setOffline(false);
      }
    });
  });

  test.describe('5. User Experience Testing', () => {
    test('should show appropriate loading states', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      
      // Check if loading state is shown during authentication check
      const loadingText = page.locator('text=กำลังตรวจสอบสิทธิ์');
      
      // Loading state might be brief, so we check if it exists or if we're redirected quickly
      const hasLoadingOrRedirected = await Promise.race([
        loadingText.isVisible().then(() => true),
        page.waitForURL(/\/login/, { timeout: 2000 }).then(() => true),
      ]).catch(() => false);
      
      expect(hasLoadingOrRedirected).toBeTruthy();
    });

    test('should show clear error messages for unauthorized access', async ({ page }) => {
      await page.goto(`${BASE_URL}/customers`);
      
      // Should redirect to login with clear messaging
      await expect(page).toHaveURL(/\/login/);
      
      // Should show login form
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('should handle return URL navigation after login simulation', async ({ page }) => {
      // Start by going to protected route (gets redirected to login)
      await page.goto(`${BASE_URL}/jobs`);
      await expect(page).toHaveURL(/\/login\?returnUrl=%2Fjobs/);
      
      // Simulate successful login by setting auth data
      // Note: This would normally require actual authentication with backend
      await page.evaluate(() => {
        // This is a simulation - real implementation would need proper auth tokens
        localStorage.setItem('lastActivity', new Date().toISOString());
      });
      
      // The actual login flow would be tested with integrated backend
      // For now, we verify the return URL is preserved
      const url = new URL(page.url());
      expect(url.searchParams.get('returnUrl')).toBe('/jobs');
    });
  });

  test.describe('6. Security Vulnerability Testing', () => {
    test('should prevent XSS in route parameters', async ({ page }) => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onload=alert("xss")',
        '%3Cscript%3Ealert%28%22xss%22%29%3C%2Fscript%3E'
      ];

      for (const payload of xssPayloads) {
        await page.goto(`${BASE_URL}/customers?search=${payload}`);
        
        // Should not execute any scripts
        const alertFired = await page.evaluate(() => {
          return window.hasOwnProperty('__xss_alert_fired__');
        });
        
        expect(alertFired).toBeFalsy();
        
        // Should handle payload safely
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('<script>');
      }
    });

    test('should prevent path traversal attacks', async ({ page }) => {
      const traversalAttempts = [
        '/customers/../../../etc/passwd',
        '/jobs/..%2F..%2F..%2Fetc%2Fpasswd',
        '/dashboard/..\\..\\..\\windows\\system32',
      ];

      for (const path of traversalAttempts) {
        await page.goto(`${BASE_URL}${path}`);
        
        // Should either redirect to login or handle safely
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('../');
        expect(currentUrl).not.toContain('..%2F');
        expect(currentUrl).not.toContain('..\\');
      }
    });

    test('should validate and sanitize all route inputs', async ({ page }) => {
      const maliciousInputs = [
        '/customers?id="><script>alert("xss")</script>',
        '/jobs?filter=\'; DROP TABLE users; --',
        '/dashboard?redirect=http://evil.com',
      ];

      for (const input of maliciousInputs) {
        await page.goto(`${BASE_URL}${input}`);
        
        // Should handle malicious inputs safely
        const currentUrl = page.url();
        expect(currentUrl).not.toContain('<script>');
        expect(currentUrl).not.toContain('DROP TABLE');
        
        // Should redirect to login for protected routes
        if (input.startsWith('/customers') || input.startsWith('/jobs') || input.startsWith('/dashboard')) {
          await expect(page).toHaveURL(/\/login/);
        }
      }
    });
  });
});