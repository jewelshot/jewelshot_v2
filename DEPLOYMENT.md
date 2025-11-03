# 🚀 Jewelshot V2 - Deployment Guide

## ✅ PRE-DEPLOYMENT CHECKLIST

### Code Status

- ✅ All features complete
- ✅ Zero lint errors
- ✅ Production prep complete
- ✅ Critical issues resolved
- ✅ Git committed

### Known Issues (Post-Launch TODO)

- ⚠️ Rate limiting disabled (will implement database-backed)
- ⚠️ Account deletion simplified (will implement API route)
- ⚠️ Password change has session note (will optimize)

---

## 📦 VERCEL DEPLOYMENT

### Step 1: Push to GitHub

```bash
# If not already on GitHub:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import from GitHub
4. Select: `jewelshot_v2`
5. Framework Preset: **Next.js** (auto-detected)

### Step 3: Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://cyopqscmkttfrnonvrqf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Bxc2Nta3R0ZnJub252cnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTUyMTAsImV4cCI6MjA3NzczMTIxMH0.3UbLbyJZ5-2nZPDUMsQ0MRmllEj5xy0Rbkp0afzGOO0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Bxc2Nta3R0ZnJub252cnFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE1NTIxMCwiZXhwIjoyMDc3NzMxMjEwfQ.Hw8zAx2YfQJbEqEgyuO79ADwIQ6go41DLWYN5R681bM
FAL_KEY=ce993b67-6ee4-4ed6-a6c3-060ebe0ef0af:94aa5e61817f27591450479136baf799
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** Update `NEXT_PUBLIC_APP_URL` after deployment!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. ✅ Deployment complete!

### Step 5: Update Supabase Settings

Go to Supabase Dashboard → Authentication → URL Configuration:

```
Site URL: https://your-app.vercel.app
Redirect URLs:
  - https://your-app.vercel.app/auth/callback
  - https://your-app.vercel.app/*
```

### Step 6: Update Vercel Environment

After first deploy, update:

```
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

Then: **Redeploy** (Deployments → ... → Redeploy)

---

## 🧪 POST-DEPLOYMENT TESTING

### Quick Smoke Test

1. **Landing Page**
   - Visit: `https://your-app.vercel.app`
   - Check: Hero, Features, CTA buttons

2. **Authentication**
   - Click "Sign Up"
   - Create test account
   - Verify email (check inbox)
   - Login

3. **Studio**
   - Upload jewelry image
   - Select preset (White Background)
   - Click "Generate"
   - Wait for result

4. **Gallery**
   - Navigate to /gallery
   - Check image display
   - Test filters
   - Click image for detail

5. **Settings**
   - Navigate to /settings
   - Check profile display
   - Upload avatar (optional)
   - Check storage stats

### Expected Results

✅ All pages load  
✅ Auth flow works  
✅ AI generation works (FAL.AI)  
✅ Images save to Supabase  
✅ Gallery displays  
✅ Settings accessible

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Error:** `Missing environment variables`

- Check all env vars are set in Vercel
- Restart deployment

**Error:** `Type errors`

- Run locally: `npm run build`
- Fix errors, commit, push

### Runtime Errors

**Error:** `Authentication failed`

- Check Supabase URL configuration
- Verify redirect URLs

**Error:** `AI generation failed`

- Check FAL_KEY is correct
- Check FAL.AI credits/account

**Error:** `Storage upload failed`

- Check Supabase Storage buckets exist
- Verify RLS policies

### Performance Issues

**Slow page loads:**

- Check Vercel Analytics
- Verify Supabase region
- Check FAL.AI response times

---

## 📊 MONITORING

### Vercel Dashboard

- Deployments: Check build status
- Analytics: Page views, performance
- Logs: Runtime errors

### Supabase Dashboard

- Database: Check tables, data
- Storage: Check file uploads
- Auth: Check user signups

### FAL.AI Dashboard

- Usage: Check generation count
- Credits: Monitor remaining balance
- Logs: Check for errors

---

## 🔧 POST-LAUNCH IMPROVEMENTS

### High Priority

1. **Database-backed Rate Limiting**
   - Use Supabase table for rate limits
   - Persist across lambda instances

2. **Proper Account Deletion**
   - Create API route with service role
   - Delete user data + storage + auth

3. **Password Change Optimization**
   - Use proper verification method
   - Avoid session override

### Medium Priority

4. **Error Tracking**
   - Integrate Sentry
   - Monitor production errors

5. **Analytics**
   - Google Analytics
   - Track user behavior

### Low Priority

6. **Studio Polish**
   - Before/after comparison
   - Progress tracking
   - History panel

---

## 📝 DEPLOYMENT CHECKLIST

```
Pre-Deploy:
✅ Code reviewed
✅ Critical issues fixed
✅ Git committed
✅ Environment variables ready

Deploy:
✅ Pushed to GitHub
✅ Imported to Vercel
✅ Environment variables set
✅ First deployment successful

Post-Deploy:
✅ Updated Supabase URLs
✅ Updated NEXT_PUBLIC_APP_URL
✅ Redeployed
✅ Smoke test complete

Launch:
✅ All features working
✅ No critical errors
✅ Monitoring setup
✅ 🎉 LIVE!
```

---

## 🎉 SUCCESS!

Your MVP is now LIVE! 🚀

Next steps:

1. Share with beta users
2. Collect feedback
3. Monitor errors
4. Iterate quickly
5. Improve based on real usage

---

## 📞 SUPPORT

Issues? Check:

- Vercel Logs
- Supabase Logs
- Browser Console
- Network Tab

---

**Good luck with your launch! 💎✨**
