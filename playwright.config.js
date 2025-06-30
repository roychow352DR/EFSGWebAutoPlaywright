// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
  
    timeout: 5000
  },
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {

    browserName : 'firefox',
    headless : false,
    screenshot : 'on',
    trace : 'on',//off,on
    video: 'retain-on-failure'
    
    
    
  },


};

module.exports = config;
