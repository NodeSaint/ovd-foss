import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto('http://localhost:5173');
await page.waitForLoadState('networkidle');

// Screenshot Sign tab
await page.screenshot({ path: 'screenshots/sign-tab.png', fullPage: true });

// Click Verify tab
await page.click('button:has-text("Verify")');
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/verify-tab.png', fullPage: true });

// Click Keys tab
await page.click('button:has-text("Keys")');
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/keys-tab.png', fullPage: true });

// Generate a keypair and screenshot
await page.click('button:has-text("Generate New Keypair")');
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/keys-with-keypair.png', fullPage: true });

await browser.close();
console.log('Screenshots saved to screenshots/');
