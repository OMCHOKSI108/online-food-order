#!/usr/bin/env node

/**
 * Simple Screenshot Test
 * Run this to verify screenshot automation is working
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Change to frontend directory to access node_modules
process.chdir(path.join(__dirname, 'frontend'));

async function testScreenshot() {
  console.log('🧪 Testing screenshot automation...');

  const screenshotsDir = path.join(__dirname, 'frontend/src/assets/screenshots');

  // Create directory if it doesn't exist
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Try to capture a simple screenshot
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    await page.screenshot({
      path: path.join(screenshotsDir, 'test_screenshot.png')
    });

    console.log('✅ Test screenshot saved successfully!');
    console.log(`📁 Location: ${screenshotsDir}\\test_screenshot.png`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testScreenshot();