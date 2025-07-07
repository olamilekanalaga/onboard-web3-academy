# Academia Admin Dashboard - Vercel Deployment Guide

## 🚀 Deploy to Vercel (Recommended Method)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to admin dashboard folder**:
   ```bash
   cd admin-dashboard
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push admin-dashboard folder to a separate GitHub repository**
2. **Go to [vercel.com](https://vercel.com) and click "New Project"**
3. **Import your admin-dashboard repository**
4. **Configure the following settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option 3: Deploy as Subdirectory (Current Repo)

1. **Go to [vercel.com](https://vercel.com) and import your current repository**
2. **In project settings, set**:
   - **Root Directory**: `admin-dashboard`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## 🔧 Environment Variables

Add these environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🌐 Custom Domain (Optional)

1. **In Vercel Dashboard** → Your Project → Settings → Domains
2. **Add your custom domain** (e.g., `admin.yourdomain.com`)
3. **Configure DNS** as instructed by Vercel

## 🔒 Security Considerations

- The admin dashboard should be deployed on a separate subdomain
- Consider adding authentication middleware
- Restrict access to admin users only
- Use environment variables for all sensitive data

## 📝 Build Configuration

The project is configured with:
- **Vite** as the build tool
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for routing (SPA mode)

## 🚨 Important Notes

- Make sure your Supabase RLS policies allow admin access
- Test the deployment with your actual Supabase credentials
- The dashboard will be accessible at your Vercel URL (e.g., `your-project.vercel.app`)
