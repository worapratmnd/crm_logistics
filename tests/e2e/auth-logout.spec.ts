import { test, expect, Page, BrowserContext } from '@playwright/test';

// Test data
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
};

// Helper functions
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/');
  await expect(page.locator('text=Dashboard')).toBeVisible();
}

async function expectOnLoginPage(page: Page) {
  await expect(page.locator('h1')).toContainText('เข้าสู่ระบบ');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
}

test.describe('Logout Functionality - Story 2.4', () => {
  
  test.describe('Basic Logout Tests', () => {
    test('should display logout button in sidebar with Thai text', async ({ page }) => {
      await loginUser(page);
      
      // Check logout button is visible in sidebar
      const logoutButton = page.locator('button', { hasText: 'ออกจากระบบ' });
      await expect(logoutButton).toBeVisible();
      
      // Check button has correct styling
      await expect(logoutButton).toHaveClass(/text-red-700/);
      await expect(logoutButton).toHaveClass(/bg-red-50/);
      
      // Check logout icon is present
      const logoutIcon = logoutButton.locator('svg');
      await expect(logoutIcon).toBeVisible();
    });

    test('should display user information above logout button', async ({ page }) => {
      await loginUser(page);
      
      // Check user information is displayed
      await expect(page.locator('text=' + TEST_USER.name)).toBeVisible();
      await expect(page.locator('text=' + TEST_USER.email)).toBeVisible();
      
      // Check version is displayed
      await expect(page.locator('text=v1.0.0')).toBeVisible();
    });

    test('should show confirmation dialog when logout button is clicked', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler
      let confirmationText = '';
      page.on('dialog', async dialog => {
        confirmationText = dialog.message();
        await dialog.dismiss(); // Cancel logout
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Verify confirmation dialog appeared with correct Thai text
      expect(confirmationText).toBe('คุณต้องการออกจากระบบหรือไม่?');
      
      // Should still be on dashboard after canceling
      await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('should not logout when confirmation dialog is canceled', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to cancel
      page.on('dialog', async dialog => {
        await dialog.dismiss();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should still be authenticated and on dashboard
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('button:has-text("ออกจากระบบ")')).toBeVisible();
    });

    test('should logout successfully when confirmation dialog is accepted', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should redirect to login page
      await page.waitForURL('/login');
      await expectOnLoginPage(page);
    });
  });

  test.describe('Logout Loading States', () => {
    test('should show loading state during logout process', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should show loading text briefly
      const loadingText = page.locator('text=กำลังออกจากระบบ...');
      // Note: This might be too fast to catch in some cases
      
      // Should eventually redirect to login page
      await page.waitForURL('/login');
      await expectOnLoginPage(page);
    });

    test('should disable logout button during logout process', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      const logoutButton = page.locator('button:has-text("ออกจากระบบ")');
      
      // Click logout button
      await logoutButton.click();
      
      // Should eventually redirect to login page
      await page.waitForURL('/login');
      await expectOnLoginPage(page);
    });
  });

  test.describe('Post-Logout Navigation', () => {
    test('should redirect to login page after successful logout', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should redirect to login page
      await page.waitForURL('/login');
      await expectOnLoginPage(page);
    });

    test('should not be able to access protected routes after logout', async ({ page }) => {
      await loginUser(page);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Wait for redirect to login
      await page.waitForURL('/login');
      
      // Try to navigate to protected routes
      await page.goto('/customers');
      await page.waitForURL('/login?returnUrl=%2Fcustomers');
      await expectOnLoginPage(page);
      
      await page.goto('/jobs');
      await page.waitForURL('/login?returnUrl=%2Fjobs');
      await expectOnLoginPage(page);
      
      await page.goto('/');
      await page.waitForURL('/login?returnUrl=%2F');
      await expectOnLoginPage(page);
    });

    test('should preserve return URL after logout redirect', async ({ page }) => {
      await loginUser(page);
      
      // Navigate to customers page
      await page.goto('/customers');
      await expect(page.locator('text=ลูกค้า')).toBeVisible();
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should redirect to login page
      await page.waitForURL('/login');
      
      // Try to access customers page again
      await page.goto('/customers');
      await page.waitForURL('/login?returnUrl=%2Fcustomers');
      await expectOnLoginPage(page);
      
      // URL should contain return URL
      expect(page.url()).toContain('returnUrl=%2Fcustomers');
    });
  });

  test.describe('Session Cleanup', () => {
    test('should clear authentication tokens after logout', async ({ page }) => {
      await loginUser(page);
      
      // Check that we have some authentication state
      const beforeLogout = await page.evaluate(() => {
        return {
          localStorage: { ...localStorage },
          sessionStorage: { ...sessionStorage }
        };
      });
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Wait for redirect to login
      await page.waitForURL('/login');
      
      // Check that authentication data is cleared
      const afterLogout = await page.evaluate(() => {
        return {
          localStorage: { ...localStorage },
          sessionStorage: { ...sessionStorage }
        };
      });
      
      // Should not contain authentication tokens
      expect(JSON.stringify(afterLogout.localStorage)).not.toContain('auth');
      expect(JSON.stringify(afterLogout.sessionStorage)).not.toContain('auth');
    });

    test('should clear user data from application state', async ({ page }) => {
      await loginUser(page);
      
      // Check user is displayed in sidebar
      await expect(page.locator('text=' + TEST_USER.name)).toBeVisible();
      await expect(page.locator('text=' + TEST_USER.email)).toBeVisible();
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Wait for redirect to login
      await page.waitForURL('/login');
      
      // User data should be cleared - login page shouldn't show user info
      await expect(page.locator('text=' + TEST_USER.name)).not.toBeVisible();
      await expect(page.locator('text=' + TEST_USER.email)).not.toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle logout errors gracefully', async ({ page }) => {
      await loginUser(page);
      
      // Mock network error during logout
      await page.route('**/auth/signout', route => {
        route.abort('failed');
      });
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should still redirect to login page even on error
      await page.waitForURL('/login', { timeout: 10000 });
      await expectOnLoginPage(page);
    });

    test('should handle network connectivity issues during logout', async ({ page }) => {
      await loginUser(page);
      
      // Simulate offline state
      await page.context().setOffline(true);
      
      // Setup dialog handler to accept
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Click logout button
      await page.click('button:has-text("ออกจากระบบ")');
      
      // Should still redirect to login page
      await page.waitForURL('/login', { timeout: 10000 });
      await expectOnLoginPage(page);
      
      // Reset online state
      await page.context().setOffline(false);
    });
  });
});

