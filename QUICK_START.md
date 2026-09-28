# Quick Start Checklist - AI Integration

## 🚀 Getting Started (5 minutes)

### 1. Get Your API Key
- [ ] Go to https://platform.openai.com/signup
- [ ] Create account or sign in
- [ ] Navigate to API Keys section
- [ ] Click "Create new secret key"
- [ ] Copy the key (starts with `sk-...`)

### 2. Install Dependencies
```bash
npm install openai
```

### 3. Set Up Environment
Create `.env.local` in your project root:
```
OPENAI_API_KEY=sk-your-key-here
```

---

## 📁 Create API Routes (30 minutes)

### File Structure to Create:
```
app/api/ai/
├── summarize/route.ts
├── generate-code/route.ts
├── chat/route.ts
├── translate/route.ts
└── generate-ideas/route.ts
```

**Tip**: Copy the code from `AI_INTEGRATION_GUIDE.md` for each route!

---

## 🔧 Update Components (20 minutes)

### Files to Modify:
- [ ] `components/utilities/text-summarizer.tsx` - Update `handleSummarize`
- [ ] `components/utilities/code-generator.tsx` - Update `handleGenerate`
- [ ] `components/utilities/ai-chatbot.tsx` - Update `handleSendMessage`
- [ ] `components/utilities/language-translator.tsx` - Update `handleTranslate`
- [ ] `components/utilities/idea-generator.tsx` - Update `handleGenerate`

**What to change**: Replace the mock `setTimeout` logic with `fetch` calls to your API routes.

---

## ✅ Test Everything (10 minutes)

### 1. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test Each Utility
- [ ] Text Summarizer - Paste a long article
- [ ] Code Generator - Ask for a function
- [ ] AI Chatbot - Ask about a tool
- [ ] Language Translator - Translate a sentence
- [ ] Idea Generator - Enter a topic

### 3. Check for Errors
- [ ] Open browser console (F12)
- [ ] Look for any red errors
- [ ] Check Network tab for API calls

---

## 💰 Monitor Costs

### Set Up Usage Alerts
1. Go to https://platform.openai.com/account/billing/limits
2. Set a monthly budget (start with $5-10)
3. Enable email notifications

### Estimated Costs (GPT-3.5-turbo)
- Text Summarizer: ~$0.001 per request
- Code Generator: ~$0.002 per request
- Chatbot: ~$0.001 per message
- Translator: ~$0.001 per translation
- Idea Generator: ~$0.002 per request

**100 requests ≈ $0.10 - $0.20**

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ Utilities show "Loading..." state
- ✅ Real AI responses appear (not mock data)
- ✅ Responses are unique each time
- ✅ No errors in console
- ✅ API usage shows up in OpenAI dashboard

---

## 🆘 Common Issues

### "API key not found"
```bash
# Make sure .env.local exists
ls -la .env.local

# Restart dev server
npm run dev
```

### "Failed to fetch"
- Check internet connection
- Verify API route files exist
- Check file paths match exactly

### "Rate limit exceeded"
- Wait 1 minute
- Reduce request frequency
- Check OpenAI dashboard for limits

---

## 📚 Resources

- **Full Guide**: `AI_INTEGRATION_GUIDE.md`
- **OpenAI Docs**: https://platform.openai.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **OpenAI Pricing**: https://openai.com/pricing

---

## 🎓 What You'll Learn

By completing this integration, you'll understand:
1. ✅ How to securely use API keys
2. ✅ Creating backend API routes in Next.js
3. ✅ Making API calls from React components
4. ✅ Error handling and loading states
5. ✅ Working with OpenAI's API
6. ✅ Managing AI costs and rate limits

---

## 🚀 Next Level

After basic integration works:
- [ ] Add caching to reduce API calls
- [ ] Implement user authentication
- [ ] Add streaming responses
- [ ] Create usage analytics
- [ ] Try different AI models (GPT-4, Claude)

---

**Time to Complete**: ~1 hour
**Difficulty**: Intermediate
**Cost**: ~$0.50 for testing

Ready to start? Open `AI_INTEGRATION_GUIDE.md` and follow Step 1! 🎉
