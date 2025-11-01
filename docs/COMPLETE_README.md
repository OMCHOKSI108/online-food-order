# 🍔 Online Food Ordering System (India)

A complete full-stack web application for online food ordering with support for **Admin**, **Restaurant Owners**, and **Customers**. All prices are in Indian Rupees (₹) with payment simulation and refund support.

## 🚀 Features

### 👤 Customer Features
- ✅ Browse approved restaurants with search & filter
- ✅ View detailed menus with item availability
- ✅ Add items to cart and manage quantities
- ✅ Place orders with delivery address
- ✅ Simulated payment (success/failure: 90% success rate)
- ✅ Cancel orders and request refunds (₹ INR)
- ✅ View order history and tracking
- ✅ Submit ratings and reviews for food/restaurants
- ✅ Download payment receipts (₹ formatted)

### 🍴 Restaurant Owner Features
- ✅ Register restaurant and await admin approval
- ✅ Manage food menu (Create, Read, Update, Delete)
- ✅ Set prices in ₹ INR and manage item availability
- ✅ Set food preparation time
- ✅ View incoming orders in real-time
- ✅ Accept/Reject orders with reasons
- ✅ Update order status (Preparing → Ready → Out for Delivery → Delivered)
- ✅ View customer feedback and average ratings
- ✅ Dashboard with total earnings in ₹
- ✅ Track order history and revenue

### 👑 Admin Features
- ✅ View and manage all users (view, edit, delete)
- ✅ Approve/Reject new restaurant registrations
- ✅ View all restaurants, menus, orders, and payments
- ✅ Manage payment transactions
- ✅ Generate reports:
  - Total revenue (₹ INR)
  - Top 10 restaurants by orders & earnings
  - Top 10 dishes by orders
  - Overall system statistics
- ✅ Send feedback to restaurants
- ✅ System dashboard with key metrics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB 8.3.2 (Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **Password Hashing**: bcryptjs 2.4.3
- **Environment**: dotenv 16.4.5
- **API**: RESTful with CORS enabled

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite (React Scripts 5.0.1)
- **Routing**: React Router DOM 7.9.5
- **State Management**: React Context API
- **HTTP Client**: Axios 1.13.1
- **Styling**: Bootstrap 5.3.8 + Custom CSS
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
online-food-ordering/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js          # JWT & role-based access control
│   ├── models/
│   │   ├── User.js          # User (customer, restaurant, admin)
│   │   ├── Restaurant.js    # Restaurant with approval status
│   │   ├── FoodItem.js      # Menu items with availability
│   │   ├── Order.js         # Orders with payment & refund tracking
│   │   ├── Review.js        # Food/Restaurant ratings
│   │   └── Payment.js       # Payment transactions
│   ├── routes/
│   │   ├── authRoutes.js    # Registration, login, profile
│   │   ├── restaurantRoutes.js # Restaurant & menu management
│   │   ├── orderRoutes.js   # Customer orders & payments
│   │   └── adminRoutes.js   # Admin management & reports
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useCart.js
    │   ├── services/
    │   │   ├── restaurantService.js
    │   │   ├── orderService.js
    │   │   └── adminService.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Menu.js
    │   │   ├── Cart.js
    │   │   ├── OrderHistory.js
    │   │   ├── Payment.js
    │   │   ├── OrderDetails.js
    │   │   ├── Profile.js
    │   │   ├── restaurant/
    │   │   │   ├── Setup.js
    │   │   │   ├── Dashboard.js
    │   │   │   ├── Menu.js
    │   │   │   └── Orders.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Restaurants.js
    │   │       ├── Users.js
    │   │       └── Reports.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 📊 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "customer" | "restaurant" | "admin",
  phone: String,
  address: String,
  restaurantId: ObjectId (for restaurant owners),
  totalEarnings: Number (₹),
  totalOrders: Number,
  totalSpent: Number (₹),
  isActive: Boolean,
  createdAt: Date
}
```

### Restaurant
```javascript
{
  name: String,
  description: String,
  address: String,
  image: String,
  owner: ObjectId (User),
  approvalStatus: "pending" | "approved" | "rejected",
  rating: Number,
  totalOrders: Number,
  totalEarnings: Number (₹),
  isActive: Boolean,
  rejectionReason: String
}
```

### FoodItem
```javascript
{
  name: String,
  description: String,
  price: Number (₹ INR),
  image: String,
  category: String,
  restaurant: ObjectId,
  isAvailable: Boolean,
  rating: Number,
  preparationTime: Number (minutes),
  totalRatings: Number
}
```

### Order
```javascript
{
  user: ObjectId,
  restaurant: ObjectId,
  items: [{
    foodItem: ObjectId,
    quantity: Number,
    price: Number (₹)
  }],
  totalAmount: Number (₹),
  status: "pending" | "accepted" | "rejected" | "preparing" | 
          "ready" | "out_for_delivery" | "delivered" | "cancelled",
  paymentStatus: "pending" | "completed" | "failed" | "refunded",
  paymentMethod: "card" | "upi" | "wallet",
  refundAmount: Number (₹),
  refundStatus: "none" | "initiated" | "completed",
  deliveryAddress: String,
  rating: 1-5
}
```

### Payment
```javascript
{
  order: ObjectId,
  user: ObjectId,
  amount: Number (₹),
  paymentMethod: String,
  transactionId: String (unique),
  status: "success" | "failed" | "pending",
  failureReason: String
}
```

### Review
```javascript
{
  order: ObjectId,
  customer: ObjectId,
  restaurant: ObjectId,
  foodItem: ObjectId (optional),
  type: "food" | "restaurant",
  rating: 1-5,
  comment: String
}
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
GET    /api/auth/me                - Get profile
PUT    /api/auth/me                - Update profile
```

### Restaurants (Public)
```
GET    /api/restaurants            - Get all approved restaurants
GET    /api/restaurants/:id/menu   - Get restaurant menu
```

### Restaurants (Owner - Protected)
```
POST   /api/restaurants/register   - Register restaurant
GET    /api/restaurants/my-restaurant - Get my restaurant
PUT    /api/restaurants/my-restaurant - Update restaurant info
POST   /api/restaurants/menu       - Add food item
GET    /api/restaurants/menu       - Get my menu
PUT    /api/restaurants/menu/:id   - Update food item
DELETE /api/restaurants/menu/:id   - Delete food item
GET    /api/restaurants/orders     - Get incoming orders
PUT    /api/restaurants/orders/:id/accept  - Accept order
PUT    /api/restaurants/orders/:id/reject  - Reject order
PUT    /api/restaurants/orders/:id/status  - Update order status
GET    /api/restaurants/feedback   - Get customer reviews
GET    /api/restaurants/earnings   - Get earnings (₹)
```

### Orders (Customer - Protected)
```
POST   /api/orders                 - Place order
POST   /api/orders/:id/payment     - Process payment
GET    /api/orders                 - Get my orders
GET    /api/orders/:id             - Get order details
PUT    /api/orders/:id/cancel      - Cancel order & request refund
POST   /api/orders/:id/review      - Submit review/rating
GET    /api/orders/:id/receipt     - Get receipt (₹ formatted)
```

### Admin (Protected - Admin only)
```
GET    /api/admin/users            - Get all users
DELETE /api/admin/users/:id        - Delete user
PUT    /api/admin/users/:id        - Edit user

