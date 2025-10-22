"use client"

import { useState } from "react"
import { FileText, Copy, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function TextSummarizer() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [summaryLength, setSummaryLength] = useState("medium")

  const handleSummarize = async () => {
    if (!inputText.trim()) return

    setIsLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock summary generation
    const sentences = inputText.split(".").filter((s) => s.trim().length > 0)
    let summaryText = ""

    switch (summaryLength) {
      case "short":
        summaryText = sentences.slice(0, Math.max(1, Math.floor(sentences.length * 0.3))).join(". ") + "."
        break
      case "medium":
        summaryText = sentences.slice(0, Math.max(2, Math.floor(sentences.length * 0.5))).join(". ") + "."
        break
      case "long":
        summaryText = sentences.slice(0, Math.max(3, Math.floor(sentences.length * 0.7))).join(". ") + "."
        break
    }

    setSummary(summaryText || "This text appears to be a concise summary of the key points from the original content.")
    setIsLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
  }

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "summary.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="input-text" className="text-base font-semibold">
            Text to Summarize
          </Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="summary-length" className="text-sm">
              Length:
            </Label>
            <Select value={summaryLength} onValueChange={setSummaryLength}>
              <SelectTrigger className="w-32 dark:bg-card dark:border-border dark:text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-card dark:border-border">
                <SelectItem value="short" className="dark:text-foreground dark:hover:bg-muted">Short</SelectItem>
                <SelectItem value="medium" className="dark:text-foreground dark:hover:bg-muted">Medium</SelectItem>
                <SelectItem value="long" className="dark:text-foreground dark:hover:bg-muted">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Textarea
          id="input-text"
          placeholder="Paste your text here... (articles, documents, research papers, etc.)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={8}
          className="border-2 focus:border-primary resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{inputText.length} characters</span>
            <span>{inputText.split(" ").filter((w) => w.length > 0).length} words</span>
          </div>

          <Button onClick={handleSummarize} disabled={!inputText.trim() || isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Summarize
              </>
            )}
          </Button>
        </div>
      </div>

      {summary && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Summary</h3>
                <Badge variant="secondary" className="text-xs">
                  {summaryLength} length
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSummary}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Reduction: {Math.round((1 - summary.length / inputText.length) * 100)}%</span>
                <span>{summary.split(" ").length} words</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">💡 Tips for better summaries:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use well-structured text with clear paragraphs</li>
            <li>• Longer texts (500+ words) produce better summaries</li>
            <li>• Choose the appropriate length based on your needs</li>
            <li>• Review and edit the summary for your specific use case</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
