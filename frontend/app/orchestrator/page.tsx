'use client'
import { apiUrl } from '@/lib/api'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Sparkles, Zap, Brain, Trash2, History } from 'lucide-react'

interface MessageOutput {
    type: string
    output: string
    model_used?: string
    latency?: string
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    type?: 'text' | 'image' | 'video' | 'audio' | 'multi'
    outputs?: MessageOutput[]
    model_used?: string
    latency?: string
}

const CHAT_STORAGE_KEY = 'ai-hub-orchestrator-history'

export default function OrchestratorChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<'auto' | 'gemma' | 'openai' | 'gemini'>('auto')
    const [attachedImages, setAttachedImages] = useState<string[]>([])
    const [attachedAudio, setAttachedAudio] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollRef = useRef<HTMLDivElement>(null)

    // Load saved chat history on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CHAT_STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed)
                }
            }
        } catch {
            // Ignore corrupted storage
        }
    }, [])

    // Save chat history whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
            } catch {
                // Storage full or unavailable
            }
        }
    }, [messages])

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const clearHistory = () => {
        setMessages([])
        localStorage.removeItem(CHAT_STORAGE_KEY)
    }

    // Renders text with bold (**text**), inline code (`code`), and newlines
    const renderText = (text: string) => {
        return text.split('\n').map((line, i, arr) => {
            const parts = line.split(/(\*\*.*?\*\*|`[^`]+`)/g)
            return (
                <span key={i}>
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>
                        }
                        if (part.startsWith('`') && part.endsWith('`')) {
                            return (
                                <code key={j} className="bg-black/30 rounded px-1 text-green-400 text-xs font-mono">
                                    {part.slice(1, -1)}
                                </code>
                            )
                        }
                        return part
                    })}
                    {i < arr.length - 1 && <br />}
                </span>
            )
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64 = event.target?.result as string
                const cleanBase64 = base64.split(',')[1] // Get only the data part
                if (file.type.startsWith('image/')) {
                    setAttachedImages(prev => [...prev, cleanBase64])
                } else if (file.type.startsWith('audio/')) {
                    setAttachedAudio(prev => [...prev, cleanBase64])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const removeFile = (type: 'image' | 'audio', index: number) => {
        if (type === 'image') {
            setAttachedImages(prev => prev.filter((_, i) => i !== index))
        } else {
            setAttachedAudio(prev => prev.filter((_, i) => i !== index))
        }
    }

    const handleSend = async () => {
        if ((!input.trim() && attachedImages.length === 0 && attachedAudio.length === 0) || isLoading) return

        const userMsg: Message = { 
            role: 'user', 
            content: input,
            outputs: [
                ...attachedImages.map(img => ({ type: 'image', output: `data:image/jpeg;base64,${img}` })),
                ...attachedAudio.map(aud => ({ type: 'audio', output: `data:audio/mp3;base64,${aud}` }))
            ]
        }
        setMessages(prev => [...prev, userMsg])
        const currentInput = input
        const currentImages = [...attachedImages]
        const currentAudio = [...attachedAudio]
        
        setInput('')
        setAttachedImages([])
        setAttachedAudio([])
        setIsLoading(true)

        try {
            const response = await fetch(apiUrl('/api/ai-hub'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt: currentInput, 
                    mode,
                    images: currentImages,
                    audio: currentAudio
                }),
            })

            const data = await response.json()

            if (data.error) throw new Error(data.error)

            const assistantMsg: Message = {
                role: 'assistant',
                content: data.output || data.result || 'No response received.',
                type: data.type || 'text',
                outputs: data.outputs,
                model_used: data.model_used,
                latency: data.latency
            }
            setMessages(prev => [...prev, assistantMsg])
        } catch (error: unknown) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${error instanceof Error ? error.message : String(error)}`,
                type: 'text'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto p-4 pt-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        AI Orchestrator
                    </h1>
                    <p className="text-muted-foreground">Production-ready hybrid intelligence</p>
                </div>

                <div className="flex items-center gap-3">
                    {messages.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5"
                        >
                            <Trash2 size={14} />
                            Clear
                        </Button>
                    )}
                    <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                        {(['auto', 'gemma', 'openai', 'gemini'] as const).map((m) => (
                            <Button
                                key={m}
                                variant={mode === m ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setMode(m)}
                                className="capitalize"
                            >
                                {m}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="flex-1 flex flex-col border-none bg-secondary/20 backdrop-blur-xl shadow-2xl min-h-0 overflow-hidden">
                {/* Message list — grows and scrolls */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0" ref={scrollRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 opacity-50">
                                <Brain size={48} className="text-primary animate-pulse" />
                                <div>
                                    <p className="text-xl font-medium">Ready to Orchestrate</p>
                                    <p className="text-sm">Ask anything – I&apos;ll choose the best model for the job.</p>
                                    <p className="text-xs mt-2 flex items-center justify-center gap-1">
                                        <History size={12} /> Chat history is saved automatically
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="max-w-[80%] space-y-2">
                                    <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`p-1.5 rounded-md ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <span className="text-xs font-semibold opacity-50 capitalize">{msg.role}</span>
                                    </div>

                                    <div className={`p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-secondary/80 backdrop-blur-md rounded-tl-none border border-white/10'
                                        }`}>
                                        {msg.role === 'user' && msg.outputs && msg.outputs.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {msg.outputs.map((out, idx) => (
                                                    <div key={idx} className="relative group">
                                                        {out.type === 'image' && <img src={out.output} className="h-20 w-20 object-cover rounded-lg border border-white/20" />}
                                                        {out.type === 'audio' && <div className="h-20 w-20 flex items-center justify-center bg-black/20 rounded-lg border border-white/20"><Bot size={24} /></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {msg.type === 'image' && (
                                            <div className="space-y-2">
                                                <img src={msg.content} alt="AI Generated" className="rounded-lg w-full max-w-md shadow-lg" />
                                                <p className="text-xs opacity-50 italic">Image generated from prompt</p>
                                            </div>
                                        )}
                                        {msg.type === 'video' && (
                                            <div className="space-y-2">
                                                <video src={msg.content} controls className="rounded-lg w-full max-w-md shadow-lg" />
                                                <p className="text-xs opacity-50 italic">Video generated from prompt</p>
                                            </div>
                                        )}
                                        {msg.type === 'multi' && msg.outputs && (
                                            <div className="space-y-4">
                                                {msg.outputs.map((out, idx) => (
                                                    <div key={idx} className="border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
                                                        <Badge variant="outline" className="text-[10px] mb-2">{out.type.toUpperCase()}</Badge>
                                                        {out.type === 'image' && <img src={out.output} className="rounded-lg w-full max-w-sm mb-2" />}
                                                        {out.type === 'video' && <video src={out.output} controls className="rounded-lg w-full max-w-sm mb-2" />}
                                                        {out.type === 'audio' && <audio src={out.output} controls className="w-full max-w-sm mb-2" />}
                                                        {out.type === 'text' && <p className="text-sm leading-relaxed">{renderText(out.output)}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {(!msg.type || msg.type === 'text') && (
                                            <p className="text-sm leading-relaxed">{renderText(msg.content)}</p>
                                        )}
                                    </div>

                                    {msg.model_used && (
                                        <div className="flex gap-2 items-center px-1">
                                            <Badge variant="outline" className="text-[10px] py-0 h-5 bg-green-500/10 text-green-500 border-green-500/20">
                                                <Zap size={10} className="mr-1" /> {msg.model_used}
                                            </Badge>
                                            {msg.latency && (
                                                <Badge variant="outline" className="text-[10px] py-0 h-5 border-white/5 opacity-50">
                                                    {msg.latency}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-4 rounded-2xl bg-secondary/80 animate-pulse flex items-center gap-2">
                                    <Sparkles size={16} className="text-primary animate-spin" />
                                    <span className="text-sm">Orchestrating response...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-secondary/40 border-t border-white/5 space-y-4">
                    {(attachedImages.length > 0 || attachedAudio.length > 0) && (
                        <div className="flex flex-wrap gap-2 pb-2">
                            {attachedImages.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={`data:image/jpeg;base64,${img}`} className="h-16 w-16 object-cover rounded-lg border border-white/10" />
                                    <button 
                                        onClick={() => removeFile('image', idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            ))}
                            {attachedAudio.map((aud, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="h-16 w-16 flex items-center justify-center bg-black/20 rounded-lg border border-white/10">
                                        <Bot size={20} className="text-blue-400" />
                                    </div>
                                    <button 
                                        onClick={() => removeFile('audio', idx)}
                                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2 relative">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            multiple 
                            accept="image/*,audio/*" 
                            className="hidden" 
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-12 w-12 bg-background/50 border border-white/10"
                        >
                            <Sparkles size={20} />
                        </Button>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message or attach files..."
                            className="bg-background/50 border-white/10 pr-12 h-12 flex-1"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="absolute right-1 top-1 h-10 w-10 p-0 rounded-lg group"
                        >
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
