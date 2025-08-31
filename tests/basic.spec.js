import { test, expect } from '@playwright/test';

test.describe('Omikuji Application Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the application correctly', async ({ page }) => {
    // Check if the main title is visible
    await expect(page.locator('h1')).toContainText('🎋 おみくじ 🎋');
    
    // Check if the subtitle is visible
    await expect(page.locator('p')).toContainText('あなたの今日の運勢を占いましょう');
    
    // Check if the fortune drawing button is visible
    await expect(page.getByRole('button', { name: /おみくじを回す/i })).toBeVisible();
    
    // Check if theme toggle button is visible
    await expect(page.locator('.theme-toggle')).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Omikuji - おみくじ');
  });

  test('should display initial bamboo icon', async ({ page }) => {
    await expect(page.locator('.text-6xl')).toContainText('🎋');
  });
});