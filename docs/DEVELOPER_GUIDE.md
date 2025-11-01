# 🛠️ Developer Guide & Command Reference

## 🖥️ Terminal Commands

### Backend Development

```bash
# Navigate to backend
cd backend

# Install dependencies (first time)
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Check MongoDB connection
mongosh
> use online-food-ordering
> db.users.find()
```

### Frontend Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies (first time)
npm install

# Start React development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Install new package
npm install package-name
```

### Database Management

```bash
# Start MongoDB (if not running as service)
mongod

# Connect to MongoDB with Mongo Shell
mongosh

# View all databases
show databases

# Use specific database
use online-food-ordering

# View all collections
show collections

# Find all users
db.users.find()

# Find admin users
db.users.find({ role: "admin" })

# Find all restaurants
db.restaurants.find()

# Count orders
db.orders.countDocuments()

# Clear database (CAREFUL!)
db.dropDatabase()
```

---

## 📌 Key Configuration Files

### Backend .env
```properties
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/online-food-ordering
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### Frontend baseURL (if needed)
Update in services:
```javascript
const API_URL = "http://localhost:5000/api";
```

---

## 🧪 API Testing Commands (cURL)

### Register Customer
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Restaurants
```bash
curl -X GET http://localhost:5000/api/restaurants
```

### Admin Get Statistics
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔐 Default Test Accounts

### Admin (Create in MongoDB)
```javascript
// Hash password first: "admin123" → bcrypt 10 rounds
db.users.insertOne({
  name: "Admin User",
  email: "admin@foodhub.com",
  password: "$2a$10$...",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Restaurant Owner
```
Email: owner@foodhub.com
Password: owner123
Role: restaurant
```

### Customer
```
Email: customer@foodhub.com
Password: cust123
Role: customer
```

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Start MongoDB
mongod

# Or on Mac with Homebrew
brew services start mongodb-community
```

### Issue: Port 3000/5000 Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure backend is running on port 5000
- Check CORS middleware in server.js
- Frontend should be on different port (3000)

### Issue: Token Expired
```
Invalid or expired token
```
**Solution:**
- Re-login to get new token
- Check JWT_SECRET matches
- Verify token format: "Bearer TOKEN"

### Issue: 404 Not Found
```
Cannot POST /api/restaurants/register
```
**Solution:**
- Check route exists in backend
- Verify URL spelling
- Check middleware order in server.js

### Issue: Module Not Found
```
Cannot find module 'express'
```
**Solution:**
```bash
npm install
```

---

## 📝 Code Snippets for Common Tasks

### Get Token from Login
```javascript
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'john@test.com',
  password: 'password123'
});
const token = response.data.token;
localStorage.setItem('token', token);
```

### Make Authenticated Request
```javascript
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5000/api/orders', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Format Currency in JSX
```javascript
<p>₹{parseFloat(amount).toFixed(2)}</p>
```

### Add Item to MongoDB
```javascript
db.restaurants.insertOne({
  name: "Pizza Palace",
  description: "Best pizza",
  address: "Mumbai",
  owner: ObjectId("64a..."),
  approvalStatus: "approved",
  rating: 0,
  totalOrders: 0,
  totalEarnings: 0,
  isActive: true
})
```

---

## 🚀 Deployment Checklist

- [ ] Change JWT_SECRET in .env
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas connection
- [ ] Update API_URL in frontend
- [ ] Build frontend: `npm run build`
- [ ] Test all endpoints
- [ ] Set up HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging
- [ ] Configure email notifications
- [ ] Set up database backups

---

## 📊 Database Backup

### Export Database
```bash
mongodump --db online-food-ordering --out ./backup
```

### Import Database
```bash
mongorestore --db online-food-ordering ./backup/online-food-ordering
```

---

## 🔍 Debugging Tips

### Enable Detailed Logging
```javascript
// In server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Check Network in Browser
```javascript
// Open DevTools (F12) → Network tab
// See all API calls and responses
```

### Debug Backend with console.log
```javascript
// In routes
console.log('User:', req.user);
console.log('Body:', req.body);
console.log('Params:', req.params);
```

### Check Frontend State
```javascript
// In useEffect
console.log('Cart:', cart);
console.log('User:', user);
console.log('Token:', token);
```

---

## 📚 Project Structure Reminder

```
project/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── index.html
│
└── docs/
    ├── COMPLETE_README.md
    ├── QUICK_START.md
    ├── IMPLEMENTATION_SUMMARY.md
    └── project_information.txt
```

---

## 🎓 Learning Resources

### Express.js
- https://expressjs.com/
- Route handlers, middleware, error handling

### MongoDB
- https://docs.mongodb.com/
- Schema design, indexing, queries

### React
- https://react.dev/
- Components, hooks, state management

### React Router
- https://reactrouter.com/
- Routing, protected routes, navigation

### JWT
- https://jwt.io/
- Token structure, security

### Axios
- https://axios-http.com/
- HTTP requests, interceptors

---

## ✅ Pre-Deployment Checklist

### Backend
- [ ] All environment variables set
- [ ] MongoDB connection tested
- [ ] All endpoints working
- [ ] Error handling in place
- [ ] CORS configured
- [ ] Rate limiting considered
- [ ] Security headers added
- [ ] Logging configured

### Frontend
- [ ] All pages working
- [ ] Protected routes functional
- [ ] API URLs correct
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] Environment variables set

### Database
- [ ] Indexes created
- [ ] Data validation rules set
- [ ] Backup strategy planned
- [ ] Recovery tested

---

## 🤝 Team Collaboration

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/restaurant-approval

# Make changes
git add .
git commit -m "Add restaurant approval feature"

# Push to remote
git push origin feature/restaurant-approval

# Create pull request on GitHub
```

### Code Review Checklist
- [ ] Code follows project style
- [ ] Tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 📞 Support & Help

### Common Questions

**Q: How do I add a new field to User model?**
A: Update `models/User.js`, add to schema, then update any routes that use it.

**Q: How do I create a new page?**
A: Create file in `pages/`, add route in `App.js`, import components.

**Q: How do I call an API from React?**
A: Use axios service from `services/`, import useAuth for token.

**Q: How do I format prices as ₹?**
A: Use template literal: `₹${price.toFixed(2)}`

**Q: How do I protect a route?**
A: Wrap with `<ProtectedRoute requiredRole="customer">`

---

## 🎉 You're Ready to Go!

With this guide and the complete implementation, you have everything needed to:
- ✅ Develop new features
- ✅ Fix bugs
- ✅ Deploy to production
- ✅ Scale the application
- ✅ Add new functionality

**Happy coding! 🚀**
