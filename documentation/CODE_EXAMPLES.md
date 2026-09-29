> Archived setup reference: this document describes the original single-app layout. For current frontend/backend commands, environment variables, and deployment settings, follow the repository [README](../README.md).

# Code Examples: Before & After

This document shows exactly what code to change in each utility component.

---

## Example 1: Text Summarizer

### ❌ BEFORE (Mock Implementation)

```typescript
const handleSummarize = async () => {
  if (!inputText.trim()) return

  setIsLoading(true)

  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock summary generation
  const sentences = inputText.split(".").filter((s) => s.trim().length > 0)
  let summaryText = ""

  switch (summaryLength) {
    case "short":
      summaryText = sentences.slice(0, Math.max(1, Math.floor(sentences.length * 0.3))).join(". ") + "."
      break
    case "medium":
      summaryText = sentences.slice(0, Math.max(2, Math.floor(sentences.length * 0.5))).join(". ") + "."
      break
    case "long":
      summaryText = sentences.slice(0, Math.max(3, Math.floor(sentences.length * 0.7))).join(". ") + "."
      break
  }

  setSummary(summaryText || "This text appears to be a concise summary of the key points from the original content.")
  setIsLoading(false)
}
```

### ✅ AFTER (Real AI Implementation)

```typescript
const handleSummarize = async () => {
  if (!inputText.trim()) return

  setIsLoading(true)

  try {
    // Call our API route
    const response = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        length: summaryLength,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate summary')
    }

    const data = await response.json()
    setSummary(data.summary)
  } catch (error) {
    console.error('Error:', error)
    setSummary('Sorry, there was an error generating the summary. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
```

### 🔑 Key Changes:
1. **Removed**: `setTimeout` mock delay
2. **Removed**: Manual sentence splitting logic
3. **Added**: `fetch` call to `/api/ai/summarize`
4. **Added**: Error handling with try/catch
5. **Added**: Proper error message for users

---

## Example 2: Code Generator

### ❌ BEFORE (Mock Implementation)

```typescript
const handleGenerate = async () => {
  if (!prompt.trim()) return

  setIsLoading(true)

  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // Mock code generation based on language
  const baseCode = mockCodeExamples[language] || mockCodeExamples.javascript
  const customCode = `// Generated code for: ${prompt}\n\n${baseCode}`

  setGeneratedCode(customCode)
  setIsLoading(false)
}
```

### ✅ AFTER (Real AI Implementation)

```typescript
const handleGenerate = async () => {
  if (!prompt.trim()) return

  setIsLoading(true)

  try {
    const response = await fetch('/api/ai/generate-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        language: language,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate code')
    }

    const data = await response.json()
    setGeneratedCode(data.code)
  } catch (error) {
    console.error('Error:', error)
    setGeneratedCode('// Sorry, there was an error generating code. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
```

### 🔑 Key Changes:
1. **Removed**: `mockCodeExamples` lookup
2. **Removed**: Template string concatenation
3. **Added**: API call with prompt and language
4. **Added**: Error handling
5. **Result**: Real, custom code based on user's exact request

---

## Example 3: AI Chatbot

### ❌ BEFORE (Mock Implementation)

```typescript
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputMessage.trim(),
    sender: "user",
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setInputMessage("")
  setIsLoading(true)

  // Simulate AI response delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const botResponse: Message = {
    id: (Date.now() + 1).toString(),
    content: getToolResponse(userMessage.content), // Mock function
    sender: "bot",
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, botResponse])
  setIsLoading(false)
}
```

### ✅ AFTER (Real AI Implementation)

```typescript
const handleSendMessage = async () => {
  if (!inputMessage.trim()) return

  const userMessage: Message = {
    id: Date.now().toString(),
    content: inputMessage.trim(),
    sender: "user",
    timestamp: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])
  setInputMessage("")
  setIsLoading(true)

  try {
    // Prepare conversation history for API
    const conversationHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage.content,
        conversationHistory: conversationHistory,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response')
    }

    const data = await response.json()

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: data.response,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botResponse])
  } catch (error) {
    console.error('Error:', error)
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Sorry, I encountered an error. Please try again.",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, errorMessage])
  } finally {
    setIsLoading(false)
  }
}
```

### 🔑 Key Changes:
1. **Removed**: `getToolResponse()` mock function
2. **Added**: Conversation history tracking
3. **Added**: API call with full context
4. **Added**: Proper error message handling
5. **Result**: Real conversational AI that remembers context

---

## Pattern to Follow

For **ANY** utility component, follow this pattern:

### Step 1: Find the handler function
Look for functions like:
- `handleSummarize`
- `handleGenerate`
- `handleTranslate`
- `handleSendMessage`

### Step 2: Replace the mock logic

```typescript
// ❌ Remove this pattern:
await new Promise((resolve) => setTimeout(resolve, 2000))
const mockResult = /* some mock data */
setResult(mockResult)

// ✅ Replace with this pattern:
try {
  const response = await fetch('/api/ai/your-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* your data */ }),
  })
  
  if (!response.ok) throw new Error('API call failed')
  
  const data = await response.json()
  setResult(data.result)
} catch (error) {
  console.error('Error:', error)
  setResult('Error message for user')
}
```

### Step 3: Keep the loading states
Don't change:
- `setIsLoading(true)` at the start
- `setIsLoading(false)` at the end (use `finally`)
- The UI components that show loading spinners

---

## Testing Your Changes

### 1. Before Testing
```bash
# Make sure .env.local exists with your API key
cat .env.local

# Should show:
# OPENAI_API_KEY=sk-...
```

### 2. Test Each Change
```bash
# Restart dev server
npm run dev

# Open browser
# Go to http://localhost:3000/utilities
# Test each utility one by one
```

### 3. Check for Success
✅ **Working correctly if:**
- Loading spinner appears
- Response is different each time
- Response is relevant to your input
- No errors in console

❌ **Not working if:**
- Immediate response (no loading)
- Same response every time
- Generic/template responses
- Errors in console

---

## Debugging Tips

### Check API Route
```bash
# Create a test file to verify API route exists
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text","length":"short"}'

# Should return JSON with summary
```

### Check Environment Variable
Add this to your API route temporarily:
```typescript
console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'))
```

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger a utility
4. Look for POST request to `/api/ai/...`
5. Check request payload and response

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting to restart server
```bash
# After changing .env.local, you MUST restart:
# Press Ctrl+C to stop
npm run dev
```

### ❌ Mistake 2: Wrong API route path
```typescript
// ❌ Wrong
fetch('/api/summarize')

// ✅ Correct
fetch('/api/ai/summarize')
```

### ❌ Mistake 3: Not handling errors
```typescript
// ❌ Wrong - no error handling
const data = await response.json()
setResult(data.result)

// ✅ Correct - with error handling
try {
  if (!response.ok) throw new Error('Failed')
  const data = await response.json()
  setResult(data.result)
} catch (error) {
  setResult('Error message')
}
```

### ❌ Mistake 4: Exposing API key in frontend
```typescript
// ❌ NEVER do this
const openai = new OpenAI({
  apiKey: 'sk-...' // EXPOSED TO USERS!
})

// ✅ Always use backend API routes
fetch('/api/ai/summarize') // API key stays on server
```

---

## Summary

**What you're changing:**
- Mock delays → Real API calls
- Template responses → AI-generated responses
- Local logic → Server-side processing

**What stays the same:**
- UI components
- Loading states
- Input validation
- Error messages (just different content)

**Time per component:** ~5 minutes
**Total time:** ~25 minutes for all 5 utilities

---

Ready to make the changes? Start with the Text Summarizer - it's the simplest one! 🚀
