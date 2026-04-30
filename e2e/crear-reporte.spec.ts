import { test, expect } from '@playwright/test';

test.describe('Create Report Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Iniciar sesión con las credenciales proporcionadas
    await page.goto('/login');
    await page.locator('input[formControlName="email"]').fill('diaz.jordyb@gmail.com');
    await page.locator('input[formControlName="password"]').fill('987654321');
    await page.click('#buttonIngresar');
    
    // Esperar a que navegue al dashboard
    await expect(page).toHaveURL(/.*home-usuario/);
  });

  test('should create a new report successfully', async ({ page }) => {
    // 2. Navegar a Crear Reporte desde el header
    await page.click('text=Nuevo Reporte');
    await expect(page).toHaveURL(/.*crear-reporte/);

    // 3. Llenar el formulario
    await page.locator('#titulo').fill('Bache peligroso en la vía');
    await page.locator('#descripcion').fill('Hay un hueco muy grande cerca de la esquina que está causando accidentes.');
    
    // Seleccionar ciudad
    await page.locator('#ciudad').selectOption('ARMENIA');
    
    // Seleccionar la primera categoría disponible (suponiendo que cargan del backend)
    const categoriaSelect = page.locator('#categoria');
    await categoriaSelect.waitFor({ state: 'visible' });
    // Seleccionamos por índice para no depender del ID exacto
    await categoriaSelect.selectOption({ index: 1 });

    // 4. Seleccionar ubicación en el mapa (clic en el centro del contenedor)
    const mapa = page.locator('#mapa');
    await mapa.scrollIntoViewIfNeeded();
    const box = await mapa.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    // 5. Verificar que el botón de envío se habilite
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled();

    // 6. Enviar reporte
    await submitBtn.click();

    // 7. Verificar mensaje de éxito (SweetAlert2)
    const successMsg = page.locator('text=Reporte creado');
    await expect(successMsg).toBeVisible({ timeout: 10000 });
    
    // 8. Confirmar y verificar retorno al home
    await page.click('text=OK');
    await expect(page).toHaveURL(/.*home-usuario/);
  });

});
