# 🚀 Deployment Guide

## 📋 Prerequisites
- GitHub Repository: https://github.com/HarisShah1122/prescription_full-stack_doctor_appointment_app.git
- Vercel Account (for frontend)
- Render Account (for backend)
- MongoDB Atlas (for database)
- Cloudinary Account (for image uploads)

## 🔧 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Configure environment variables:
   ```
   VITE_BACKEND_URL=https://your-backend-url.onrender.com
   ```
6. Click "Deploy"

### Step 2: Update Backend URL
After Vercel deployment, update the `VITE_BACKEND_URL` in:
- Vercel dashboard → Project Settings → Environment Variables
- `frontend/vercel.json` file (replace `your-backend-url.onrender.com`)

## 🖥️ Backend Deployment (Render)

### Step 1: Deploy to Render
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure deployment:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18.x`

### Step 2: Set Environment Variables
Add these environment variables in Render dashboard:
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-db-name
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 3: Update CORS
In `backend/server.js`, update the CORS origin:
```javascript
app.use(cors({
  origin: "https://your-frontend-url.vercel.app", // Your Vercel URL
  credentials: true
}));
```

## 🔄 Final Steps

### 1. Update URLs
- Replace `your-backend-url.onrender.com` with your actual Render URL
- Replace `your-frontend-url.vercel.app` with your actual Vercel URL
- Update CORS in backend to point to Vercel URL

### 2. Test Deployment
1. Visit your Vercel URL
2. Try login/registration
3. Test appointment booking
4. Check browser console for any API errors

### 3. Database Setup
- Ensure MongoDB Atlas allows connections from Render (whitelist Render IP)
- Test database connection from Render dashboard

## 🐛 Common Issues & Fixes

### CORS Issues
```javascript
// In backend/server.js
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"],
  credentials: true
}));
```

### Environment Variables
- Double-check all environment variables are set
- Restart Render service after updating variables
- Check Render logs for missing variables

### Build Issues
- Ensure `package.json` has correct build scripts
- Check Node.js version compatibility
- Verify all dependencies are installed

## 📱 URLs After Deployment
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend**: `https://your-app-name.onrender.com`
- **API Endpoints**: `https://your-app-name.onrender.com/api/*`

## 🔍 Monitoring
- **Vercel**: Dashboard → Functions tab for logs
- **Render**: Dashboard → Logs tab for server logs
- **MongoDB Atlas**: Cluster monitoring for database performance

## 🚀 Quick Deploy Commands
```bash
# Push latest changes
git add .
git commit -m "Ready for deployment"
git push origin main

# Services will auto-deploy on push
```

## 📞 Support
- Vercel Documentation: https://vercel.com/docs
- Render Documentation: https://render.com/docs
- MongoDB Atlas: https://docs.mongodb.com/atlas
