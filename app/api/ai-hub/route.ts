import { NextRequest, NextResponse } from 'next/server'
import { universalOrchestrate } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const prompt = body?.prompt
        const mode = body?.mode || "auto"
        const images = body?.images || []
        const audio = body?.audio || []

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
        }

        // First try local Python backend for fast/local mode.
        try {
            const localResponse = await fetch("http://127.0.0.1:55555/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim(), mode, images, audio }),
            })

            if (localResponse.ok) {
                const localData = await localResponse.json()
                const localText = localData?.response || localData?.output
                if (localText) {
                    return NextResponse.json({
                        output: localText,
                        type: 'text',
                        model_used: localData?.model_used || 'Local Backend',
                        latency: 'Fast (Local)'
                    })
                }
            }
        } catch {
            // Ignore local backend errors and fall through to cloud orchestrator.
        }

        // Cloud/parallel fallback
        console.log(`🚀 Routing AI request through Universal Orchestrate...`)
        const orchestrated = await universalOrchestrate(prompt, images, audio)

        // Handle multi-output (parallel tasks)
        if (orchestrated?.type === 'multi') {
            const multi = orchestrated as any
            return NextResponse.json({
                output: 'Parallel Tasks Completed',
                type: 'multi',
                outputs: multi.outputs,
                model_used: multi.model_used,
                latency: multi.latency
            })
        }

        const single = orchestrated as { output?: string; type?: string; model_used?: string; latency?: string }
        // Handle single text/image/video/audio output
        return NextResponse.json({
            output: single?.output || '',
            type: single?.type || 'text',
            model_used: single?.model_used || 'AI Orchestrator',
            latency: single?.latency || 'Standard'
        })

    } catch (error: any) {
        console.error('AI Hub Adapter Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process AI request' },
            { status: 500 }
        )
    }
}
