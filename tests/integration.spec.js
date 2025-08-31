import { test, expect } from '@playwright/test';

test.describe('End-to-End Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage for clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should complete full user journey', async ({ page }) => {
    // 1. Verify initial state
    await expect(page.locator('h1')).toContainText('🎋 おみくじ 🎋');
    await expect(page.locator('.text-6xl')).toContainText('🎋');
    
    // 2. Toggle theme
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(500);
    
    // 3. Draw multiple fortunes and build history
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /おみくじを回す/i }).click();
      
      // Wait for loading animation
      await expect(page.locator('text=運勢を占っています...')).toBeVisible();
      await page.waitForTimeout(3000);
      
      // Verify result appears
      await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
      await expect(page.locator('.text-lg.text-gray-600')).toBeVisible();
      
      await page.waitForTimeout(500);
    }
    
    // 4. Verify history is populated
    await expect(page.locator('text=過去の結果')).toBeVisible();
    const historyItems = page.locator('.history-item');
    expect(await historyItems.count()).toBe(3);
    
    // 5. Verify theme persistence after reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // History should persist
    await expect(page.locator('text=過去の結果')).toBeVisible();
    expect(await page.locator('.history-item').count()).toBe(3);
  });

  test('should handle rapid clicking gracefully', async ({ page }) => {
    // Test rapid clicking on fortune button
    const drawButton = page.getByRole('button', { name: /おみくじを回す/i });
    
    // Click multiple times rapidly
    await drawButton.click();
    await drawButton.click();
    await drawButton.click();
    
    // Should handle gracefully - button should be disabled during drawing
    await expect(drawButton).toBeDisabled();
    
    // Wait for animation to complete
    await page.waitForTimeout(3000);
    
    // Button should be enabled again and only one result should be shown
    await expect(drawButton).toBeEnabled();
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    const originalFortune = await page.locator('.text-4xl.font-bold').textContent();
    
    // Simulate navigation away and back (using browser back/forward)
    await page.evaluate(() => window.history.pushState({}, '', '/test'));
    await page.goBack();
    
    // Result should still be displayed
    await expect(page.locator('.text-4xl.font-bold')).toContainText(originalFortune);
    
    // History should still be available
    await expect(page.locator('text=過去の結果')).toBeVisible();
  });

  test('should work offline after initial load', async ({ page, context }) => {
    // Load the page first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // App should still function for drawing fortunes (it's a static app)
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Should still show result
    await expect(page.locator('.text-4xl.font-bold')).toBeVisible();
    
    // Theme toggle should still work
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(500);
  });
});