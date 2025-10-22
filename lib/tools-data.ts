// Shared tools data for the application
export interface Tool {
  id: number
  name: string
  description: string
  longDescription?: string
  category: string
  rating: number
  reviews: number
  pricing: string
  image: string
  tags: string[]
  website?: string
  developer?: string
  lastUpdated?: string
  featured?: boolean
  popular?: boolean
  verified?: boolean
}

export const allTools: Tool[] = [
  {
    id: 1,
    name: "GPT-4 Turbo",
    description: "Advanced language model for text generation, analysis, and conversation",
    longDescription:
      "GPT-4 Turbo represents the latest advancement in large language models, offering unprecedented capabilities in text generation, analysis, and conversational AI.",
    category: "Language Models",
    rating: 4.8,
    reviews: 2847,
    pricing: "Pay-per-use",
    image: "/placeholder-logo.png",
    tags: ["Text Generation", "Analysis", "Chatbot", "API"],
    website: "https://openai.com/gpt-4",
    developer: "OpenAI",
    lastUpdated: "2024-01-15",
    featured: true,
    popular: true,
    verified: true,
  },
  {
    id: 2,
    name: "Midjourney",
    description: "AI-powered image generation tool for creating stunning artwork and designs",
    category: "Image Generation",
    rating: 4.7,
    reviews: 1923,
    pricing: "Subscription",
    image: "/ai-artwork.png",
    tags: ["Art", "Design", "Creative", "Discord"],
    website: "https://midjourney.com",
    developer: "Midjourney Inc.",
    lastUpdated: "2024-01-12",
    featured: true,
    popular: true,
    verified: true,
  },
  {
    id: 3,
    name: "GitHub Copilot",
    description: "AI pair programmer that helps you write code faster and with fewer errors",
    category: "Development",
    rating: 4.6,
    reviews: 3421,
    pricing: "Subscription",
    image: "/ai-code-assistant.png",
    tags: ["Coding", "Productivity", "Development", "IDE"],
    website: "https://github.com/features/copilot",
    developer: "GitHub",
    lastUpdated: "2024-01-10",
    featured: true,
    popular: true,
    verified: true,
  },
  {
    id: 4,
    name: "Jasper AI",
    description: "AI writing assistant for marketing copy, blog posts, and content creation",
    category: "Content Creation",
    rating: 4.5,
    reviews: 1567,
    pricing: "Subscription",
    image: "/ai-writing-assistant.png",
    tags: ["Writing", "Marketing", "Content", "SEO"],
    website: "https://jasper.ai",
    developer: "Jasper AI",
    lastUpdated: "2024-01-08",
    featured: true,
    verified: true,
  },
  {
    id: 5,
    name: "Synthesia",
    description: "Create AI-generated videos with virtual presenters and multilingual support",
    category: "Video Generation",
    rating: 4.4,
    reviews: 892,
    pricing: "Subscription",
    image: "/ai-video-presenter.png",
    tags: ["Video", "Presentation", "Multilingual", "Avatar"],
    website: "https://synthesia.io",
    developer: "Synthesia",
    lastUpdated: "2024-01-05",
    featured: true,
    verified: true,
  },
  {
    id: 6,
    name: "Notion AI",
    description: "Intelligent writing assistant integrated into your workspace for better productivity",
    category: "Productivity",
    rating: 4.3,
    reviews: 2156,
    pricing: "Add-on",
    image: "/ai-productivity-assistant.png",
    tags: ["Productivity", "Writing", "Workspace", "Notes"],
    website: "https://notion.so/ai",
    developer: "Notion Labs",
    lastUpdated: "2024-01-03",
    featured: true,
    verified: true,
  },
  // Additional tools for better search/filter testing
  {
    id: 7,
    name: "Claude 3",
    description: "Advanced AI assistant for analysis, writing, and complex reasoning tasks",
    category: "Language Models",
    rating: 4.7,
    reviews: 1834,
    pricing: "Freemium",
    image: "/placeholder-logo.png",
    tags: ["Analysis", "Writing", "Reasoning", "Chat"],
    website: "https://claude.ai",
    developer: "Anthropic",
    lastUpdated: "2024-01-14",
    popular: true,
    verified: true,
  },
  {
    id: 8,
    name: "DALL-E 3",
    description: "Create realistic images and art from natural language descriptions",
    category: "Image Generation",
    rating: 4.6,
    reviews: 2341,
    pricing: "Pay-per-use",
    image: "/ai-artwork.png",
    tags: ["Image Creation", "Art", "Creative", "API"],
    website: "https://openai.com/dall-e-3",
    developer: "OpenAI",
    lastUpdated: "2024-01-11",
    popular: true,
    verified: true,
  },
  {
    id: 9,
    name: "Cursor",
    description: "AI-powered code editor built for pair programming with AI",
    category: "Development",
    rating: 4.5,
    reviews: 987,
    pricing: "Freemium",
    image: "/ai-code-assistant.png",
    tags: ["Code Editor", "AI Pair Programming", "Development"],
    website: "https://cursor.sh",
    developer: "Anysphere",
    lastUpdated: "2024-01-09",
    verified: true,
  },
  {
    id: 10,
    name: "Copy.ai",
    description: "AI copywriter for marketing content, emails, and social media posts",
    category: "Content Creation",
    rating: 4.2,
    reviews: 1456,
    pricing: "Freemium",
    image: "/ai-writing-assistant.png",
    tags: ["Copywriting", "Marketing", "Social Media", "Email"],
    website: "https://copy.ai",
    developer: "Copy.ai",
    lastUpdated: "2024-01-07",
    verified: true,
  },
  {
    id: 11,
    name: "Loom AI",
    description: "AI-powered video messaging with automatic transcription and summaries",
    category: "Video Generation",
    rating: 4.1,
    reviews: 743,
    pricing: "Freemium",
    image: "/ai-video-presenter.png",
    tags: ["Video Messaging", "Transcription", "Summaries"],
    website: "https://loom.com",
    developer: "Loom",
    lastUpdated: "2024-01-06",
    verified: true,
  },
  {
    id: 12,
    name: "Zapier AI",
    description: "Automate workflows with AI-powered task automation and integration",
    category: "Productivity",
    rating: 4.4,
    reviews: 1923,
    pricing: "Subscription",
    image: "/ai-productivity-assistant.png",
    tags: ["Automation", "Workflow", "Integration", "No-code"],
    website: "https://zapier.com",
    developer: "Zapier",
    lastUpdated: "2024-01-04",
    verified: true,
  },
]

export const categories = [
  { name: "Language Models", icon: "Brain", count: allTools.filter((t) => t.category === "Language Models").length },
  {
    name: "Image Generation",
    icon: "Palette",
    count: allTools.filter((t) => t.category === "Image Generation").length,
  },
  { name: "Development", icon: "Code", count: allTools.filter((t) => t.category === "Development").length },
  {
    name: "Content Creation",
    icon: "BookOpen",
    count: allTools.filter((t) => t.category === "Content Creation").length,
  },
  { name: "Video Generation", icon: "Video", count: allTools.filter((t) => t.category === "Video Generation").length },
  { name: "Productivity", icon: "Zap", count: allTools.filter((t) => t.category === "Productivity").length },
]

export const featuredTools = allTools.filter((tool) => tool.featured)

export const pricingOptions = ["Free", "Freemium", "Subscription", "Pay-per-use", "Add-on"]

export const allTags = Array.from(new Set(allTools.flatMap((tool) => tool.tags))).sort()
