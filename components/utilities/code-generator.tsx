"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AIProcessingPulse, AIResultMotion } from "@/components/ai-motion"
import { Code, Copy, Check, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState("javascript")

  const languages = [
    { value: "javascript", label: "JavaScript", extension: "js" },
    { value: "python", label: "Python", extension: "py" },
    { value: "typescript", label: "TypeScript", extension: "ts" },
    { value: "react", label: "React", extension: "jsx" },
    { value: "html", label: "HTML", extension: "html" },
    { value: "css", label: "CSS", extension: "css" },
    { value: "sql", label: "SQL", extension: "sql" },
    { value: "bash", label: "Bash", extension: "sh" },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    try {
      // Call the AI API for code generation
      const response = await fetch('/api/ai/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          language: language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate code')
      }

      const data = await response.json()
      setGeneratedCode(data.code || '// No code generated')
    } catch (error) {
      console.error('Error:', error)
      setGeneratedCode(`// Error: ${error instanceof Error ? error.message : 'Failed to generate code'}\n// Please try again with a different prompt.`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.error("Could not copy output:", error)
    }
  }

  const downloadCode = () => {
    const selectedLang = languages.find((l) => l.value === language)
    const extension = selectedLang?.extension || "txt"
    const blob = new Blob([generatedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-code.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="code-prompt" className="text-base font-semibold">
            Describe what you want to build
          </Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="language-select" className="text-sm">
              Language:
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 dark:bg-card dark:border-border dark:text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-card dark:border-border">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="dark:text-foreground dark:hover:bg-muted">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Textarea
          id="code-prompt"
          placeholder="E.g., 'Create a function to calculate factorial', 'Build a React component for a todo list', 'Write a Python script to read CSV files'..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="border-2 focus:border-primary resize-none transition-[border-color,box-shadow] duration-200 focus-visible:shadow-[0_0_0_4px_rgba(139,92,246,0.16)]"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Be specific about functionality, inputs, and expected outputs
          </div>

          <Button onClick={handleGenerate} disabled={!prompt.trim() || isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>{isLoading && <AIProcessingPulse label="Generating your code" />}</AnimatePresence>
      <AnimatePresence>{generatedCode && (
        <AIResultMotion><Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Generated Code</h3>
                <Badge variant="secondary" className="text-xs">
                  {languages.find((l) => l.value === language)?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <AnimatePresence mode="wait" initial={false}><motion.span key={copied ? "copied" : "copy"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .14 }} className="inline-flex items-center"><span className="mr-1">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</span>{copied ? "Copied" : "Copy"}</motion.span></AnimatePresence>
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCode}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap text-muted-foreground">{generatedCode}</pre>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{generatedCode.split("\n").length} lines</span>
                <span>{generatedCode.length} characters</span>
              </div>
            </div>
          </CardContent>
        </Card></AIResultMotion>
      )}</AnimatePresence>

      {/* Examples */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">💡 Example prompts:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• &quot;Create a function to validate email addresses&quot;</li>
            <li>• &quot;Build a React component for a responsive navigation bar&quot;</li>
            <li>• &quot;Write a Python script to scrape website data&quot;</li>
            <li>• &quot;Generate SQL queries to join multiple tables&quot;</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
