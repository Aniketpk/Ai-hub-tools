import { NextRequest, NextResponse } from 'next/server'
import { allTools } from '@/lib/tools-data'
import { generateWithFallback } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        // Get the message from the request
        const { message, conversationHistory } = await request.json()

        // Validate input
        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        console.log('💬 Chat message received:', message.substring(0, 50))

        // Build context about available tools
        const toolsContext = allTools.map(tool =>
            `- ${tool.name}: ${tool.description} (Category: ${tool.category}, Rating: ${tool.rating}/5)`
        ).join('\n')

        // Create system prompt with tool knowledge
        const systemPrompt = `You are the "AI Utilities Assistant", a highly advanced, witty, and powerful hybrid-intelligence agent for AI Hub.

About AI Hub:
- We are a cutting-edge platform for discovering, reviewing, and using AI tools.
- We feature a modern, glassmorphic "Gen-Z" design with dark mode by default.
- We offer both a searchable directory of external AI tools and built-in "AI Utilities".

Pricing Plans:
1. Free Plan ($0): 5 generations/day, basic models, standard speed.
2. Pro Plan ($19/mo): Unlimited generations, GPT-4 & Claude 3 access, fast speed, no watermarks. (Popular)
3. Team Plan ($49/mo): Collaboration tools, admin dashboard, API access.

Navigation & Features:
- /search: Browse our comprehensive directory of AI tools with filters.
- /utilities: Access built-in tools like Text Summarizer, Code Generator, Image Analyzer, etc.
- /pricing: Upgrade your plan.
- /dashboard: Manage your account (logged-in users).

Your Role:
- You are an expert on all the tools listed below.
- Guide users to the right tools for their specific problems.
- Explain our pricing plans if asked about limits or upgrades.
- Use a friendly, slightly casual, and professional tone.
- If a user asks about a specific tool in our database, provide its details (rating, category, etc.).

Available External Tools Database:
${toolsContext}

Previous conversation context:
${conversationHistory && conversationHistory.length > 0
                ? conversationHistory.map((msg: { sender: string; content: string }) => `${msg.sender}: ${msg.content}`).join('\n')
                : 'None'
            }`

        // Use unified generating service with fallback
        const reply = await generateWithFallback(message, systemPrompt)

        return NextResponse.json({ reply })

    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Chat error:', error)
        
        let errorMessage = 'Failed to generate response.'
        if (error.message?.includes('404')) {
            errorMessage = 'Model not found or deprecated. Trying alternative models...'
        } else if (error.message) {
            errorMessage = error.message
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
