"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AIProcessingPulse, AIResultMotion } from "@/components/ai-motion"
import { Languages, ArrowRightLeft, Copy, Check, Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LanguageTranslator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [sourceLang, setSourceLang] = useState("en")
  const [targetLang, setTargetLang] = useState("es")
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ]

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsLoading(true)

    try {
      // Call the AI API for translation
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          sourceLang: sourceLang,
          targetLang: targetLang,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to translate text')
      }

      const data = await response.json()
      setTranslatedText(data.translation || 'Translation failed. Please try again.')
    } catch (error) {
      console.error('Error:', error)
      setTranslatedText(error instanceof Error ? error.message : 'Failed to translate. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const swapLanguages = () => {
    const tempLang = sourceLang
    setSourceLang(targetLang)
    setTargetLang(tempLang)

    if (translatedText) {
      setSourceText(translatedText)
      setTranslatedText(sourceText)
    }
  }

  const copyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      console.error("Could not copy output:", error)
    }
  }

  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Label className="text-sm">From:</Label>
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger className="w-32 dark:bg-card dark:border-border dark:text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:border-border">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="dark:text-foreground dark:hover:bg-muted">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={swapLanguages}>
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Label className="text-sm">To:</Label>
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-32 dark:bg-card dark:border-border dark:text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-card dark:border-border">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="dark:text-foreground dark:hover:bg-muted">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Text */}
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">{languages.find((l) => l.code === sourceLang)?.name}</Label>
              {sourceText && (
                <Button variant="ghost" size="sm" onClick={() => speakText(sourceText, sourceLang)}>
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Textarea
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={8}
              className="border-2 focus:border-primary resize-none transition-[border-color,box-shadow] duration-200 focus-visible:shadow-[0_0_0_4px_rgba(139,92,246,0.16)]"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-muted-foreground">{sourceText.length} characters</span>

              <Button onClick={handleTranslate} disabled={!sourceText.trim() || isLoading} size="sm">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4 mr-2" />
                    Translate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Translated Text */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">{languages.find((l) => l.code === targetLang)?.name}</Label>
              {translatedText && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => speakText(translatedText, targetLang)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={copyTranslation} aria-label={copied ? "Translation copied" : "Copy translation"}>
                    <AnimatePresence mode="wait" initial={false}><motion.span key={copied ? "copied" : "copy"} initial={{ opacity: 0, scale: .75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .75 }}><span className="sr-only">{copied ? "Copied" : "Copy translation"}</span>{copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}</motion.span></AnimatePresence>
                  </Button>
                </div>
              )}
            </div>

            <div className="min-h-[200px] p-3 bg-background rounded-lg border-2 border-border">
              <AnimatePresence mode="wait">{isLoading ? <AIProcessingPulse label="Translating your text" /> : translatedText ? <AIResultMotion><p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{translatedText}</p></AIResultMotion> : (
                <p className="text-muted-foreground/50 italic">Translation will appear here...</p>
              )}</AnimatePresence>
            </div>

            {translatedText && (
              <div className="mt-3 text-sm text-muted-foreground">{translatedText.length} characters</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">🌍 Translation features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Support for 12+ major languages</li>
            <li>• Context-aware translations</li>
            <li>• Text-to-speech for pronunciation</li>
            <li>• Instant language swapping</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
