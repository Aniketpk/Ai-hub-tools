"use client"

import { useState } from "react"
import { Lightbulb, Copy, Download, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion } from "framer-motion"
import { AIProcessingPulse, AIResultMotion } from "@/components/ai-motion"

export default function IdeaGenerator() {
    const [topic, setTopic] = useState("")
    const [ideas, setIdeas] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [category, setCategory] = useState("general")

    const categories = [
        { value: "general", label: "General" },
        { value: "business", label: "Business" },
        { value: "content", label: "Content Creation" },
        { value: "product", label: "Product Design" },
        { value: "marketing", label: "Marketing" },
        { value: "coding", label: "Coding Projects" },
    ]

    const handleGenerate = async () => {
        if (!topic.trim()) return

        setIsLoading(true)

        try {
            const response = await fetch('/api/ai/generate-ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, category }),
            })

            const data = await response.json()
            
            if (!response.ok) throw new Error(data.error)

            setIdeas(data.ideas)
        } catch (error: any) {
            console.error("Idea generation failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const copyAll = () => {
        navigator.clipboard.writeText(ideas.join("\n\n"))
    }

    const downloadIdeas = () => {
        const content = ideas.join("\n\n")
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "ideas.txt"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="topic-input" className="text-base font-semibold">
                        Topic or Problem
                    </Label>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="category-select" className="text-sm">
                            Category:
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-40 dark:bg-card dark:border-border dark:text-foreground">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-card dark:border-border">
                                {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value} className="dark:text-foreground dark:hover:bg-muted">
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Textarea
                    id="topic-input"
                    placeholder="Enter a topic, industry, or problem you want ideas for..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                    className="border-2 focus:border-primary resize-none"
                />

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Be specific to get more relevant ideas
                    </div>

                    <Button onClick={handleGenerate} disabled={!topic.trim() || isLoading} className="min-w-32">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Thinking...
                            </>
                        ) : (
                            <>
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Generate Ideas
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <AnimatePresence mode="wait">
            {isLoading ? <AIProcessingPulse key="loading" label="Finding ideas for your topic" /> : ideas.length > 0 && (
                <AIResultMotion key="ideas"><Card className="border-2 border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Generated Ideas</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {categories.find((c) => c.value === category)?.label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={copyAll}>
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy All
                                </Button>
                                <Button variant="outline" size="sm" onClick={downloadIdeas}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {ideas.map((idea, index) => (
                                <motion.div key={`${index}-${idea.slice(0, 24)}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 22, delay: Math.min(index * .055, .33) }} className="bg-background p-4 rounded-lg border border-border shadow-sm group relative hover:border-primary/50 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <p className="text-foreground leading-relaxed flex-1">{idea}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => copyToClipboard(idea)}
                                            title="Copy idea"
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card></AIResultMotion>
            )}
            </AnimatePresence>

            {/* Tips */}
            <Card className="bg-muted/30">
                <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 text-sm">💡 Brainstorming tips:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Combine different concepts to create something unique</li>
                        <li>• Focus on solving specific problems for a niche audience</li>
                        <li>• Look for gaps in the current market</li>
                        <li>• Don&apos;t judge ideas initially - quantity leads to quality</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
