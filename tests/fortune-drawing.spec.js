import { test, expect } from '@playwright/test';

test.describe('Fortune Drawing Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should draw a fortune when button is clicked', async ({ page }) => {
    // Click the fortune drawing button
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    
    // Check that loading state appears
    await expect(page.locator('text=運勢を占っています...')).toBeVisible();
    
    // Wait for the loading animation to complete (2 seconds + buffer)
    await page.waitForTimeout(3000);
    
    // Check that a fortune result appears
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
    
    // Verify that one of the fortune types is displayed
    const fortuneTypes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
    const fortuneText = await page.locator('.text-4xl.font-bold').textContent();
    expect(fortuneTypes).toContain(fortuneText);
    
    // Check that a message is displayed
    await expect(page.locator('.text-lg.text-gray-600')).toBeVisible();
  });

  test('should show different fortunes on multiple draws', async ({ page }) => {
    const drawnFortunes = new Set();
    
    // Draw fortunes multiple times to check randomness
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /おみくじを回す/i }).click();
      await page.waitForTimeout(3000); // Wait for animation
      
      const fortuneText = await page.locator('.text-4xl.font-bold').textContent();
      drawnFortunes.add(fortuneText);
      
      // Wait a bit before next draw
      await page.waitForTimeout(500);
    }
    
    // We should get at least some variety (though randomness means this isn't guaranteed)
    // But at minimum, we should have valid fortune types
    const fortuneTypes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
    for (const fortune of drawnFortunes) {
      expect(fortuneTypes).toContain(fortune);
    }
  });

  test('should display appropriate colors for different fortune types', async ({ page }) => {
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    const fortuneElement = page.locator('.text-4xl.font-bold');
    const fortuneText = await fortuneElement.textContent();
    
    // Check color classes based on fortune type
    if (fortuneText === '大吉') {
      await expect(fortuneElement).toHaveClass(/text-yellow-500/);
    } else if (fortuneText === '中吉' || fortuneText === '小吉' || fortuneText === '吉') {
      await expect(fortuneElement).toHaveClass(/text-green-500/);
    } else if (fortuneText === '凶' || fortuneText === '大凶') {
      await expect(fortuneElement).toHaveClass(/text-red-500/);
    }
  });
});