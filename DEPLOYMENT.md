# Deployment Guide for Render

## Prerequisites
1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository to Render
3. Make sure your code is pushed to GitHub

## Part 1: Deploy Backend (API)

### Step 1: Create a Web Service
1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Choose the repository containing your project

### Step 2: Configure Backend Service
- **Name**: `todo-backend` (or any name you prefer)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### Step 3: Set Environment Variables
In the Environment Variables section, add:
```
NODE_ENV=production
DATABASE_URL=[your database URL - see database setup below]
JWT_SECRET=[generate a strong secret key]
FRONTEND_URL=[will be filled after frontend deployment]
```

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

## Part 2: Set Up Database

### Option A: Render PostgreSQL (Recommended)
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name it `todo-database`
3. Choose the free plan
4. Click "Create Database"
5. Copy the "External Database URL" from the database info page
6. Add this URL as the `DATABASE_URL` environment variable in your backend service

### Option B: Use another database service
- You can use Railway, Supabase, or any other PostgreSQL provider
- Just get the connection string and use it as `DATABASE_URL`

## Part 3: Deploy Frontend

### Step 1: Create a Static Site
1. In Render dashboard, click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure the site:

- **Name**: `todo-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 2: Set Environment Variables
Add this environment variable:
```
VITE_API_URL=[your backend URL from step 1]
```

The backend URL will look like: `https://todo-backend-xxx.onrender.com`

### Step 3: Deploy
Click "Create Static Site"

## Part 4: Update CORS Configuration

After both services are deployed:

1. Go to your backend service environment variables
2. Update `FRONTEND_URL` with your frontend URL (e.g., `https://todo-frontend-xxx.onrender.com`)
3. Redeploy the backend service

## Part 5: Initialize Database

After your backend is deployed and database is connected:

1. Go to your backend service logs
2. The database should be automatically migrated due to the build command
3. If not, you can trigger a manual deploy to run the migrations

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` environment variable is set correctly in backend
2. **Database Connection**: Verify `DATABASE_URL` is correct and database is accessible
3. **Build Failures**: Check the build logs for missing dependencies or syntax errors
4. **API Not Found**: Ensure your frontend `VITE_API_URL` points to the correct backend URL

### Environment Variables Summary:

**Backend (.env)**:
```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**Frontend (.env)**:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Notes:
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleeping might take 30-60 seconds
- For production apps, consider upgrading to paid plans for better performance
- Always use HTTPS URLs in production environment variables
