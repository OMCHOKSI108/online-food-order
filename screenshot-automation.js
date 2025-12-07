const fs = require('fs');
const path = require('path');

// Change to frontend directory to access node_modules
process.chdir(path.join(__dirname, 'frontend'));

const puppeteer = require('puppeteer');

class ScreenshotAutomation {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.screenshotsDir = path.join(__dirname, 'src/assets/screenshots');
    this.browser = null;
    this.page = null;
  }

  async init() {
    // Create screenshots directory if it doesn't exist
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      defaultViewport: { width: 1280, height: 720 }
    });
  }

  async takeScreenshot(filename, options = {}) {
    const filepath = path.join(this.screenshotsDir, `${filename}.png`);
    await this.page.screenshot({
      path: filepath,
      fullPage: options.fullPage || false,
      ...options
    });
    console.log(`✅ Screenshot saved: ${filename}.png`);
    return filepath;
  }

  async waitForSelector(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.log(`⚠️  Selector not found: ${selector}`);
      return false;
    }
  }

  async capturePage(url, filename, options = {}) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(1000); // Wait for animations
      await this.takeScreenshot(filename, options);
    } catch (error) {
      console.error(`❌ Failed to capture ${filename}:`, error.message);
    }
  }

  async captureUserFlow() {
    console.log('🚀 Starting screenshot automation...');

    // Create new page for each flow
    this.page = await this.browser.newPage();

    try {
      // 1. Homepage
      console.log('📸 Capturing homepage...');
      await this.capturePage(`${this.baseUrl}/`, '01_homepage');

      // 2. Login page
      console.log('📸 Capturing login page...');
      await this.capturePage(`${this.baseUrl}/login`, '02_login');

      // 3. Register page
      console.log('📸 Capturing register page...');
      await this.capturePage(`${this.baseUrl}/register`, '03_register');

      // 4. Menu page (if accessible)
      console.log('📸 Capturing menu page...');
      try {
        await this.capturePage(`${this.baseUrl}/menu/restaurant1`, '04_menu');
      } catch (error) {
        console.log('⚠️  Menu page requires authentication, skipping...');
      }

      // 5. Cart page
      console.log('📸 Capturing cart page...');
      await this.capturePage(`${this.baseUrl}/cart`, '05_cart');

      // 6. Checkout page
      console.log('📸 Capturing checkout page...');
      await this.capturePage(`${this.baseUrl}/checkout`, '06_checkout');

      // 7. Admin Dashboard (if accessible)
      console.log('📸 Capturing admin dashboard...');
      try {
        await this.capturePage(`${this.baseUrl}/admin/dashboard`, '07_admin_dashboard');
      } catch (error) {
        console.log('⚠️  Admin pages require authentication, skipping...');
      }

      console.log('✅ Screenshot automation completed!');
      console.log(`📁 Screenshots saved to: ${this.screenshotsDir}`);

    } finally {
      await this.page.close();
    }
  }

  async captureResponsiveScreenshots() {
    console.log('📱 Capturing responsive screenshots...');

    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      const page = await this.browser.newPage();
      await page.setViewport(viewport);

      try {
        await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(this.screenshotsDir, `homepage_${viewport.name}.png`),
          fullPage: true
        });
        console.log(`✅ ${viewport.name} screenshot saved`);
      } finally {
        await page.close();
      }
    }
  }

  async captureComponentScreenshots() {
    console.log('🧩 Capturing component screenshots...');

    const page = await this.browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    try {
      // Navigate to a page with components
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle2' });

      // Wait for components to load
      await page.waitForTimeout(2000);

      // Capture header
      if (await this.waitForSelector('header, .navbar, nav')) {
        const headerElement = await page.$('header, .navbar, nav');
        if (headerElement) {
          await headerElement.screenshot({
            path: path.join(this.screenshotsDir, 'component_header.png')
          });
          console.log('✅ Header component screenshot saved');
        }
      }

      // Capture cards/components
      const cards = await page.$$('.card');
      if (cards.length > 0) {
        for (let i = 0; i < Math.min(cards.length, 3); i++) {
          await cards[i].screenshot({
            path: path.join(this.screenshotsDir, `component_card_${i + 1}.png`)
          });
        }
        console.log('✅ Card component screenshots saved');
      }

    } finally {
      await page.close();
    }
  }

  async runAutomation(type = 'all') {
    await this.init();

    try {
      switch (type) {
        case 'flow':
          await this.captureUserFlow();
          break;
        case 'responsive':
          await this.captureResponsiveScreenshots();
          break;
        case 'components':
          await this.captureComponentScreenshots();
          break;
        case 'all':
        default:
          await this.captureUserFlow();
          await this.captureResponsiveScreenshots();
          await this.captureComponentScreenshots();
          break;
      }
    } finally {
      await this.browser.close();
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'all';

  console.log('🎯 Screenshot Automation Tool');
  console.log('==============================');
  console.log(`Mode: ${type}`);
  console.log('');

  const automation = new ScreenshotAutomation();

  try {
    await automation.runAutomation(type);
    console.log('');
    console.log('🎉 All screenshots captured successfully!');
  } catch (error) {
    console.error('❌ Automation failed:', error);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = ScreenshotAutomation;

// Run if called directly
if (require.main === module) {
  main();
}