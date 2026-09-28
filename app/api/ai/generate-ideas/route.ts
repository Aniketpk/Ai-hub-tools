import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        const { topic, category } = await request.json()

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
        }

        const systemPrompt = `You are a creative brainstorming assistant. Generate 5 unique and practical ideas for a ${category} project related to the provided topic.`
        const prompt = `Topic: ${topic}\nCategory: ${category}\n\nProvide 5 bullet points with a short description for each.`

        const response = await generateWithFallback(prompt, systemPrompt)
        
        // Extract 5 bullet points into an array
        const ideas = response.split('\n')
            .filter((line: string) => line.trim().match(/^[-*•\d]/) || line.trim().length > 10)
            .map((line: string) => line.replace(/^[-*•\d.]\s*/, '').trim())
            .slice(0, 5)

        return NextResponse.json({ ideas })

    } catch (error: any) {
        console.error('Idea Generation Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
