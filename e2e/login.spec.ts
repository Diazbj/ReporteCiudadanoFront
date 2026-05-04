import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('C47 should show validation error if fields are empty', async ({ page }) => {
    const loginButton = page.locator('#buttonIngresar');
    await expect(loginButton).toBeDisabled();
  });

  test('C46 should allow user to type credentials', async ({ page }) => {
    await page.locator('input[formControlName="email"]').fill('test@example.com');
    await page.locator('input[formControlName="password"]').fill('password123');
    const loginButton = page.locator('#buttonIngresar');
    await expect(loginButton).toBeEnabled();
  });

  test('C46 should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[formControlName="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.locator('.password-toggle').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await page.locator('.password-toggle').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('C46 should navigate to recovery password', async ({ page }) => {
    await page.click('text=¿La olvidaste?');
    await expect(page).toHaveURL(/.*recuperar-password/);
  });
});