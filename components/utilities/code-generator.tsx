"use client"

import { useState } from "react"
import { Code, Copy, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
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

  const mockCodeExamples = {
    javascript: `// Function to calculate factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Example usage
console.log(factorial(5)); // Output: 120`,

    python: `# Function to calculate factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Example usage
print(factorial(5))  # Output: 120`,

    react: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`,
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Mock code generation based on language
    const baseCode = mockCodeExamples[language] || mockCodeExamples.javascript
    const customCode = `// Generated code for: ${prompt}\n\n${baseCode}`

    setGeneratedCode(customCode)
    setIsLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode)
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
          className="border-2 focus:border-primary resize-none"
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

      {generatedCode && (
        <Card className="border-2 border-primary/20 bg-primary/5">
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
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
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
        </Card>
      )}

      {/* Examples */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">💡 Example prompts:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• "Create a function to validate email addresses"</li>
            <li>• "Build a React component for a responsive navigation bar"</li>
            <li>• "Write a Python script to scrape website data"</li>
            <li>• "Generate SQL queries to join multiple tables"</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
