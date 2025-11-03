# 🚀 Supabase Setup Guide - Jewelshot V2

## Step 1: Create Supabase Project (5 min)

### 1.1 Go to Supabase Dashboard

👉 **https://supabase.com/dashboard**

### 1.2 Create New Project

- Click **"New Project"**
- **Project Name:** `jewelshot-v2` (or your choice)
- **Database Password:** Choose a strong password (save it!)
- **Region:** Choose closest to you (e.g., `Europe West (Frankfurt)`)
- Click **"Create new project"**

⏳ Wait 2-3 minutes for project to initialize...

---

## Step 2: Get API Keys (1 min)

### 2.1 Go to Project Settings

- Click **Settings** (gear icon) → **API**

### 2.2 Copy the following:

```
✅ Project URL:  https://xxxxxxxxxxxxx.supabase.co
✅ anon public:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (use carefully!)
```

---

## Step 3: Update .env.local (1 min)

Add these values to your `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FAL.AI
FAL_KEY=your_fal_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 4: Run Migration (2 min)

### Option A: SQL Editor (Recommended for first time)

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Copy the entire content of `supabase/migrations/20241103000001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

✅ **Success:** You should see "Success. No rows returned"

### Option B: Supabase CLI (Advanced)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Push migration
supabase db push
```

---

## Step 5: Verify Tables (1 min)

### 5.1 Check Table Editor

Go to **Table Editor** in Supabase dashboard.

You should see these tables:

- ✅ `profiles`
- ✅ `images`
- ✅ `projects`
- ✅ `ai_generations`

### 5.2 Check Storage

Go to **Storage** in Supabase dashboard.

You should see these buckets:

- ✅ `images`
- ✅ `avatars`
- ✅ `thumbnails`

---

## Step 6: Test Authentication (Optional)

### 6.1 Enable Email Auth

Go to **Authentication** → **Providers** → Enable **Email**

### 6.2 Configure Email Templates (Optional)

Go to **Authentication** → **Email Templates**

- Customize confirmation email
- Customize password reset email

### 6.3 Enable OAuth Providers (Optional - for Phase B)

- **Google OAuth:** Enable and add Client ID/Secret
- **GitHub OAuth:** Enable and add Client ID/Secret

---

## ✅ Setup Complete!

Your database is ready! 🎉

**Next Steps:**

- Update `.env.local` with your credentials
- Restart dev server
- Move to Phase B (Authentication Pages)

---

## 🆘 Troubleshooting

### Migration Fails?

- Check SQL syntax errors in output
- Make sure UUID extension is enabled
- Try running migration in parts

### Can't see tables?

- Refresh the Table Editor
- Check SQL Editor for error messages
- Verify migration ran successfully

### RLS Issues?

- Make sure RLS policies were created
- Check Authentication → Policies in dashboard
- Test with actual user (create test account)

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
