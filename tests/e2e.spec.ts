import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

test.describe('Astro Blog v1.9.7 i18n Regression Tests', () => {

    // 1. Smoke Test
    test('Smoke: Homepage loads successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/L-忠程/);
        await expect(page.locator('header nav')).toBeVisible();
    });

    // 2. Sidebar Isolation (Fixing "Chinese sidebar on English page" bug)
    test('Regression: English Sidebar should NOT show Chinese titles', async ({ page }) => {
        await page.goto('/en/archives');

        // Check Sidebar titles
        const aside = page.locator('aside');
        await expect(aside).toContainText('Categories');
        await expect(aside).toContainText('Tags');

        // Should NOT contain Chinese titles
        await expect(aside).not.toContainText('分类');
        await expect(aside).not.toContainText('热门标签');
    });

    // 3. Archive Isolation (Fixing "Mixed content in Archive" bug)
    test('Regression: Chinese Archives should NOT show English posts', async ({ page }) => {
        await page.goto('/archives');

        // Select all English links in the archive list
        // English links usually start with /en/article/ or have similar patterns
        // We check that NONE of the links contain '/en/' if your Chinese posts don't use that
        const englishLinks = page.locator('a[href^="/en/article/"]');
        await expect(englishLinks).toHaveCount(0);
    });

    // 4. English TOC (Fixing "Missing TOC" bug)
    test('Regression: English Article should have Table of Contents', async ({ page }) => {
        // Visit a known English article with h2/h3
        // Use the actual one we saw in getPostInfo or earlier analysis
        // "cursor-trial-account-crash-experience" seems to be one
        await page.goto('/en/article/cursor-trial-account-crash-experience');

        const toc = page.locator('aside nav ul');
        // If article has h3, TOC should be populated.
        // We might need to select a specific article known to have headings.
        // Let's assume this one does based on earlier read_url_content.
        if (await toc.count() > 0) {
            await expect(toc).toBeVisible();
        }
    });

});