GET    /api/admin/restaurants/pending         - Get pending restaurants
PUT    /api/admin/restaurants/:id/approve     - Approve restaurant
PUT    /api/admin/restaurants/:id/reject      - Reject restaurant

GET    /api/admin/orders           - Get all orders
GET    /api/admin/payments         - Get all payments

GET    /api/admin/reports/revenue  - Revenue report (₹)
GET    /api/admin/reports/top-restaurants - Top restaurants
GET    /api/admin/reports/top-dishes        - Top dishes
GET    /api/admin/stats            - System statistics
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- MongoDB running on localhost:27017
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/online-food-ordering
JWT_SECRET=your-secret-key-here

# Start server
npm run dev  # with nodemon for development
# or
npm start   # for production
```

### Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm start

# App will be available at http://localhost:3000
```

## 🧪 Testing the System

### Test Accounts

#### Admin Account
```
Email: admin@foodhub.com
Password: admin123
Role: Admin
```

#### Test Restaurant Owner
```
Email: restaurant@foodhub.com
Password: rest123
Role: Restaurant Owner
```

#### Test Customer
```
Email: customer@foodhub.com
Password: cust123
Role: Customer
```

### Testing Payment
- The system simulates 90% payment success rate
- Set `simulateFailure: true` in payment request to test failure scenario
- Transaction IDs are auto-generated for tracking

### Testing Refunds
- Cancel delivered orders to test refund flow
- Refund amount will be reflected in ₹ INR
- Refund status: initiated → completed

## 💰 Currency & Pricing

- **All prices in Indian Rupees (₹)**
- Food items have prices in ₹
- Order totals shown in ₹
- Payment amounts in ₹
- Reports and revenue in ₹
- Earnings displayed in ₹ format

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control (RBAC)
- ✅ Protected routes on both frontend & backend
- ✅ CORS enabled for secure cross-origin requests
- ✅ Token expiration: 7 days
- ✅ Password validation on registration

## 📱 Responsive Design

- Mobile-first approach with Bootstrap
- Fully responsive on tablets and desktops
- Touch-friendly UI elements
- Optimized navigation for all screen sizes

## 🎯 Key Features Implemented

### Complete User Authentication System
- Role-based registration & login
- Token-based sessions with 7-day expiration
- Profile management for all user types

### Advanced Order Management
- Real-time order status tracking
- Payment processing with success/failure simulation
- Automatic refund processing for cancelled orders
- Transaction ID generation for tracking

### Restaurant Dashboard
- Complete menu management (CRUD)
- Order acceptance/rejection with reasoning
- Real-time order tracking
- Earnings dashboard with ₹ INR formatting

### Admin Control Panel
- User management (view, edit, delete)
- Restaurant approval workflow
- Comprehensive reporting system
- Revenue analytics by restaurant and dish

### Payment System
- Simulated payment gateway (90% success rate)
- Transaction tracking
- Refund management
- Payment receipts in ₹ INR

## 🚀 Deployment Ready

The application is structured for easy deployment:
- Environment-based configuration
- Database connection pooling ready
- Error handling and logging
- API documentation comments
- CORS configured for production

## 📝 Future Enhancements

- [ ] Email notifications for orders
- [ ] Real-time updates with WebSockets
- [ ] Image upload functionality
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] AI-based recommendations
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support
- [ ] Mobile app with React Native

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Built with ❤️ for Indian food lovers | All prices in ₹ INR | Payment simulation enabled**
