import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should work correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main elements are visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    await expect(page.locator('.theme-toggle')).toBeVisible();
    
    // Check that the main container has proper mobile styling
    const container = page.locator('.container');
    await expect(container).toHaveClass(/mx-auto/);
    await expect(container).toHaveClass(/px-4/);
  });

  test('should work correctly on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // All main elements should be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    await expect(page.locator('.theme-toggle')).toBeVisible();
  });

  test('should work correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // All main elements should be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    await expect(page.locator('.theme-toggle')).toBeVisible();
    
    // Check that the content is properly centered
    const mainCard = page.locator('.omikuji-card');
    await expect(mainCard).toBeVisible();
  });

  test('should maintain functionality across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Test fortune drawing on each viewport
      await page.getByRole('button', { name: /おみくじを回す/i }).click();
      await page.waitForTimeout(3000);
      
      // Verify result is displayed properly
      await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
      await expect(page.locator('.text-lg.text-gray-600')).toBeVisible();
      
      // Test theme toggle
      await page.locator('.theme-toggle').click();
      await page.waitForTimeout(500);
    }
  });
});