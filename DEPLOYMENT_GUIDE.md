# AgroTrack Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier)
- MongoDB Atlas account (free tier)

## Step 1: Prepare MongoDB Database

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new cluster (free M0 tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## Step 2: Deploy Backend to Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   - **Name**: `agrotrack-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agrotrack
   ENABLE_SIMULATOR=true
   NODE_ENV=production
   ```

4. **Deploy Backend**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the backend URL: `https://agrotrack-backend.onrender.com`

## Step 3: Deploy Frontend to Render

1. **Create New Static Site**
   - Click "New" → "Static Site"
   - Connect same GitHub repository

2. **Configure Frontend Service**
   - **Name**: `agrotrack-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://agrotrack-backend.onrender.com
   ```

4. **Deploy Frontend**
   - Click "Create Static Site"
   - Wait for deployment to complete

## Step 4: Verify Deployment

1. **Test Backend**
   - Visit: `https://agrotrack-backend.onrender.com/health`
   - Should return JSON with status message

2. **Test Frontend**
   - Visit your frontend URL
   - Try login with: `admin@agro.com` / `admin`
   - Check dashboard for real-time data

## Step 5: Local Development Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Configure Local Environment**
   - Create `backend/.env`:
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/agrotrack
   ENABLE_SIMULATOR=true
   ```

3. **Start Development Servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## Troubleshooting

### CORS Issues
- Ensure backend CORS includes your frontend URL
- Check `server.js` CORS configuration

### Database Connection
- Verify MongoDB connection string
- Check network access in MongoDB Atlas

### Port Conflicts
- Kill processes using ports 3001/5000:
  ```bash
  netstat -ano | findstr :3001
  taskkill /PID [PID_NUMBER] /F
  ```

### Deployment Not Updating
- Force redeploy on Render dashboard
- Clear browser cache
- Check environment variables

## Project Structure
```
AgroTrack/
├── backend/
│   ├── models/
│   ├── .env
│   ├── server.js
│   └── simulator.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── config.js
│   └── dist/
└── DEPLOYMENT_GUIDE.md
```

## Live URLs
- **Frontend**: https://agrotrack-frontend.onrender.com
- **Backend**: https://agrotrack-backend.onrender.com
- **Health Check**: https://agrotrack-backend.onrender.com/health

## Demo Credentials
- **Email**: admin@agro.com
- **Password**: admin