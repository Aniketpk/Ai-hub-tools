import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithAI } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        const { image, prompt } = await request.json()

        if (!image) {
            return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
        }

        const analysisText = await analyzeImageWithAI(image, prompt)
        
        // Parse the AI response into a structured format
        // This is a simple heuristic-based parser for the Vision model result
        const description = analysisText.split('\n')[0] || "No description available."
        
        const objects = analysisText.includes('Objects') 
            ? analysisText.split('Objects')[1].split('\n').filter(l => l.includes(':')).slice(0, 5).map(l => ({ name: l.split(':')[0].trim(), confidence: 90 }))
            : []

        const tags = analysisText.match(/#\w+/g)?.map(t => t.slice(1)) || ["ai", "analyzed"]

        return NextResponse.json({
            analysis: {
                description,
                objects: objects.length > 0 ? objects : [{ name: "Image Scene", confidence: 95 }],
                colors: [{ name: "Detected", percentage: 100 }],
                text: "Parsed",
                mood: "Professional",
                tags: tags.slice(0, 5)
            }
        })

    } catch (error: any) {
        console.error('Image Analysis Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
