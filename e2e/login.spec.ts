import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login
    await page.goto('/login');
  });

  test('should show validation error if fields are empty', async ({ page }) => {
    const loginButton = page.locator('#buttonIngresar');
    // El botón debería estar deshabilitado inicialmente
    await expect(loginButton).toBeDisabled();
  });

  test('should allow user to type credentials', async ({ page }) => {
    await page.locator('input[formControlName="email"]').fill('test@example.com');
    await page.locator('input[formControlName="password"]').fill('password123');
    
    const loginButton = page.locator('#buttonIngresar');
    await expect(loginButton).toBeEnabled();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[formControlName="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    await page.locator('.password-toggle').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    await page.locator('.password-toggle').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to recovery password', async ({ page }) => {
    await page.click('text=¿La olvidaste?');
    await expect(page).toHaveURL(/.*recuperar-password/);
  });

});
