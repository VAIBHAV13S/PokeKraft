# Deployment Guide

## 1. Backend Deployment (Render)

1.  **Push Code to GitHub**: Ensure your project is in a GitHub repository.
2.  **Create New Web Service** on [Render](https://dashboard.render.com/).
3.  **Connect Repository**: Select your repo.
4.  **Configuration**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables**: Add these in the "Environment" tab:
    *   `GEMINI_API_KEY`: (Your Key)
    *   `PINATA_JWT`: (Your JWT)
    *   `PINATA_API_Key`: (Your Key)
    *   `PINATA_API_Secret`: (Your Secret)
    *   `NODE_VERSION`: `18` (Optional, good practice)

## 2. Frontend Deployment (Vercel)

1.  **Create New Project** on [Vercel](https://vercel.com/new).
2.  **Connect Repository**: Select the same repo.
3.  **Configuration**:
    *   **Root Directory**: `.` (Root) or leave default if it detects Vite.
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL`: `https://<your-render-backend-url>/api` (Get this URL from Render dashboard after backend deploys)
    *   `VITE_WALLET_CONNECT_PROJECT_ID`: (Your Project ID)

## 3. Final Steps

1.  **Update Vercel**: Once you have the Render URL, update the `VITE_API_URL` in Vercel and redeploy.
2.  **Test**: Open the Vercel URL and try generating!
