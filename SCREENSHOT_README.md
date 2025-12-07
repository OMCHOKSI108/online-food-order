# Screenshot Automation Tool

Automatically capture screenshots of your React food ordering application and save them to `src/assets/screenshots/` as PNG files.

## Features

- 📸 **Page Screenshots**: Capture all main pages of your app
- 📱 **Responsive Testing**: Screenshots at different screen sizes
- 🧩 **Component Capture**: Isolate and capture specific UI components
- 🔄 **User Flows**: Capture sequences of user interactions
- ⚙️ **Configurable**: Easy-to-edit configuration file

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Your Development Server
```bash
npm start
```
Make sure your app is running on `http://localhost:3000`

### 3. Run Screenshot Automation

#### Capture Everything
```bash
npm run screenshots
```

#### Capture Only User Flow
```bash
npm run screenshots:flow
```

#### Capture Only Responsive Screenshots
```bash
npm run screenshots:responsive
```

#### Interactive Mode (Recommended)
```bash
npm run screenshots:interactive
```

This launches an interactive prompt where you can specify exactly what you want to capture:

- **Single URL**: Capture one specific page
- **Multiple Pages**: Capture several pages at once
- **Responsive**: Capture the same page at different screen sizes
- **Component**: Capture a specific element using CSS selectors

### Examples

**Capture admin user detail page:**
```
Enter the URL to capture: /admin/users
Enter filename: admin_users_page
```

**Capture multiple pages:**
```
Enter page URLs: /,/login,/cart,/checkout
```

**Capture responsive versions:**
```
Enter URL: /admin/dashboard
```

**Capture a specific component:**
```
Enter page URL: /admin/users
Enter CSS selector: .card
Enter filename: user_card_component
```

## Configuration

Edit `screenshot-config.js` to customize what gets captured:

```javascript
module.exports = {
  baseUrl: 'http://localhost:3000',
  pages: [
    {
      name: 'homepage',
      url: '/',
      description: 'Main homepage'
    },
    // Add more pages...
  ],
  responsive: [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 375, height: 667, name: 'mobile' }
  ]
};
```

## Output

Screenshots are saved to `src/assets/screenshots/` with descriptive names:

- `01_homepage.png` - Homepage
- `02_login.png` - Login page
- `homepage_desktop.png` - Desktop version
- `homepage_mobile.png` - Mobile version
- `component_header.png` - Header component
- etc.

## Advanced Usage

### Custom User Flows
Add complex interaction sequences:

```javascript
flows: [
  {
    name: 'order_flow',
    steps: [
      { action: 'goto', url: '/menu/restaurant1' },
      { action: 'click', selector: '.add-to-cart-btn' },
      { action: 'wait', time: 1000 },
      { action: 'screenshot', name: 'item_added_to_cart' },
      { action: 'goto', url: '/cart' },
      { action: 'screenshot', name: 'cart_with_item' }
    ]
  }
]
```

### Authentication
Enable authentication for protected pages:

```javascript
auth: {
  enabled: true,
  loginUrl: '/login',
  credentials: {
    email: 'admin@example.com',
    password: 'password'
  }
}
```

## Requirements

- Node.js
- Your React app running on localhost:3000
- Puppeteer (automatically installed)

## Tips

- Run your app in development mode for best results
- Screenshots are taken after page load and animations
- Failed captures are logged but don't stop the process
- Use the configuration file to easily modify what gets captured

## Troubleshooting

- **Screenshots are blank**: Make sure your app is running
- **Auth pages fail**: Enable authentication in config
- **Components not found**: Check CSS selectors in config
- **Slow captures**: Increase wait times in the automation script