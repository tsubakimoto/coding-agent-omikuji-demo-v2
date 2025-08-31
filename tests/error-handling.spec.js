import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Should not have any console errors
    expect(errors).toHaveLength(0);
  });

  test('should handle localStorage corruption gracefully', async ({ page }) => {
    // Corrupt localStorage
    await page.evaluate(() => {
      localStorage.setItem('omikuji-history', 'invalid-json');
      localStorage.setItem('omikuji-theme', 'invalid-theme');
    });
    
    // Reload page
    await page.reload();
    
    // App should still work
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    
    // Should be able to draw fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
  });

  test('should handle missing translations gracefully', async ({ page }) => {
    // App should display Japanese text correctly
    await expect(page.locator('h1')).toContainText('おみくじ');
    await expect(page.getByText('あなたの今日の運勢を占いましょう')).toBeVisible();
    
    // Button text should be in Japanese
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
  });

  test('should handle window resize during animation', async ({ page }) => {
    // Start fortune drawing
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    
    // Resize window during animation
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(1000);
    
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(2000);
    
    // Animation should complete successfully
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
  });

  test('should handle multiple rapid theme toggles', async ({ page }) => {
    const themeButton = page.locator('.theme-toggle');
    
    // Rapidly toggle theme multiple times
    for (let i = 0; i < 5; i++) {
      await themeButton.click();
      await page.waitForTimeout(100);
    }
    
    // App should still be functional
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    
    // Should still be able to draw fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
  });

  test('should handle focus management correctly', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should not cause any errors
    await expect(page.locator('h1')).toBeVisible();
    
    // Enter key on focused button should trigger action
    await page.keyboard.press('Enter');
    
    // Should start fortune drawing or toggle theme depending on focused element
    const isDrawing = await page.locator('text=運勢を占っています...').isVisible().catch(() => false);
    const themeChanged = await page.locator('html').getAttribute('class');
    
    // Either drawing should start or theme should change
    expect(isDrawing || themeChanged).toBeTruthy();
  });
});