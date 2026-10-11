# Production Deployment Guide: Netlify + Render

This guide explains how to deploy **Ember & Co. (LighterShopDemo)** with automated CI/CD using **Render** (Backend API + Supabase PostgreSQL) and **Netlify** (Next.js Frontend). Every time you push to your `main` branch on GitHub, both services will build and deploy automatically.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │              GitHub Repo              │
                      │         (Push to main branch)         │
                      └──────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
    ┌───────────────────────────┐                 ┌───────────────────────────┐
    │       Netlify (UI)        │                 │       Render (API)        │
    │  - Next.js 16 App Router  │                 │  - FastAPI (Python 3.12)  │
    │  - Global Edge CDN        │                 │  - Uvicorn Web Service    │
    │  - Read from netlify.toml │                 │  - Read from render.yaml  │
    └─────────────┬─────────────┘                 └─────────────┬─────────────┘
                  │                                             │
                  │ /api/v1/* (Next.js Rewrite Proxy)           │ SQLAlchemy (asyncpg)
                  └────────────────────────────────────────────►│
                                                                ▼
                                                  ┌───────────────────────────┐
                                                  │    Supabase PostgreSQL    │
                                                  │  - 10 Relational Tables   │
                                                  └───────────────────────────┘
```

---

## Step 1: Deploy Backend on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **"New +"** in the top navigation and select **"Blueprint"** (or **"Web Service"**).
3. Connect your GitHub repository (`LighterShopDemo`).
4. Render will automatically detect the [`render.yaml`](./render.yaml) file in the root of the repository:
   - **Service Name**: `ember-lighter-api`
   - **Runtime**: `Python`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, fill in your secret credentials:
   - `DATABASE_URL`: `postgresql+asyncpg://postgres:j7azji%23DukDpD8%40@db.zoveewmermphizyxeazq.supabase.co:5432/postgres`
   - `RAZORPAY_KEY_ID`: `rzp_test_...` (your Razorpay key ID)
   - `RAZORPAY_KEY_SECRET`: `...` (your Razorpay secret)
   - `RAZORPAY_WEBHOOK_SECRET`: `...` (optional webhook secret)
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`
6. Click **Apply / Deploy**.
7. Once deployment finishes, Render will provide your public API URL:
   ```
   https://ember-lighter-api.onrender.com
   ```
   *(Verify it by visiting `https://ember-lighter-api.onrender.com/health` in your browser)*

---

## Step 2: Deploy Frontend on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and log in.
2. Click **"Add new site"** → **"Import an existing project"** → Select **GitHub**.
3. Choose your `LighterShopDemo` repository.
4. Netlify will automatically detect [`netlify.toml`](./netlify.toml) with these settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Go to **"Site configuration"** → **"Environment variables"** and add:
   | Variable Name | Value | Purpose |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_BACKEND_URL` | `https://ember-lighter-api.onrender.com` | Points all Next.js API calls to your live Render backend |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay public key for checkout popup |
6. Click **"Deploy site"**. Netlify will build and deploy your site in ~45 seconds.

---

## Step 3: Verify the Live Deployment

1. Open your Netlify site URL (e.g. `https://ember-and-co.netlify.app`).
2. Verify that:
   - The hero product and lighter collection grid loads dynamically from Supabase.
   - Adding retail/wholesale items updates the live cart drawer.
   - Clicking **"Proceed to Checkout"** initiates the Razorpay modal.
   - Navigation links (`/collection`, `/wholesale`, `/approach`, `/contact`, `/checkout/track`) all respond instantly.

---

## Automatic CI/CD Workflow

Once connected:
```bash
git add .
git commit -m "update lighter catalog or styles"
git push origin main
```
- **Render** automatically redeploys your Python backend when changes occur in `backend/`.
- **Netlify** automatically rebuilds and deploys your Next.js storefront when changes occur in `frontend/`.
