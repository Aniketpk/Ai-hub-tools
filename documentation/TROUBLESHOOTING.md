> Archived setup reference: this document describes the original single-app layout. For current frontend/backend commands, environment variables, and deployment settings, follow the repository [README](../README.md).

# 🔧 Troubleshooting 500 Error

## What the Error Means

`POST /api/ai/summarize 500` means the API route is failing. This is usually due to:

1. ❌ Missing or invalid API key
2. ❌ Server not restarted after adding API key
3. ❌ OpenAI API issues (quota, billing, etc.)

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Terminal Output

Look at your terminal where `npm run dev` is running. You should see one of these messages:

**If you see:**
```
❌ OPENAI_API_KEY is not set in environment variables
```
→ **Solution:** Add your API key to `.env.local` and restart server

**If you see:**
```
✅ API key found, length: 51
```
→ Good! API key is loaded. Check next step.

**If you see:**
```
❌ Summarization error: [error details]
```
→ Read the error message for specific issue

---

### Step 2: Verify .env.local File

```bash
# Check if file exists
ls -la .env.local

# View contents (safe - won't show in Git)
cat .env.local
```

**Should look like:**
```
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

**Common mistakes:**
- ❌ `OPENAI_API_KEY=sk-your-api-key-here` (placeholder not replaced)
- ❌ `OPENAI_API_KEY = sk-...` (spaces around =)
- ❌ `OPENAI_API_KEY="sk-..."` (quotes not needed)
- ❌ Key is incomplete or has line breaks

**Correct format:**
```
OPENAI_API_KEY=sk-proj-your-full-key-here-no-spaces-no-quotes
```

---

### Step 3: Restart Server (CRITICAL!)

Environment variables only load when the server starts!

```bash
# Stop the server
# Press Ctrl+C (or Cmd+C on Mac)

# Start again
npm run dev

# Wait for "Ready" message
```

---

### Step 4: Check API Key Validity

1. Go to: https://platform.openai.com/api-keys
2. Find your key in the list
3. Check if it shows "Active" status
4. If it says "Revoked" or doesn't exist, create a new one

---

### Step 5: Check OpenAI Account Status

1. Go to: https://platform.openai.com/account/billing/overview
2. Check if you have:
   - ✅ Free credits available, OR
   - ✅ Payment method added and working
3. If no credits and no payment method:
   - Add a payment method
   - Or wait for free credits to be granted

---

## 🧪 Test the API Key

### Quick Test Command

```bash
# Replace YOUR_API_KEY with your actual key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**If working:** You'll see a list of models
**If broken:** You'll see an error message

---

## 📋 Common Error Messages & Solutions

### "Invalid API key"
**Cause:** Key is wrong or revoked
**Solution:**
1. Go to https://platform.openai.com/api-keys
2. Create a new key
3. Copy it completely
4. Replace in `.env.local`
5. Restart server

### "Insufficient quota"
**Cause:** No credits/billing
**Solution:**
1. Go to https://platform.openai.com/account/billing
2. Add payment method OR wait for free credits
3. Set usage limits

### "API key not configured"
**Cause:** `.env.local` not loaded
**Solution:**
1. Verify `.env.local` exists in project root
2. Check it has `OPENAI_API_KEY=sk-...`
3. **Restart the server!**

### "Rate limit exceeded"
**Cause:** Too many requests
**Solution:**
1. Wait 1 minute
2. Try again
3. Consider upgrading plan

---

## ✅ Verification Checklist

Run through this checklist:

- [ ] `.env.local` file exists in project root
- [ ] File contains `OPENAI_API_KEY=sk-...`
- [ ] API key is complete (starts with `sk-`, ~51 characters)
- [ ] No spaces, quotes, or line breaks in the key
- [ ] Server was restarted after adding key
- [ ] OpenAI account has credits or payment method
- [ ] API key is "Active" on OpenAI dashboard

---

## 🔬 Advanced Debugging

### Check Environment Variable in Code

Add this temporarily to `app/api/ai/summarize/route.ts`:

```typescript
console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
console.log('API Key length:', process.env.OPENAI_API_KEY?.length)
console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'))
```

Then check terminal output when you make a request.

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try the summarizer
4. Look for error messages
5. Check Network tab for the API response

---

## 🆘 Still Not Working?

### Option 1: Use Mock Mode (Temporary)

If you want to continue without real AI:

1. The utilities still work with mock data
2. You can integrate AI later
3. Everything else functions normally

### Option 2: Try a New API Key

1. Delete the old key on OpenAI dashboard
2. Create a brand new key
3. Copy it carefully
4. Add to `.env.local`
5. Restart server

### Option 3: Check OpenAI Status

Visit: https://status.openai.com/
- Check if OpenAI services are down
- Look for any ongoing incidents

---

## 📞 Getting More Help

### What to Check:
1. Terminal output (where `npm run dev` is running)
2. Browser console (F12 → Console)
3. Network tab (F12 → Network → look for `/api/ai/summarize`)
4. OpenAI dashboard (billing, API keys, usage)

### Information to Gather:
- Exact error message from terminal
- Browser console errors
- API key status on OpenAI dashboard
- Account billing status

---

## 💡 Quick Fixes

### Fix 1: Fresh Start
```bash
# 1. Stop server (Ctrl+C)
# 2. Delete .env.local
rm .env.local

# 3. Create new .env.local
echo "OPENAI_API_KEY=your-new-key-here" > .env.local

# 4. Start server
npm run dev
```

### Fix 2: Verify Installation
```bash
# Check if openai package is installed
npm list openai

# Should show: openai@x.x.x

# If not, reinstall:
npm install openai --legacy-peer-deps
```

---

**Most common issue:** Forgetting to restart the server after adding the API key!

**Second most common:** Using the placeholder `sk-your-api-key-here` instead of a real key!

Try these first! 🚀
