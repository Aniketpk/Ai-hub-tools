"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Send, Loader2, File, X, BookOpen, List, AlignLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { AIProcessingPulse } from "@/components/ai-motion"

interface Message {
    id: string
    content: string
    sender: "user" | "bot"
    timestamp: Date
}

export default function DocumentAssistant() {
    const reduceMotion = Boolean(useReducedMotion())
    const [file, setFile] = useState<File | null>(null)
    const [fileContent, setFileContent] = useState<string>("")
    const [fileType, setFileType] = useState<string>("text")
    const [summaryLevel, setSummaryLevel] = useState<"short" | "medium" | "detailed">("medium")
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isProcessingFile, setIsProcessingFile] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const result = reader.result as string
                // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
                const base64 = result.split(',')[1]
                resolve(base64)
            }
            reader.onerror = error => reject(error)
        })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        setIsProcessingFile(true)
        setFile(selectedFile)

        try {
            let content = ""
            let type = "text"

            if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
                type = "pdf"
                content = await convertToBase64(selectedFile)
            } else if (selectedFile.name.toLowerCase().endsWith('.docx') || selectedFile.name.toLowerCase().endsWith('.doc')) {
                type = "docx"
                content = await convertToBase64(selectedFile)
            } else {
                content = await selectedFile.text()
            }

            setFileContent(content)
            setFileType(type)

            toast({
                title: "File Loaded",
                description: `Successfully loaded ${selectedFile.name}`,
            })
            // Add initial greeting
            setMessages([{
                id: "1",
                content: `I've analyzed **${selectedFile.name}**. You can now ask me questions about it, or request a summary.`,
                sender: "bot",
                timestamp: new Date()
            }])
        } catch (error) {
            console.error("Error reading file:", error)
            toast({
                title: "Error",
                description: "Failed to read file content.",
                variant: "destructive"
            })
            setFile(null)
        } finally {
            setIsProcessingFile(false)
        }
    }

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !fileContent) return

        const userMsg: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: "user",
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        setInputMessage("")
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai/document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentContent: fileContent,
                    fileType,
                    query: userMsg.content,
                    type: 'chat'
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error)

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: data.reply,
                sender: "bot",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to get answer. " + (error as Error).message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSummary = async (level: "short" | "medium" | "detailed") => {
        if (!fileContent) return

        setIsLoading(true)
        setSummaryLevel(level)

        // Add user message for UI
        const userMsg: Message = {
            id: Date.now().toString(),
            content: `Generate a ${level} summary of the document.`,
            sender: "user",
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])

        try {
            const response = await fetch('/api/ai/document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentContent: fileContent,
                    fileType,
                    query: level,
                    type: 'summary'
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error)

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: data.reply,
                sender: "bot",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate summary.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const clearFile = () => {
        setFile(null)
        setFileContent("")
        setMessages([])
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div className="flex h-[min(600px,85dvh)] min-h-0 flex-col gap-4 md:flex-row">
            {/* Sidebar / Upload Area */}
            <div className="w-full md:w-1/3 space-y-4">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Document Source</CardTitle>
                        <CardDescription>Upload a file to analyze</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        {!file ? (
                            <div
                                className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-40 flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Click to upload file</p>
                                <p className="text-xs text-muted-foreground mt-1">Text, Markdown, PDF, DOCX, Code</p>
                            </div>
                        ) : (
                            <div className="bg-muted/50 p-4 rounded-lg relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={clearFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm line-clamp-1">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="outline" className="text-[10px] bg-background">Ready</Badge>
                                    <Badge variant="secondary" className="text-[10px] uppercase">{fileType}</Badge>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html,.pdf,.docx,.doc"
                            onChange={handleFileChange}
                        />

                        {file && (
                            <div className="space-y-2 pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Quick Actions</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleSummary("short")}
                                    disabled={isLoading}
                                >
                                    <List className="h-4 w-4 mr-2" /> Short Summary
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleSummary("medium")}
                                    disabled={isLoading}
                                >
                                    <AlignLeft className="h-4 w-4 mr-2" /> Medium Summary
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleSummary("detailed")}
                                    disabled={isLoading}
                                >
                                    <BookOpen className="h-4 w-4 mr-2" /> Detailed Summary
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Chat Area */}
            <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-2 border-primary/10 shadow-lg">
                <CardHeader className="py-3 px-4 border-b bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-md">
                                <Info className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base">Document Assistant</CardTitle>
                                <CardDescription className="text-xs">Ask questions or request summaries</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative min-h-0 flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full min-h-0 p-4">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4 mt-20">
                                <File className="h-16 w-16" />
                                <p className="text-center max-w-xs">Upload a document to start analyzing its content.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 pb-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: .985 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
                                        className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <div className={`
                                            max-w-[85%] rounded-2xl p-3 text-sm
                                            ${msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted rounded-tl-none whitespace-pre-line"
                                            }
                                        `}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                <AnimatePresence>{isLoading && <AIProcessingPulse label="Working with your document" />}</AnimatePresence>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="shrink-0 gap-2 border-t bg-background p-3">
                    <div className="flex w-full min-w-0 items-center gap-2">
                        <Input
                            type="text"
                            placeholder={file ? "Ask a question about the document..." : "Upload a file to start..."}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            disabled={!file || isLoading}
                            className="h-10 min-w-0 flex-1"
                        />
                        <Button
                            type="button"
                            size="icon"
                            className="size-10 shrink-0 rounded-md"
                            onClick={handleSendMessage}
                            disabled={!file || !inputMessage.trim() || isLoading}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
