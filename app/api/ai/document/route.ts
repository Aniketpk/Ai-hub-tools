import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/ai-service'
import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

export async function POST(request: NextRequest) {
    try {
        const { documentContent, query, type, fileType } = await request.json()

        if (!documentContent) {
            return NextResponse.json(
                { error: 'Document content is required' },
                { status: 400 }
            )
        }

        let processedContent = documentContent

        // Process PDF and DOCX
        if (fileType === 'pdf') {
            try {
                const buffer = Buffer.from(documentContent, 'base64')
                const parser = new PDFParse({ data: buffer })
                try {
                    const data = await parser.getText()
                    processedContent = data.text
                } finally {
                    await parser.destroy()
                }
            } catch (error) {
                console.error('PDF parsing error:', error)
                return NextResponse.json(
                    { error: 'Failed to parse PDF file' },
                    { status: 400 }
                )
            }
        } else if (fileType === 'docx') {
            try {
                const buffer = Buffer.from(documentContent, 'base64')
                const result = await mammoth.extractRawText({ buffer })
                processedContent = result.value
            } catch (error) {
                console.error('DOCX parsing error:', error)
                return NextResponse.json(
                    { error: 'Failed to parse DOCX file' },
                    { status: 400 }
                )
            }
        }

        // Limit content length to avoid token limits (approx 30k chars for safety)
        const truncatedContent = processedContent.substring(0, 30000)

        // System prompt defining the assistant's behavior
        const systemPrompt = `You are an advanced AI Document Assistant inside the AI Hub Tools platform.

Your role is to help users understand uploaded documents.

STRICT RULES:
- Answer ONLY using the provided document content.
- Do NOT use outside knowledge.
- Do NOT guess or hallucinate.
- If the answer is not present in the document, respond clearly:
  "This information is not available in the uploaded document."

DOCUMENT CONTENT:
"""
${truncatedContent} 
"""

Task: ${type === 'summary' ? 'Summarize the document' : 'Answer the user question'}

${type === 'summary' ? `
DOCUMENT SUMMARIZATION BEHAVIOR:
- If the user asks for a short summary:
  • Provide 5–7 bullet points
  • Focus only on key ideas
  • Use very simple language

- If the user asks for a medium summary:
  • Write 1–2 structured paragraphs
  • Cover all major topics
  • Keep the explanation student-friendly

- If the user asks for a detailed summary:
  • Organize the summary using headings
  • Explain concepts clearly
  • Include definitions, processes, and steps if present
  • Make it suitable for exam preparation
` : `
DOCUMENT QUESTION ANSWERING BEHAVIOR:
- **Direct Answer**: Start with a clear, direct answer to the user's question.
- **Detailed Explanation**: Explain the "Why" and "How" based on the document. Don't just state facts; explain the reasoning if the document provides it.
- **Student-Friendly**: Break down complex concepts into simple steps or bullet points.
- **Context**: Use specific details from the document to support your answer.
- **Exam-Mode**: If the question asks for an explanation, provide a thorough, well-structured response suitable for learning.
`}

ANSWER FORMAT RULES:
- Use short paragraphs
- Use bullet points where applicable
- Avoid unnecessary verbosity
- Do not repeat the question
- Do not mention “document context” in the final answer

STUDENT-FRIENDLY MODE:
- Use simple English
- Explain technical terms if they appear in the document
- Prefer clarity over complexity

FAIL-SAFE RESPONSE:
If the question cannot be answered from the document:
- Clearly say the information is not available
- Do not attempt to infer or explain outside content.`

        // Use unified generating service with fallback
        const reply = await generateWithFallback(query, systemPrompt)

        return NextResponse.json({ reply })

    } catch (error: unknown) {
        const err = error as Error
        console.error('Document Assistant Error:', err)

        // Provide more specific error messages
        let errorMessage = 'Failed to process document'
        if (err.message) errorMessage = err.message

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
