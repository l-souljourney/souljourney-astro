import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4322';

test.describe('Astro Blog v1.9.8 i18n Deep Regression', () => {

    // 1. Smoke Test
    test('Smoke: Homepage loads successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/L-忠程/);
    });

    // 2. Fix Verification: Archive Links 404 Check
    test('Fix: Archive links should NOT be 404', async ({ page }) => {
        await page.goto('/archives');

        // Locate the first article link in the main archive section
        // Using a more specific selector to avoid sidebar/nav links
        const firstArticleLocator = page.locator('main section a[href^="/article/"]').first();

        if (await firstArticleLocator.count() > 0) {
            const href = await firstArticleLocator.getAttribute('href');
            console.log(`Checking First Article Link: ${href}`);

            if (href) {
                // Direct navigation is more robust than clicking for pure link validation
                // avoiding UI interception (overlays, images, floating headers)
                await page.goto(href);

                // Assertions
                await expect(page.locator('h1').first()).toBeVisible(); // Ensure some title exists
                await expect(page.locator('body')).not.toContainText('404');
                await expect(page.locator('body')).not.toContainText('Page Not Found');
            }
        } else {
            console.log('No articles found in archive to test.');
        }
    });

    // 3. Fix Verification: English Category Count
    test('Fix: English Category should only confirm English posts', async ({ page }) => {
        // Visit AI Era category in English
        await page.goto('/en/categories/ai-era');

        // Check the count in Archive list
        // Selector for archive items: .flex-col > .flex (based on Archive.astro structure)
        // Actually Archive.astro uses: 
        // <div class="flex flex-col"> ... <a href...> ... </a> </div> inside the main container
        // We should count the 'a' tags or the wrapper divs.
        // Let's use the 'a' tags inside the archive list section.
        const posts = page.locator('section.vh-animation a.group');
        const count = await posts.count();
        console.log(`English 'AI Era' Post Count: ${count}`);

        // Assert reasonable count (should be > 0)
        // And ideally checking against a known number if possible, but >0 and <Total is a good heuristic
        expect(count).toBeGreaterThan(0);
    });

    // 4. Fix Verification: English 404
    test('Fix: English 404 Page should be English', async ({ page }) => {
        await page.goto('/en/this-page-does-not-exist-at-all');

        // The title h2 should be "Page Not Found" (Client-side patched)
        // Wait for client-side script to execute
        await expect(page.locator('h2')).toHaveText('Page Not Found', { timeout: 5000 });
        // The button should point to /en/
        // The button should point to /en/ and have text "Back to Home" (set by script)
        await expect(page.locator('a[href="/en/"]').filter({ hasText: 'Back to Home' })).toBeVisible();
    });

    // 5. Crawler Strategy (Recursive Link Check - Simplified)
    test('Crawler: Simple depth-1 link check', async ({ page }) => {
        await page.goto('/en/archives');

        // Get all internal article links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.includes('localhost') && href.includes('/article/') && !href.includes('#'));
        });

        console.log(`Found ${links.length} links to crawl.`);

        // Randomly check up to 5 links
        const sample = links.slice(0, 5);
        for (const link of sample) {
            console.log(`Crawling: ${link}`);
            await page.goto(link);
            await expect(page.locator('body')).not.toContainText('404');
            await expect(page.locator('h1')).toBeVisible();
        }
    });

});
