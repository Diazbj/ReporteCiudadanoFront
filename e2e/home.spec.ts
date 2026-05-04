import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('[C53] should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/ReporteCiudadanoFront/);
  });

  test('[C54] should navigate to login from hero button', async ({ page }) => {
    await page.click('text=Comenzar Ahora');
    await expect(page).toHaveURL(/.*login/);
  });

  test('[C55] should navigate to register from hero button', async ({ page }) => {
    await page.click('text=Unirse a la Comunidad');
    await expect(page).toHaveURL(/.*registro/);
  });

  test('[C56] should show stats section', async ({ page }) => {
    const statsBar = page.locator('.stats-bar');
    await expect(statsBar).toBeVisible();
    await expect(page.locator('text=Reportes Totales')).toBeVisible();
  });

  test('[C57] should show services section', async ({ page }) => {
    await expect(page.locator('text=Servicios Disponibles')).toBeVisible();
    await expect(page.locator('text=Infraestructura Vía')).toBeVisible();
    await expect(page.locator('text=Seguridad Pública')).toBeVisible();
  });
});