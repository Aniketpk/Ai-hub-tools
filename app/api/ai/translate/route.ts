import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/ai-service'

// Language code to name mapping
const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
}

export async function POST(request: NextRequest) {
    try {
        // Get the text and languages from the request
        const { text, sourceLang, targetLang } = await request.json()

        // Validate input
        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            )
        }

        if (!sourceLang || !targetLang) {
            return NextResponse.json(
                { error: 'Source and target languages are required' },
                { status: 400 }
            )
        }

        if (sourceLang === targetLang) {
            return NextResponse.json(
                { error: 'Source and target languages cannot be the same' },
                { status: 400 }
            )
        }

        const sourceLangName = languageNames[sourceLang] || sourceLang
        const targetLangName = languageNames[targetLang] || targetLang

        console.log(`🌍 Translation request: ${sourceLangName} → ${targetLangName}`)

        // Create the translation prompt
        const systemPrompt = `You are a professional translator. Important instructions:
- Translate accurately and naturally
- Preserve the meaning and tone
- Maintain any formatting (line breaks, paragraphs)
- If the text is already in the target language, return it as-is
- Do not add any explanations or notes, only return the translated text`

        const prompt = `Translate the following text from ${sourceLangName} to ${targetLangName}:\n\n${text}`

        // Use unified generating service with fallback
        let translation = await generateWithFallback(prompt, systemPrompt)

        // Clean up the response (remove any markdown or extra formatting)
        translation = translation.trim()

        console.log('✅ Successfully translated text')

        // Return the result
        return NextResponse.json({ translation })

    } catch (err: unknown) {
        const error = err as Error
        console.error('❌ Translation error:', error)

        let errorMessage = 'Failed to translate text.'
        if (error.message) {
            errorMessage = error.message
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
