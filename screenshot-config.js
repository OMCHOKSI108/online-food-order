// Screenshot Configuration
// Edit this file to customize what screenshots to capture

module.exports = {
  // Base URL of your application (change if needed)
  baseUrl: 'http://localhost:3000',

  // Output directory for screenshots
  outputDir: './src/assets/screenshots',

  // Browser settings
  browser: {
    headless: false, // Set to true for production/ci
    defaultViewport: { width: 1280, height: 720 }
  },

  // Pages to capture
  pages: [
    {
      name: 'homepage',
      url: '/',
      description: 'Main homepage',
      fullPage: false
    },
    {
      name: 'login',
      url: '/login',
      description: 'User login page',
      fullPage: false
    },
    {
      name: 'register',
      url: '/register',
      description: 'User registration page',
      fullPage: false
    },
    {
      name: 'cart',
      url: '/cart',
      description: 'Shopping cart page',
      fullPage: true
    },
    {
      name: 'checkout',
      url: '/checkout',
      description: 'Checkout process',
      fullPage: true
    },
    {
      name: 'admin_dashboard',
      url: '/admin/dashboard',
      description: 'Admin dashboard',
      fullPage: true,
      requiresAuth: true // Will skip if not authenticated
    },
    {
      name: 'admin_users',
      url: '/admin/users',
      description: 'Admin users management',
      fullPage: true,
      requiresAuth: true
    },
    {
      name: 'admin_restaurants',
      url: '/admin/restaurants',
      description: 'Admin restaurants management',
      fullPage: true,
      requiresAuth: true
    }
  ],

  // Responsive breakpoints to test
  responsive: [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
  ],

  // Components to capture (CSS selectors)
  components: [
    { selector: 'header, .navbar, nav', name: 'header' },
    { selector: '.card', name: 'cards', multiple: true, limit: 3 },
    { selector: '.btn', name: 'buttons', multiple: true, limit: 5 },
    { selector: '.modal, .popup', name: 'modals', multiple: true }
  ],

  // User flows to capture (sequence of actions)
  flows: [
    {
      name: 'user_registration_flow',
      description: 'Complete user registration process',
      steps: [
        { action: 'goto', url: '/register' },
        { action: 'wait', selector: 'form' },
        { action: 'screenshot', name: 'registration_form' },
        // Add more steps as needed
      ]
    },
    {
      name: 'admin_workflow',
      description: 'Admin dashboard workflow',
      steps: [
        { action: 'goto', url: '/admin/dashboard' },
        { action: 'wait', selector: '.card' },
        { action: 'screenshot', name: 'admin_overview' },
      ]
    }
  ],

  // Authentication settings (optional)
  auth: {
    enabled: false,
    loginUrl: '/login',
    credentials: {
      email: 'admin@example.com',
      password: 'password'
    }
  },

  // Custom actions (advanced)
  customActions: [
    // Example: Click a button and wait
    // { action: 'click', selector: '.btn-primary', wait: 1000 },
    // { action: 'screenshot', name: 'after_click' }
  ]
};