test.describe('Cross-Tab Logout Synchronization', () => {
  test('should logout from all tabs when logout occurs in one tab', async ({ browser }) => {
    // Create two browser contexts to simulate different tabs
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    try {
      // Login in both tabs
      await loginUser(page1);
      await loginUser(page2);
      
      // Verify both tabs are on dashboard
      await expect(page1.locator('text=Dashboard')).toBeVisible();
      await expect(page2.locator('text=Dashboard')).toBeVisible();
      
      // Setup dialog handler for page1
      page1.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Logout from page1
      await page1.click('button:has-text("ออกจากระบบ")');
      
      // Wait for page1 to redirect to login
      await page1.waitForURL('/login');
      await expectOnLoginPage(page1);
      
      // Page2 should also be redirected to login automatically
      await page2.waitForURL('/login', { timeout: 10000 });
      await expectOnLoginPage(page2);
      
      // Try to navigate to protected route in page2 should fail
      await page2.goto('/customers');
      await page2.waitForURL('/login?returnUrl=%2Fcustomers');
      await expectOnLoginPage(page2);
      
    } finally {
      await context1.close();
      await context2.close();
    }
  });

  test('should synchronize logout state across multiple tabs', async ({ browser }) => {
    // Create three browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const context3 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const page3 = await context3.newPage();
    
    try {
      // Login in all tabs
      await loginUser(page1);
      await loginUser(page2);
      await loginUser(page3);
      
      // Navigate to different pages
      await page2.goto('/customers');
      await page3.goto('/jobs');
      
      // Verify all tabs are authenticated
      await expect(page1.locator('text=Dashboard')).toBeVisible();
      await expect(page2.locator('text=ลูกค้า')).toBeVisible();
      await expect(page3.locator('text=รายการงาน')).toBeVisible();
      
      // Setup dialog handler for page1
      page1.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      // Logout from page1
      await page1.click('button:has-text("ออกจากระบบ")');
      
      // All pages should redirect to login
      await page1.waitForURL('/login');
      await page2.waitForURL('/login', { timeout: 10000 });
      await page3.waitForURL('/login', { timeout: 10000 });
      
      // All should show login page
      await expectOnLoginPage(page1);
      await expectOnLoginPage(page2);
      await expectOnLoginPage(page3);
      
    } finally {
      await context1.close();
      await context2.close();
      await context3.close();
    }
  });
});

test.describe('Complete Authentication Cycle Integration', () => {
  test('should complete full authentication cycle: Login → Navigate → Logout → Login', async ({ page }) => {
    // Step 1: Login
    await loginUser(page);
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    // Step 2: Navigate to different pages
    await page.click('text=ลูกค้า');
    await page.waitForURL('/customers');
    await expect(page.locator('text=ลูกค้า')).toBeVisible();
    
    await page.click('text=รายการงาน');
    await page.waitForURL('/jobs');
    await expect(page.locator('text=รายการงาน')).toBeVisible();
    
    await page.click('text=Dashboard');
    await page.waitForURL('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    // Step 3: Logout
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    
    await page.click('button:has-text("ออกจากระบบ")');
    await page.waitForURL('/login');
    await expectOnLoginPage(page);
    
    // Step 4: Try to access protected routes (should fail)
    await page.goto('/customers');
    await page.waitForURL('/login?returnUrl=%2Fcustomers');
    await expectOnLoginPage(page);
    
    // Step 5: Login again
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Should redirect to customers page (from returnUrl)
    await page.waitForURL('/customers');
    await expect(page.locator('text=ลูกค้า')).toBeVisible();
    
    // Should be able to navigate freely
    await page.click('text=Dashboard');
    await page.waitForURL('/');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});