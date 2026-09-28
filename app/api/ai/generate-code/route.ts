import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        // Get the prompt and language from the request
        const { prompt, language } = await request.json()

        // Validate input
        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            )
        }

        console.log('💻 Code generation request:', prompt.substring(0, 50), 'Language:', language)

        // Create the prompt for code generation
        const systemPrompt = `You are an expert ${language} programmer. Generate clean, well-commented, production-ready code based on the user request.

Requirements:
- Write complete, runnable code
- Include helpful comments explaining key parts
- Follow best practices for ${language}
- Make the code clean and readable
- Include example usage if applicable

Generate only the code without any markdown formatting or code blocks. Just return the raw code.`

        // Use unified generating service with fallback
        let code = await generateWithFallback(prompt, systemPrompt)

        // Clean up the response (remove markdown code blocks if present)
        code = code.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim()

        console.log('✅ Successfully generated code')

        // Return the result
        return NextResponse.json({ code })

    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Code generation error:', error)

        let errorMessage = 'Failed to generate code.'
        if (error.message) {
            errorMessage = error.message
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
