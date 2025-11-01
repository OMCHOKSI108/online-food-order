```
online-food-ordering/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── FoodItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Register.js
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Restaurants.js
    │   │   ├── Menu.js
    │   │   ├── Cart.js
    │   │   ├── Orders.js
    │   │   └── AdminPanel.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── public/

```

A complete Online Food Ordering System (India) web application using React.js (frontend), Node.js + Express (backend), and MongoDB (database).
The system should support three types of users — Admin, Restaurant, and Customer — each having a separate dashboard and permissions.
All prices, totals, and payment details should be shown in Indian Rupees (₹).
The app should simulate payments (success/failure) and support refund logic for cancelled orders.

Admin Features:
Can manage all users (view, edit, delete).

Can approve or reject new restaurants that register on the platform.

Can view all restaurant menus, orders, payments, and feedback.

Can generate reports (total orders, revenue, top restaurants, top dishes).

Can send suggestions or performance feedback to restaurants.

All reports and totals must display prices in INR (₹).



Restaurant (Owner) Features:

Can register and log in securely.

Can create, edit, and delete food items (menu management).

Can set item prices in ₹ INR, add descriptions, and mark items as available/unavailable.

Can view and manage incoming orders (accept/reject).

Can update order status (e.g., Preparing, Out for Delivery, Delivered).

Can view customer feedback and average ratings.

Dashboard should show total earnings in Indian Rupees (₹).



Customer Features:

Can browse restaurants and menus.

Can search for food items and filter by category, price (₹ range), and ratings.

Can add food items to cart and place orders.

Can pay for orders (simulate payment success/failure) — show payment amount in ₹ INR.

Can cancel orders and request refunds (refunds reflected in ₹).

Can view order history and payment receipts (with ₹ values).

Can give feedback and rate food/restaurants after delivery.

