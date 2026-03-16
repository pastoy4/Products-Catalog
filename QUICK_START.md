# Quick Start Deployment Checklist

## Before You Start
- [ ] Code is pushed to GitHub
- [ ] MongoDB Atlas account created
- [ ] Cloudinary account created
- [ ] Cloudflare account created
- [ ] Render account created

## Backend Deployment (Render)

1. **MongoDB Setup**
   - [ ] Create MongoDB Atlas cluster (M0 Free)
   - [ ] Create database user
   - [ ] Whitelist IP: `0.0.0.0/0` (or Render IPs)
   - [ ] Copy connection string

2. **Cloudinary Setup**
   - [ ] Get Cloud Name
   - [ ] Get API Key
   - [ ] Get API Secret

3. **Render Deployment**
   - [ ] Go to https://dashboard.render.com
   - [ ] New → Web Service
   - [ ] Connect GitHub repo
   - [ ] Configure:
     - Name: `product-catalog-backend`
     - Environment: `Node`
     - Build: `npm install`
     - Start: `npm start`
     - Plan: `Free`
   - [ ] Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://...
     JWT_SECRET=your_random_secret_32_chars_min
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_key
     CLOUDINARY_API_SECRET=your_secret
     PORT=10000
     ```
   - [ ] Deploy and wait
   - [ ] Test: `https://your-app.onrender.com/api/health`
   - [ ] **Copy backend URL** (you'll need it for frontend)

4. **Keep Service Awake (Optional but Recommended)**
   - [ ] Sign up for Uptime Robot: https://uptimerobot.com
   - [ ] Add New Monitor:
     - Type: HTTP(s)
     - URL: `https://your-app.onrender.com/api/health`
     - Interval: Every 5 minutes
   - [ ] This prevents Render from spinning down (free tier spins down after 15 min inactivity)

## Frontend Deployment (Cloudflare Pages)

1. **Update Configuration**
   - [ ] Edit `frontend/src/environments/environment.prod.ts`
   - [ ] Replace `your-app-name.onrender.com` with your actual Render URL
   - [ ] Commit and push to GitHub

2. **Cloudflare Pages Setup**
   - [ ] Go to https://dash.cloudflare.com
   - [ ] Workers & Pages → Create application
   - [ ] Pages → Connect to Git
   - [ ] Select your repository
   - [ ] Configure:
     - Project name: `product-catalog-frontend`
     - Framework: `Angular`
     - Build command: `cd frontend && npm install && npm run build`
     - Build output: `frontend/dist/frontend/browser`
   - [ ] Deploy and wait
   - [ ] Test: `https://your-project.pages.dev`

3. **Update Backend CORS**
   - [ ] Go back to Render dashboard
   - [ ] Add environment variable:
     ```
     FRONTEND_URL=https://your-project.pages.dev
     ```
   - [ ] Redeploy (auto-deploys on git push)

## Final Testing

- [ ] Frontend loads correctly
- [ ] API calls work (check browser console)
- [ ] No CORS errors
- [ ] Authentication works
- [ ] Product CRUD operations work
- [ ] Image uploads work

## Common Issues

**Backend 502 Error**: 
- Wait 30-50 seconds (cold start on free tier)
- **Solution**: Set up Uptime Robot to ping every 5 minutes (see step 4 above)

**CORS Error**: 
- Check `FRONTEND_URL` in Render matches your Cloudflare Pages URL
- Check `environment.prod.ts` has correct backend URL

**404 on Routes**: 
- Ensure `_redirects` file is in `frontend/public/`
- Check Cloudflare Pages build output directory

**API Not Found**:
- Verify backend URL in `environment.prod.ts`
- Check backend is running: `/api/health` endpoint

---

**Need Help?** See `DEPLOYMENT_GUIDE.md` for detailed instructions.
