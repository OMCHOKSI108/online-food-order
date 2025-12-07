#!/usr/bin/env node

/**
 * Screenshot Automation Wrapper
 * This script runs from the frontend directory and calls the main automation
 */

const { ScreenshotAutomation } = require('../screenshot-automation');

// Get the mode from command line arguments
const mode = process.argv[2] || 'all';

async function run() {
  const automation = new ScreenshotAutomation();
  try {
    await automation.runAutomation(mode);
  } catch (error) {
    console.error('❌ Automation failed:', error);
    process.exit(1);
  }
}

run();