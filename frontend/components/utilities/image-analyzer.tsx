"use client"
import { apiUrl } from '@/lib/api'

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Upload, ImageIcon, Loader2, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AnimatePresence } from "framer-motion"
import { AIProcessingPulse, AIResultMotion } from "@/components/ai-motion"

interface ImageAnalysis {
  description: string
  objects: { name: string; confidence: number }[]
  colors: { name: string; percentage: number }[]
  text: string
  mood: string
  tags: string[]
}

export default function ImageAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAnalysis(null)
    }
  }

    const analyzeImage = async () => {
        if (!selectedImage || !imagePreview) return

        setIsLoading(true)

        try {
            // Get base64 without prefix
            const base64Image = imagePreview.split(',')[1]

            const response = await fetch(apiUrl('/api/ai/analyze-image'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    image: base64Image,
                    prompt: "Analyze this image. Provide a description, a list of objects detected (object: confidence), and some hashtags."
                }),
            })

            const data = await response.json()
            
            if (!response.ok) throw new Error(data.error)

            setAnalysis(data.analysis)
        } catch (error: unknown) {
            console.error("Analysis failed:", error instanceof Error ? error.message : error)
            // Fallback mock if absolutely necessary, but we show the error now
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Upload Image for Analysis</Label>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                width={400}
                height={256}
                className="max-w-full max-h-64 mx-auto rounded-lg border-2 border-border object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              <div className="flex items-center justify-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {selectedImage?.name} ({Math.round((selectedImage?.size || 0) / 1024)} KB)
                </p>
                <Button onClick={analyzeImage} disabled={isLoading} className="min-w-32">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-semibold mb-2">Upload an image to analyze</p>
                <p className="text-muted-foreground mb-4">Supports JPG, PNG, GIF up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <Button asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </label>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
      {isLoading ? <AIProcessingPulse key="analyzing" label="Analyzing the selected image" /> : analysis && (
        <AIResultMotion key="analysis"><div className="space-y-4">
          <h3 className="text-lg font-semibold">Analysis Results</h3>

          {/* Description */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </h4>
              <p className="text-muted-foreground leading-relaxed">{analysis.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Objects Detected */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Objects Detected</h4>
                <div className="space-y-2">
                  {analysis.objects.map((obj, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{obj.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {obj.confidence}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Color Analysis */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Color Analysis</h4>
                <div className="space-y-2">
                  {analysis.colors.map((color, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{color.name}</span>
                      <span className="text-xs text-muted-foreground">{color.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Mood & Atmosphere</h4>
                <p className="text-sm text-muted-foreground">{analysis.mood}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div></AIResultMotion>
      )}
      </AnimatePresence>

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 text-sm">🔍 What can be analyzed:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Object detection and identification</li>
            <li>• Text extraction (OCR)</li>
            <li>• Color palette analysis</li>
            <li>• Scene description and mood assessment</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
