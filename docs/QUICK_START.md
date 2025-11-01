# 🚀 Quick Start Guide - Online Food Ordering System (India)

## Installation & Setup (5 minutes)

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start MongoDB (if not running)
# On Windows: mongod
# On Mac: brew services start mongodb-community

# Start server
npm run dev
```

**Backend will run on: http://localhost:5000**

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend will run on: http://localhost:3000**

---

## 🧪 Quick Testing Workflow

### Step 1: Create Test Accounts

**As Customer:**
1. Go to http://localhost:3000/register
2. Fill form:
   - Name: John Doe
   - Email: john@foodhub.com
   - Password: password123
   - Role: Customer
3. Click Register → Auto login → Redirected to home

**As Restaurant Owner:**
1. Go to Register
2. Fill form:
   - Name: Pizza Palace
   - Email: pizzapalace@foodhub.com
   - Password: rest123
   - Role: Restaurant Owner
3. Register → Redirected to setup (waiting for admin approval)

**As Admin (Create via MongoDB):**
```javascript
// Connect to MongoDB and insert:
db.users.insertOne({
  name: "Admin User",
  email: "admin@foodhub.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "admin",
  isActive: true
})
```

### Step 2: Admin Approves Restaurant

1. Login as Admin
2. Go to /admin/dashboard
3. View pending restaurants
4. Click Approve restaurant

### Step 3: Restaurant Owner Setup

1. Login as Restaurant Owner
2. Dashboard shows "Approved! Setup your restaurant"
3. Fill restaurant details:
   - Name: Pizza Palace
   - Address: Mumbai, India
   - Description: Best pizza in town
4. Save

### Step 4: Add Menu Items

1. Go to Menu Management
2. Click "Add Food Item"
3. Fill:
   - Name: Margherita Pizza
   - Price: 250 (₹)
   - Category: Pizza
   - Prep Time: 20 mins
4. Save

### Step 5: Customer Orders

1. Login as Customer
2. Home page shows restaurants
3. Click "View Menu"
4. See all available items
5. Add item to cart → Quantity 2
6. Click "View Cart"
7. See items with prices in ₹
8. Click "Checkout"

### Step 6: Payment Simulation

1. Choose payment method
2. Click "Pay Now"
3. **90% success** - Order confirmed
4. See Order Confirmation with Transaction ID

### Step 7: Restaurant Receives Order

1. Login as Restaurant Owner
2. Go to Orders
3. See pending orders from customers
4. Click "Accept Order"
5. Update status: Preparing → Ready → Out for Delivery → Delivered

### Step 8: Customer Cancels & Gets Refund

1. Login as Customer
2. Go to "My Orders"
3. Find order with status "Accepted"
4. Click "Cancel Order"
5. See refund confirmation with amount in ₹

### Step 9: View Reports (Admin)

1. Login as Admin
2. Go to Reports
3. See:
   - Total Revenue: ₹X,XXX (₹ formatted)
   - Top 10 Restaurants
   - Top 10 Dishes
   - All with ₹ currency

---

## 📊 API Testing with Postman

### 1. Register Customer
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Customer",
  "email": "john@test.com",
  "password": "password123",
  "role": "customer",
  "phone": "9876543210",
  "address": "Mumbai, India"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "john@test.com",
  "password": "password123"
}
Response: { token: "eyJhbGc..." }
```

### 3. Get All Restaurants
```
GET http://localhost:5000/api/restaurants
Headers:
Authorization: Bearer {token}
```

### 4. Place Order
```
POST http://localhost:5000/api/orders
Headers:
Authorization: Bearer {token}
Body:
{
  "items": [
    {
      "foodItem": "64a1b2c3d4e5f6g7h8i9j0k1",
      "quantity": 2
    }
  ],
  "deliveryAddress": "123 Main St, Mumbai",
  "paymentMethod": "card"
}
```

### 5. Process Payment
```
POST http://localhost:5000/api/orders/64a1b2c3d4e5f6g7h8i9j0k1/payment
Headers:
Authorization: Bearer {token}
Body:
{
  "paymentMethod": "card",
  "simulateFailure": false
}
```

### 6. Get Revenue Report (Admin)
```
GET http://localhost:5000/api/admin/reports/revenue
Headers:
Authorization: Bearer {admin-token}
Response: { totalRevenue: "₹15,250", ... }
```

---

## 🔑 Key Features Checklist

### ✅ Customer Features
- [ ] Browse restaurants with search
- [ ] View menus with items & prices in ₹
- [ ] Add items to cart
- [ ] Place orders with delivery address
- [ ] Simulate payment (90% success)
- [ ] Cancel orders and get refunds in ₹
- [ ] View order history
- [ ] Rate and review items/restaurants
- [ ] Download receipts

### ✅ Restaurant Features
- [ ] Register and await approval
- [ ] Manage menu (add/edit/delete items)
- [ ] Set prices in ₹ and availability
- [ ] View incoming orders
- [ ] Accept/reject orders
- [ ] Update order status
- [ ] View customer feedback
- [ ] See earnings in ₹
- [ ] Dashboard with metrics

### ✅ Admin Features
- [ ] Manage all users (view/edit/delete)
- [ ] Approve/reject restaurants
- [ ] View all orders & payments
- [ ] Generate reports (₹ INR)
- [ ] Top restaurants report
- [ ] Top dishes report
- [ ] System statistics

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB?
```bash
# Make sure MongoDB is running
mongod

# Check connection string in .env
MONGO_URI=mongodb://127.0.0.1:27017/online-food-ordering
```

### Port 3000 or 5000 already in use?
```bash
# Kill process on port (Windows)
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Mac/Linux
lsof -i :3000
kill -9 {PID}
```

### CORS errors?
- Make sure backend is running on port 5000
- Frontend on port 3000
- Check axios baseURL in services

### Auth token expired?
- Token expires in 7 days
- Re-login to get new token
- Token stored in localStorage

---

## 💡 Tips & Tricks

1. **Payment Success Rate**: 90% by default, set `simulateFailure: true` to test failures
2. **All Prices in ₹**: Currency symbol ₹ used throughout
3. **Role-based Access**: Try accessing admin routes as customer - blocked ✓
4. **Refund Logic**: Automatically processes when cancelling delivered orders
5. **Reports**: All revenue/earnings shown in ₹ INR format
6. **Restaurant Status**: Can only place orders from "approved" restaurants

---

## 📚 Documentation Files

- **COMPLETE_README.md** - Full project documentation
- **docs/project_information.txt** - Architecture & design
- **.env** - Environment configuration

---

## 🎉 You're All Set!

The system is now ready to use with:
- ✅ 40+ API endpoints
- ✅ 3 user roles (Admin, Restaurant, Customer)
- ✅ Payment simulation & refund logic
- ✅ All prices in ₹ INR
- ✅ Professional React frontend
- ✅ Protected routes & RBAC

**Happy ordering! 🍔🍕🍜**
