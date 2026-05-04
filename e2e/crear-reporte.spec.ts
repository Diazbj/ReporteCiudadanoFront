import { test, expect } from '@playwright/test';

test.describe('Create Report Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[formControlName="email"]').fill('diaz.jordyb@gmail.com');
    await page.locator('input[formControlName="password"]').fill('987654321');
    await page.click('#buttonIngresar');
    await expect(page).toHaveURL(/.*home-usuario/);
  });

  test('C48 should create a new report successfully', async ({ page }) => {
    await page.click('text=Nuevo Reporte');
    await expect(page).toHaveURL(/.*crear-reporte/);

    await page.locator('#titulo').fill('Bache peligroso en la vía');
    await page.locator('#descripcion').fill('Hay un hueco muy grande cerca de la esquina que está causando accidentes.');

    await page.locator('#ciudad').selectOption('ARMENIA');

    const categoriaSelect = page.locator('#categoria');
    await categoriaSelect.waitFor({ state: 'visible' });
    await categoriaSelect.selectOption({ index: 1 });

    const mapa = page.locator('#mapa');
    await mapa.scrollIntoViewIfNeeded();
    const box = await mapa.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    const successMsg = page.locator('text=Reporte creado');
    await expect(successMsg).toBeVisible({ timeout: 10000 });

    await page.click('text=OK');
    await expect(page).toHaveURL(/.*home-usuario/);
  });
});