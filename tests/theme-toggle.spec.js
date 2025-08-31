import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Check initial theme (should be light by default or system preference)
    const body = page.locator('html');
    
    // Click the theme toggle button
    await page.locator('.theme-toggle').click();
    
    // Wait for theme transition
    await page.waitForTimeout(500);
    
    // Check that theme has changed (dark class should be present or removed)
    const htmlClassAfterToggle = await body.getAttribute('class');
    
    // Click again to toggle back
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(500);
    
    // Verify theme changed again
    const htmlClassAfterSecondToggle = await body.getAttribute('class');
    
    // The classes should be different after each toggle
    expect(htmlClassAfterToggle !== htmlClassAfterSecondToggle).toBeTruthy();
  });

  test('should show correct theme toggle icons', async ({ page }) => {
    // Check that theme toggle button has an icon
    const themeButton = page.locator('.theme-toggle');
    await expect(themeButton.locator('svg')).toBeVisible();
    
    // Toggle theme and check that icon changes
    await themeButton.click();
    await page.waitForTimeout(500);
    
    // Icon should still be visible after toggle
    await expect(themeButton.locator('svg')).toBeVisible();
  });

  test('should have proper theme toggle accessibility', async ({ page }) => {
    const themeButton = page.locator('.theme-toggle');
    
    // Check that button has a title attribute for accessibility
    const title = await themeButton.getAttribute('title');
    expect(title).toBeTruthy();
    expect(title).toMatch(/(明るい|ダーク)テーマ/);
  });

  test('should persist theme preference on page reload', async ({ page }) => {
    // Toggle to dark theme
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(500);
    
    const htmlClassAfterToggle = await page.locator('html').getAttribute('class');
    
    // Reload the page
    await page.reload();
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that theme preference was maintained
    const htmlClassAfterReload = await page.locator('html').getAttribute('class');
    expect(htmlClassAfterReload).toBe(htmlClassAfterToggle);
  });
});