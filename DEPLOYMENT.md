# Deployment Guide

## Backend Deployment (Render)

### Prerequisites
1. MongoDB Atlas account and cluster
2. Render account
3. GitHub repository

### Steps

1. **Set up MongoDB Atlas**
   - Create a new cluster on MongoDB Atlas
   - Create a database user
   - Whitelist your IP (0.0.0.0/0 for Render)
   - Get your connection string

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign in
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: online-food-order-backend
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free or Starter

3. **Environment Variables**
   Set these in Render dashboard under Environment:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online-food-order?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL (e.g., `https://online-food-order-backend.onrender.com`)

## Frontend Deployment (Netlify)

### Prerequisites
1. Netlify account
2. Backend deployed and URL available

### Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

3. **Environment Variables**
   Set these in Netlify dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Your site will be available at a Netlify URL

## Post-Deployment Checklist

### Backend
- [ ] MongoDB connection working
- [ ] JWT authentication working
- [ ] All API endpoints responding
- [ ] CORS configured correctly

### Frontend
- [ ] API calls pointing to production backend
- [ ] All routes working
- [ ] Images and assets loading
- [ ] Responsive design working

### Testing
- [ ] User registration/login
- [ ] Restaurant browsing
- [ ] Order placement
- [ ] Admin dashboard access
- [ ] Payment simulation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend domain
2. **API Connection**: Verify REACT_APP_API_URL is set correctly
3. **Database Connection**: Check MongoDB Atlas connection string
4. **Build Failures**: Ensure all dependencies are in package.json

### Environment Variables

Make sure all required environment variables are set:

**Backend (Render):**
- `NODE_ENV=production`
- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong, random secret key
- `PORT=5000`

**Frontend (Netlify):**
- `REACT_APP_API_URL` - Your Render backend URL with `/api` suffix

## Domain Configuration (Optional)

### Custom Domain on Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

### HTTPS
Both Render and Netlify provide automatic HTTPS certificates.

## Monitoring

- **Render**: Check logs in Render dashboard
- **Netlify**: Monitor deployments and functions in Netlify dashboard
- **MongoDB Atlas**: Monitor database performance and connections