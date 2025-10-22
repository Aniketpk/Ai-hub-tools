"use client"

import type React from "react"

import { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ReviewFormProps {
  onSubmit: (reviewData: any) => void
  onCancel: () => void
}

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const availableTags = [
    "Easy to Use",
    "Great Value",
    "Excellent Support",
    "Fast Performance",
    "Reliable",
    "Innovative",
    "User Friendly",
    "Professional",
    "Affordable",
    "Powerful Features",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !title.trim() || !content.trim()) {
      return
    }

    onSubmit({
      rating,
      title: title.trim(),
      content: content.trim(),
      tags: selectedTags,
    })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif">Write a Review</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating} out of 5 stars</span>}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title">Review Title</Label>
            <Input
              id="review-title"
              placeholder="Summarize your experience in a few words"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-2 focus:border-primary"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="review-content">Your Review</Label>
            <Textarea
              id="review-content"
              placeholder="Share your detailed experience with this tool. What did you like? What could be improved?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="border-2 focus:border-primary resize-none"
            />
            <p className="text-sm text-muted-foreground">{content.length}/500 characters</p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags (Optional)</Label>
            <p className="text-sm text-muted-foreground">Select tags that describe your experience</p>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={rating === 0 || !title.trim() || !content.trim()} className="flex-1">
              Submit Review
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
