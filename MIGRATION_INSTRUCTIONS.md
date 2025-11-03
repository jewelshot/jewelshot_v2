# 🚀 Business MVP - Migration Instructions

## ⚠️ CRITICAL: Run This BEFORE Testing!

The Business MVP requires database schema updates. Follow these steps **exactly** to enable the credit system.

---

## 📊 Step 1: Run Database Migration

### Go to Supabase Dashboard:

1. Open: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
2. Copy the ENTIRE contents of: `supabase/migrations/20241103000002_add_credits.sql`
3. Paste into SQL Editor
4. Click **"Run"**

### Expected Output:

```
Success. No rows returned.
```

If you see any errors, **STOP** and check the error message.

---

## ✅ Step 2: Verify Migration

Run this query to verify:

```sql
-- Check if credits column exists
SELECT
  id,
  email,
  credits,
  plan
FROM profiles
LIMIT 1;
```

**Expected Result:**

- Should return columns: `id`, `email`, `credits`, `plan`
- `credits` should be `10` (default)
- `plan` should be `'free'` (default)

---

## 🧪 Step 3: Test Existing Users

If you have existing users, run this to give them credits:

```sql
-- Give all existing users 10 free credits
UPDATE profiles
SET
  credits = 10,
  plan = 'free'
WHERE credits IS NULL OR credits = 0;
```

---

## 🎯 Step 4: Verify Functions

Check if functions were created:

```sql
-- List all custom functions
SELECT proname
FROM pg_proc
WHERE proname IN ('deduct_credit', 'add_credits', 'has_credits');
```

**Expected Result:**

- 3 rows returned
- `deduct_credit`
- `add_credits`
- `has_credits`

---

## 🚨 Troubleshooting

### Error: "column already exists"

**Solution:** Migration already ran. Skip to Step 2 to verify.

### Error: "function already exists"

**Solution:** Migration already ran. This is OK.

### Error: "permission denied"

**Solution:** Make sure you're using the **service_role** key or running in the SQL Editor (which has admin access).

---

## 📋 What This Migration Does

### 1. Adds Columns to `profiles`:

- `credits` (INTEGER, default 10)
- `plan` (TEXT, default 'free')

### 2. Creates Functions:

- `deduct_credit(user_id)` - Removes 1 credit
- `add_credits(user_id, amount)` - Adds credits
- `has_credits(user_id)` - Checks if user has credits

### 3. Creates `purchases` Table:

- Tracks credit purchases
- For Stripe integration (Phase 2)

### 4. Sets Up Indexes:

- For fast credit queries

---

## ✅ After Migration

1. **Test Signup:**
   - Create new account
   - Should get 10 credits automatically

2. **Test Generation:**
   - Upload image
   - Generate AI photo
   - Credits should decrease to 9

3. **Test Limit:**
   - Use all 10 credits
   - Generate button should be disabled
   - "Buy Credits" prompt should appear

---

## 🎉 You're Ready!

Once migration is complete:

- ✅ Credit system is live
- ✅ Storage limits enforced (1GB)
- ✅ All features working

**Next:** Test the app at http://localhost:3001 (or deploy to Vercel!)

---

## 🆘 Need Help?

If something goes wrong:

1. Check the Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify API keys in `.env.local`

---

**Migration File:** `supabase/migrations/20241103000002_add_credits.sql`
