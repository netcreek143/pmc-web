# Vercel Deployment Guide

Follow these steps to deploy your site and ensure it works perfectly in production.

## 1. Environment Variables
You must add these variables in your **Vercel Project Settings -> Environment Variables**.

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qoeqwtjjyilzcyliwdkh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Get from Supabase Dashboard)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Get from Supabase Dashboard)* |

> [!IMPORTANT]
> Ensure you use the keys for the **Active Project** (qoeqwtjjyilzcyliwdkh).

## 2. Connect to Vercel
1. Push your latest code to your **GitHub** repository.
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import your repository.
4. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Paste the Environment Variables.
6. Click **Deploy**.

## 3. Verification
- [ ] **Home & Shop**: Verify all 4 products are visible.
- [ ] **Admin Login**: Log in with your super admin or employee credentials.
- [ ] **API Check**: Go to `/api/products` to verify JSON data loads.
