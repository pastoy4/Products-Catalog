# Deployment Guide: Frontend (Cloudflare Pages) + Backend (Render)

This guide will walk you through deploying your Product Catalog application:
- **Frontend (Angular)**: Cloudflare Pages (Free Tier)
- **Backend (Node.js)**: Render (Free Tier)

---

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
   - Your code must be in a Git repository
   - Both Cloudflare Pages and Render can deploy from GitHub

2. **Cloudflare Account** (Free)
   - Sign up at: https://dash.cloudflare.com/sign-up

3. **Render Account** (Free)
   - Sign up at: https://render.com

4. **MongoDB Atlas** (Free Tier)
   - Sign up at: https://www.mongodb.com/cloud/atlas
   - Create a free cluster (M0)

5. **Cloudinary Account** (Free Tier)
   - Sign up at: https://cloudinary.com
   - For image uploads

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Your Backend

1. **Create a `.env` file template** (don't commit actual secrets):
   ```env
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Update CORS** (already done in `app.js` - we'll configure it properly)

### Step 2: Push Code to GitHub

1. Initialize git (if not already done):
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a GitHub repository and push:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your repository

3. **Configure the Service**:
   - **Name**: `product-catalog-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free" (spins down after 15 min of inactivity)

4. **Add Environment Variables**:
   Click "Environment" tab and add:
   ```
   PORT=10000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=your_very_long_random_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-app-name.onrender.com`

### Step 4: Test Your Backend

Visit: `https://your-app-name.onrender.com/api/health`

You should see: `{"success":true,"message":"Product Catalog API is running"}`

---

## Part 2: Frontend Deployment on Cloudflare Pages

### Step 1: Update Frontend Configuration

1. **Update `environment.prod.ts`** with your Render backend URL:
   ```typescript
   export const environment = {
       production: true,
       apiUrl: 'https://your-app-name.onrender.com/api',
   };
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

   The build output will be in `frontend/dist/frontend/browser/`

### Step 2: Push Frontend to GitHub

1. If frontend is in a separate repo or subdirectory:
   ```bash
   cd frontend
   git add .
   git commit -m "Update production environment"
   git push
   ```

### Step 3: Deploy on Cloudflare Pages

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com

2. **Navigate to Pages**:
   - Click "Workers & Pages" in sidebar
   - Click "Create application"
   - Select "Pages" → "Connect to Git"

3. **Connect Repository**:
   - Connect your GitHub account if not already
   - Select your repository
   - If frontend is in a subdirectory, you'll configure this next

4. **Configure Build Settings**:
   - **Project name**: `product-catalog-frontend`
   - **Production branch**: `main` (or `master`)
   - **Framework preset**: `Angular`
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/dist/frontend/browser`
   - **Root directory**: Leave empty (or set to `/` if repo root)

5. **Add Environment Variables** (if needed):
   - Usually not needed for static Angular builds
   - But you can add build-time variables if required

6. **Deploy**:
   - Click "Save and Deploy"
   - Wait for build (3-5 minutes)
   - Your site will be at: `https://your-project-name.pages.dev`

### Step 4: Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain and follow DNS setup instructions

---

## Part 3: Update Backend CORS for Production

After deploying frontend, update backend CORS to allow your Cloudflare Pages domain:

1. **Go to Render Dashboard** → Your backend service
2. **Environment Variables** → Add:
   ```
   FRONTEND_URL=https://your-project-name.pages.dev
   ```

3. **Update `backend/src/app.js`** to use this:
   ```javascript
   const corsOptions = {
     origin: process.env.FRONTEND_URL || 'http://localhost:4200',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```

4. **Redeploy** on Render (auto-deploys on git push)

---

## Part 4: Testing Your Deployment

1. **Test Backend**:
   - Health check: `https://your-backend.onrender.com/api/health`
   - Test API endpoints

2. **Test Frontend**:
   - Visit: `https://your-frontend.pages.dev`
   - Check browser console for errors
   - Test API calls

3. **Common Issues**:
   - **CORS errors**: Make sure `FRONTEND_URL` is set correctly in Render
   - **API not found**: Check `environment.prod.ts` has correct backend URL
   - **Build fails**: Check build logs in Cloudflare Pages

---

## Part 5: MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to MongoDB Atlas
   - Create free M0 cluster
   - Choose region closest to your Render region

2. **Database Access**:
   - Create database user
   - Set username and password

3. **Network Access**:
   - Add IP: `0.0.0.0/0` (allow all - for Render)
   - Or add Render's IP ranges if known

4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Use this as `MONGO_URI` in Render

---

## Part 6: Cloudinary Setup

1. **Dashboard**:
   - Go to Cloudinary Dashboard
   - Note your:
     - Cloud name
     - API Key
     - API Secret

2. **Add to Render**:
   - Add these as environment variables in Render

---

## Important Notes

### Render Free Tier Limitations:
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after spin-down takes ~30-50 seconds (cold start)
- 750 hours/month free (enough for always-on if you keep it active)
- Consider upgrading to paid tier for production

### Keep Render Service Awake with Uptime Robot (Free):

**Yes, it's possible!** Uptime Robot can ping your Render service every 5 minutes to prevent it from spinning down.

**Setup Steps:**

1. **Sign up for Uptime Robot** (Free tier):
   - Go to: https://uptimerobot.com
   - Create a free account (50 monitors allowed)

2. **Add a New Monitor**:
   - Click "Add New Monitor"
   - **Monitor Type**: Select "HTTP(s)"
   - **Friendly Name**: `Product Catalog Backend` (or any name)
   - **URL**: `https://your-app-name.onrender.com/api/health`
     - Use your actual Render backend URL
     - Use the `/api/health` endpoint (lightweight, perfect for pinging)
   - **Monitoring Interval**: Select "Every 5 minutes"
   - **Alert Contacts**: Add your email (optional, for downtime alerts)

3. **Save and Activate**:
   - Click "Create Monitor"
   - The monitor will start pinging your service every 5 minutes

**Benefits:**
- ✅ Keeps your Render service awake 24/7
- ✅ Prevents cold starts (no 30-50 second delays)
- ✅ Free tier allows 50 monitors
- ✅ 5-minute interval is perfect (well under 15-minute timeout)
- ✅ Also provides uptime monitoring and alerts

**Note**: The free tier of Uptime Robot is sufficient for this use case. Your Render service will stay active as long as Uptime Robot keeps pinging it every 5 minutes.

### Cloudflare Pages Free Tier:
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ Custom domains
- ✅ Automatic HTTPS
- ✅ Global CDN

### Security Best Practices:
1. Never commit `.env` files
2. Use strong `JWT_SECRET` (random 32+ character string)
3. Keep MongoDB credentials secure
4. Regularly update dependencies

---

## Troubleshooting

### Backend Issues:
- **502 Bad Gateway**: Service might be spinning up (wait 30-50 seconds)
  - **Solution**: Set up Uptime Robot to ping every 5 minutes to prevent spin-down (see "Keep Render Service Awake" section above)
- **Database connection error**: Check `MONGO_URI` format and network access
- **Port error**: Render sets `PORT` automatically, don't hardcode it

### Frontend Issues:
- **404 on routes**: Configure Angular routing for Cloudflare Pages (see `_redirects` file)
- **API calls fail**: Check CORS and `environment.prod.ts` URL
- **Build fails**: Check Node version compatibility

---

## Next Steps

1. Set up custom domain (optional)
2. Configure Cloudflare CDN settings
3. Set up monitoring/analytics
4. Consider upgrading Render plan for production use

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Angular Deployment**: https://angular.io/guide/deployment
