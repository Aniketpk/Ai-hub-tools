import { NextRequest, NextResponse } from 'next/server'
import { powerfulSolve } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json()

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 })
        }

        const result = await powerfulSolve(query)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error('Powerful Solve Route Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
