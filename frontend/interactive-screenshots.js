#!/usr/bin/env node

/**
 * Interactive Screenshot Capture
 * Ask user what they want to capture and automate the process
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

class InteractiveScreenshot {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.screenshotsDir = path.join(__dirname, 'src/assets/screenshots');
    this.browser = null;
    this.page = null;
  }

  async init() {
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
  }

  async takeScreenshot(filename, options = {}) {
    const filepath = path.join(this.screenshotsDir, `${filename}.png`);
    await this.page.screenshot({
      path: filepath,
      fullPage: options.fullPage || false,
      ...options
    });
    console.log(`✅ Saved: ${filename}.png`);
    return filepath;
  }

  async captureUrl() {
    const url = await ask('Enter the URL to capture (e.g., /admin/users): ');
    const filename = await ask('Enter filename (without .png): ');

    try {
      await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(1000);
      await this.takeScreenshot(filename);
    } catch (error) {
      console.error(`❌ Failed to capture ${url}:`, error.message);
    }
  }

  async captureMultiplePages() {
    const pages = await ask('Enter page URLs separated by commas (e.g., /,/login,/cart): ');
    const urls = pages.split(',').map(url => url.trim());

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        console.log(`📸 Capturing ${url}...`);
        await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle2' });
        await this.page.waitForTimeout(1000);
        await this.takeScreenshot(`${i + 1}_${url.replace('/', '').replace(/\//g, '_') || 'home'}`);
      } catch (error) {
        console.error(`❌ Failed to capture ${url}:`, error.message);
      }
    }
  }

  async captureResponsive() {
    const url = await ask('Enter URL to capture responsively: ');

    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      try {
        console.log(`📱 Capturing ${viewport.name} version...`);
        await this.page.setViewport(viewport);
        await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle2' });
        await this.page.waitForTimeout(1000);
        await this.takeScreenshot(`${url.replace('/', '').replace(/\//g, '_') || 'home'}_${viewport.name}`);
      } catch (error) {
        console.error(`❌ Failed ${viewport.name} capture:`, error.message);
      }
    }
  }

  async captureComponent() {
    const url = await ask('Enter page URL: ');
    const selector = await ask('Enter CSS selector (e.g., .card, #header, .btn): ');
    const filename = await ask('Enter filename: ');

    try {
      await this.page.goto(`${this.baseUrl}${url}`, { waitUntil: 'networkidle2' });
      await this.page.waitForTimeout(1000);

      const element = await this.page.$(selector);
      if (element) {
        await element.screenshot({
          path: path.join(this.screenshotsDir, `${filename}.png`)
        });
        console.log(`✅ Component screenshot saved: ${filename}.png`);
      } else {
        console.log(`❌ Element not found: ${selector}`);
      }
    } catch (error) {
      console.error(`❌ Failed to capture component:`, error.message);
    }
  }

  async run() {
    await this.init();

    console.log('🎯 Interactive Screenshot Capture');
    console.log('================================');
    console.log(`📁 Screenshots will be saved to: ${this.screenshotsDir}`);
    console.log('');

    while (true) {
      console.log('Choose an option:');
      console.log('1. 📸 Capture a single URL');
      console.log('2. 📚 Capture multiple pages');
      console.log('3. 📱 Capture responsive versions');
      console.log('4. 🧩 Capture a specific component');
      console.log('5. 🚪 Exit');
      console.log('');

      const choice = await ask('Enter your choice (1-5): ');

      switch (choice) {
        case '1':
          await this.captureUrl();
          break;
        case '2':
          await this.captureMultiplePages();
          break;
        case '3':
          await this.captureResponsive();
          break;
        case '4':
          await this.captureComponent();
          break;
        case '5':
          console.log('👋 Goodbye!');
          rl.close();
          await this.browser.close();
          return;
        default:
          console.log('❌ Invalid choice. Please try again.');
      }

      console.log('');
      const continueChoice = await ask('Continue? (y/n): ');
      if (continueChoice.toLowerCase() !== 'y') {
        break;
      }
      console.log('');
    }

    rl.close();
    await this.browser.close();
  }
}

// Run the interactive tool
async function main() {
  const tool = new InteractiveScreenshot();
  try {
    await tool.run();
  } catch (error) {
    console.error('❌ Tool failed:', error);
    process.exit(1);
  }
}

main();