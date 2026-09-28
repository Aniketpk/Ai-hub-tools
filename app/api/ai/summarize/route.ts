import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/ai-service'

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

        console.log('📝 Summarizing text, length:', text.length, 'characters')

        // Determine summary length instruction
        let lengthInstruction = 'medium-length'
        if (length === 'short') lengthInstruction = 'very brief'
        if (length === 'long') lengthInstruction = 'detailed'

        const systemPrompt = `You are a helpful assistant that creates ${lengthInstruction} summaries of text.`
        const prompt = `Please summarize the following text:\n\n${text}`

        // Use unified generating service with fallback
        const summary = await generateWithFallback(prompt, systemPrompt)

        console.log('✅ Successfully generated summary')

        // Return the result
        return NextResponse.json({ summary })

    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Summarization error:', error)

        let errorMessage = 'Failed to generate summary.'
        if (error.message) {
            errorMessage = error.message
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
