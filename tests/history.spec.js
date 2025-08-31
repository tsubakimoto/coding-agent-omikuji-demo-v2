import { test, expect } from '@playwright/test';

test.describe('History Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage to start with clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display history section when fortunes are drawn', async ({ page }) => {
    // Initially, history should be empty or not visible
    const historySection = page.locator('text=過去の結果');
    await expect(historySection).toBeHidden();
    
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // History section should now be visible
    await expect(historySection).toBeVisible();
  });

  test('should save drawn fortunes to history', async ({ page }) => {
    // Draw multiple fortunes
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /おみくじを回す/i }).click();
      await page.waitForTimeout(3000);
      await page.waitForTimeout(500); // Small gap between draws
    }
    
    // Check that history items are displayed
    const historyItems = page.locator('.history-item');
    const count = await historyItems.count();
    expect(count).toBe(3);
    
    // Each history item should have a fortune type and timestamp
    for (let i = 0; i < count; i++) {
      const item = historyItems.nth(i);
      await expect(item).toBeVisible();
      
      // Should contain a valid fortune type
      const itemText = await item.textContent();
      const fortuneTypes = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
      const hasValidFortune = fortuneTypes.some(type => itemText.includes(type));
      expect(hasValidFortune).toBeTruthy();
    }
  });

  test('should limit history to 5 items', async ({ page }) => {
    // Draw 7 fortunes to test the 5-item limit
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: /おみくじを回す/i }).click();
      await page.waitForTimeout(3000);
      await page.waitForTimeout(300);
    }
    
    // Should only show 5 history items
    const historyItems = page.locator('.history-item');
    const count = await historyItems.count();
    expect(count).toBe(5);
  });

  test('should persist history across page reloads', async ({ page }) => {
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Get the current fortune result
    const fortuneText = await page.locator('.text-4xl.font-bold').textContent();
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that history is preserved
    const historySection = page.locator('text=過去の結果');
    await expect(historySection).toBeVisible();
    
    const historyItems = page.locator('.history-item');
    const count = await historyItems.count();
    expect(count).toBe(1);
    
    // The history item should contain the fortune we drew
    const historyItemText = await historyItems.first().textContent();
    expect(historyItemText).toContain(fortuneText);
  });

  test('should display timestamps in history items', async ({ page }) => {
    // Draw a fortune
    await page.getByRole('button', { name: /おみくじを回す/i }).click();
    await page.waitForTimeout(3000);
    
    // Check that history item contains time information
    const historyItem = page.locator('.history-item').first();
    const itemText = await historyItem.textContent();
    
    // Should contain time format (e.g., "14:30" or similar)
    expect(itemText).toMatch(/\d{1,2}:\d{2}/);
  });
});