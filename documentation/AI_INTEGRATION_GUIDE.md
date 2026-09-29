> Archived setup reference: this document describes the original single-app layout. For current frontend/backend commands, environment variables, and deployment settings, follow the repository [README](../README.md).

# Step-by-Step Guide: Integrating Real AI APIs

## Overview
This guide will teach you how to replace the mock AI utilities with real AI services using OpenAI's API.

---

## Part 1: Prerequisites & Setup

### Step 1: Get an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)
6. **IMPORTANT**: Save it securely - you won't see it again!

### Step 2: Install Required Packages

Open your terminal and run:

```bash
npm install openai
```

This installs the official OpenAI SDK.

### Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root:

```bash
touch .env.local
```

2. Add your API key to `.env.local`:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Add `.env.local` to `.gitignore` (should already be there):

```
# .gitignore
.env.local
```

**Why?** Environment variables keep your API keys secure and out of your code.

---

## Part 2: Create Backend API Routes

### Step 4: Create API Route Structure

Next.js API routes run on the server, keeping your API key secure.

Create this folder structure:
```
app/
  api/
    ai/
      summarize/
        route.ts
      generate-code/
        route.ts
      chat/
        route.ts
      translate/
        route.ts
      generate-ideas/
        route.ts
```

### Step 5: Create the Text Summarizer API Route

Create `app/api/ai/summarize/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Get the text from the request
    const { text, length } = await request.json()

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Determine summary length instruction
    let lengthInstruction = 'medium-length'
    if (length === 'short') lengthInstruction = 'very brief'
    if (length === 'long') lengthInstruction = 'detailed'

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that creates ${lengthInstruction} summaries of text.`
        },
        {
          role: 'user',
          content: `Please summarize the following text:\n\n${text}`
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    // Extract the summary
    const summary = completion.choices[0]?.message?.content || 'Unable to generate summary'

    // Return the result
    return NextResponse.json({ summary })

  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
```

**What this does:**
- Receives text from the frontend
- Sends it to OpenAI's GPT-3.5
- Returns the AI-generated summary
- Handles errors gracefully

### Step 6: Create the Code Generator API Route

Create `app/api/ai/generate-code/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert programmer. Generate clean, well-commented ${language} code based on user requests.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const code = completion.choices[0]?.message?.content || 'Unable to generate code'

    return NextResponse.json({ code })

  } catch (error) {
    console.error('Code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}
```

### Step 7: Create the Chat API Route

Create `app/api/ai/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { allTools } from '@/lib/tools-data'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Create context about available tools
    const toolsContext = allTools.map(tool => 
      `${tool.name}: ${tool.description} (Category: ${tool.category}, Rating: ${tool.rating}/5)`
    ).join('\n')

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant with knowledge about AI tools. Here are the tools in our database:\n\n${toolsContext}\n\nHelp users find and learn about these tools.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
```

### Step 8: Create the Translation API Route

Create `app/api/ai/translate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate text from ${sourceLang} to ${targetLang} accurately while preserving meaning and tone.`
        },
        {
          role: 'user',
          content: `Translate this text: ${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const translation = completion.choices[0]?.message?.content || 'Unable to translate'

    return NextResponse.json({ translation })

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    )
  }
}
```

### Step 9: Create the Idea Generator API Route

Create `app/api/ai/generate-ideas/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { topic, category } = await request.json()

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a creative brainstorming assistant. Generate 5 unique, actionable ideas for the ${category} category.`
        },
        {
          role: 'user',
          content: `Generate 5 creative ideas related to: ${topic}`
        }
      ],
      temperature: 0.9,
      max_tokens: 800,
    })

    const ideas = completion.choices[0]?.message?.content || 'Unable to generate ideas'

    return NextResponse.json({ ideas })

  } catch (error) {
    console.error('Idea generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    )
  }
}
```

---

## Part 3: Update Frontend Components

### Step 10: Update Text Summarizer Component

Update `components/utilities/text-summarizer.tsx`:

Find the `handleSummarize` function and replace it with:

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

### Step 11: Update Code Generator Component

Update `components/utilities/code-generator.tsx`:

Replace the `handleGenerate` function:

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

### Step 12: Update AI Chatbot Component

Update `components/utilities/ai-chatbot.tsx`:

Replace the `handleSendMessage` function:

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

---

## Part 4: Testing & Deployment

### Step 13: Test Locally

1. Make sure your `.env.local` file has the API key
2. Restart your dev server:
```bash
npm run dev
```

3. Navigate to http://localhost:3000/utilities
4. Test each utility with real input
5. Check the browser console for any errors (F12)

### Step 14: Monitor API Usage

1. Go to https://platform.openai.com/usage
2. Monitor your API usage and costs
3. Set up usage limits to avoid unexpected charges

### Step 15: Add Error Handling & Loading States

Already implemented in the examples above! Each function:
- Shows loading state while processing
- Catches errors gracefully
- Displays user-friendly error messages

---

## Part 5: Cost Optimization

### Step 16: Implement Rate Limiting

Create `lib/rate-limiter.ts`:

```typescript
const rateLimitMap = new Map<string, number[]>()

export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  
  // Remove old timestamps
  const validTimestamps = timestamps.filter(t => now - t < windowMs)
  
  if (validTimestamps.length >= limit) {
    return false // Rate limit exceeded
  }
  
  validTimestamps.push(now)
  rateLimitMap.set(ip, validTimestamps)
  return true // Request allowed
}
```

Use it in your API routes:

```typescript
import { rateLimit } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  
  if (!rateLimit(ip, 10, 60000)) { // 10 requests per minute
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }
  
  // ... rest of your code
}
```

---

## Summary Checklist

✅ **Setup**
- [ ] Created OpenAI account
- [ ] Got API key
- [ ] Installed `openai` package
- [ ] Created `.env.local` file
- [ ] Added API key to environment variables

✅ **Backend**
- [ ] Created API routes folder structure
- [ ] Implemented summarize route
- [ ] Implemented code generation route
- [ ] Implemented chat route
- [ ] Implemented translation route
- [ ] Implemented idea generation route

✅ **Frontend**
- [ ] Updated Text Summarizer component
- [ ] Updated Code Generator component
- [ ] Updated AI Chatbot component
- [ ] Updated Language Translator component
- [ ] Updated Idea Generator component

✅ **Testing**
- [ ] Tested all utilities locally
- [ ] Checked error handling
- [ ] Monitored API usage
- [ ] Set usage limits

---

## Next Steps

1. **Add caching** to reduce API calls for similar requests
2. **Implement user authentication** to track usage per user
3. **Add streaming responses** for real-time output
4. **Create admin dashboard** to monitor API usage
5. **Add alternative AI providers** (Google AI, Anthropic Claude)

---

## Troubleshooting

**Error: "API key not found"**
- Check `.env.local` file exists
- Verify the key starts with `sk-`
- Restart your dev server

**Error: "Rate limit exceeded"**
- You've hit OpenAI's rate limits
- Wait a few minutes
- Consider upgrading your OpenAI plan

**Error: "Failed to fetch"**
- Check your internet connection
- Verify API routes are created correctly
- Check browser console for details

---

Need help with any specific step? Let me know!
