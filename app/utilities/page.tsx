"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain,
  FileText,
  Code,
  MessageSquare,
  ImageIcon,
  Languages,
  Lightbulb,
  Zap,
  Sparkles,
  Search,
  Command,
  LayoutGrid,
  ChevronRight,
  Terminal,
  Cpu,
  Fingerprint
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import TextSummarizer from "@/components/utilities/text-summarizer"
import CodeGenerator from "@/components/utilities/code-generator"
import AIChatbot from "@/components/utilities/ai-chatbot"
import ImageAnalyzer from "@/components/utilities/image-analyzer"
import LanguageTranslator from "@/components/utilities/language-translator"
import IdeaGenerator from "@/components/utilities/idea-generator"
import Paster from "@/components/utilities/paster"
import DocumentAssistant from "@/components/utilities/document-assistant"
import { Clipboard } from "lucide-react"

const utilities = [
  {
    id: "document-assistant",
    name: "Document assistant",
    description: "Ask questions and find insights in your files.",
    icon: Search,
    category: "Analysis",
    tags: ["PDF", "Knowledge", "RAG"]
  },
  {
    id: "summarizer",
    name: "AI Summarizer",
    description: "Turn long text into a clear, useful summary.",
    icon: FileText,
    category: "Text",
    tags: ["LLM", "Synthesis"]
  },
  {
    id: "code-generator",
    name: "Code Assistant",
    description: "Generate code and work through technical problems.",
    icon: Code,
    category: "Dev",
    tags: ["React", "Python", "Go"]
  },
  {
    id: "chatbot",
    name: "AI Chat",
    description: "Talk through ideas with your AI assistant.",
    icon: Brain,
    category: "Orchestration",
    tags: ["Hybrid", "Gemma", "GPT-4"]
  },
  {
    id: "image-analyzer",
    name: "Image Analyzer",
    description: "Extract meaning and details from images.",
    icon: ImageIcon,
    category: "Vision",
    tags: ["OCR", "Object Detection"]
  },
  {
    id: "translator",
    name: "AI Translator",
    description: "Translate with context and natural phrasing.",
    icon: Languages,
    category: "Language",
    tags: ["100+ Languages"]
  },
  {
    id: "idea-generator",
    name: "Idea Generator",
    description: "Find a fresh angle and make a plan to start.",
    icon: Lightbulb,
    category: "Ideation",
    tags: ["Marketing", "Tech"]
  },
  {
    id: "paster",
    name: "AI Notes",
    description: "Keep prompts and useful answers close at hand.",
    icon: Clipboard,
    category: "Utility",
    tags: ["Storage", "Cloud"]
  },
]

export default function UtilitiesPage() {
  const [activeUtility, setActiveUtility] = useState("document-assistant")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUtilities = useMemo(() => {
    return utilities.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const renderUtilityComponent = () => {
    switch (activeUtility) {
      case "document-assistant": return <DocumentAssistant />
      case "summarizer": return <TextSummarizer />
      case "code-generator": return <CodeGenerator />
      case "chatbot": return <AIChatbot />
      case "image-analyzer": return <ImageAnalyzer />
      case "translator": return <LanguageTranslator />
      case "idea-generator": return <IdeaGenerator />
      case "paster": return <Paster />
      default: return <DocumentAssistant />
    }
  }

  const activeUtil = utilities.find((u) => u.id === activeUtility)

  return (
    <div className="utilities-page min-h-screen text-white">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* Unified Command Header */}
        <div className="mb-16 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-primary mb-6 shadow-[0_0_20px_rgba(93,93,255,0.1)]">
              <Brain className="w-3.5 h-3.5" />
              ONE FOCUSED WORKSPACE
           </div>
           <h1 className="text-5xl font-bold tracking-tighter italic mb-6">Your AI workspace.</h1>
           <p className="text-white/40 text-lg font-light mb-10 max-w-2xl mx-auto">
             The everyday tools for writing, learning, building and thinking — together in one place.
           </p>

           <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20">
                <Command className="w-5 h-5 group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Find a tool — summarize, translate, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22]/80 border-white/5 h-16 pl-14 rounded-2xl text-lg font-light focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:bg-[#1c2128]"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                 <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] tracking-widest uppercase">8 TOOLS</Badge>
              </div>
           </div>
        </div>

        {/* Dynamic Tool Grid Select */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
           {filteredUtilities.map((u) => {
             const Icon = u.icon
             const isActive = activeUtility === u.id
             return (
               <button
                 key={u.id}
                 onClick={() => setActiveUtility(u.id)}
                 className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all relative ${
                   isActive 
                   ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(93,93,255,0.15)] ring-1 ring-primary/30" 
                   : "bg-[#161b22] border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10"
                 }`}
               >
                 <Icon className={`w-5 h-5 mb-2 ${isActive ? "text-primary" : "text-white/30"}`} />
                 <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center">{u.name.split(' ')[0]}</span>
                 {isActive && (
                    <motion.div 
                      layoutId="active-pill" 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(93,93,255,1)]"
                    />
                 )}
               </button>
             )
           })}
        </div>

        {/* Unified Workspace */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUtility}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="workspace-tool-card bg-white/[0.025] border border-white/[0.08] overflow-hidden shadow-2xl backdrop-blur-xl">
               <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {activeUtil && <activeUtil.icon className="w-6 h-6 text-primary" />}
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{activeUtil?.name}</h2>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{activeUtil?.category}</span>
                           <div className="flex gap-2">
                              {activeUtil?.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-white/20 font-medium">#{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 cursor-help transition-opacity">
                        <Fingerprint className="w-4 h-4" />
                     </div>
                  </div>
               </div>
               <div className="workspace-tool-body p-5 sm:p-7 min-h-[440px]">
                  {renderUtilityComponent()}
               </div>
               
               {/* Workstation Footer */}
               <div className="px-8 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                        <Terminal className="w-3.5 h-3.5" />
                        Ready: 0.2ms
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                        <Cpu className="w-3.5 h-3.5" />
                        Memory: Optimized
                     </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-primary transition-colors flex items-center gap-1">
                     Export Logs <ChevronRight className="w-3 h-3" />
                  </button>
               </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Global Stats bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: "Throughput", value: "24.5 GB/s", icon: Zap },
             { label: "Active Nodes", value: "11 Clusters", icon: LayoutGrid },
             { label: "Sync Status", value: "Encrypted", icon: Fingerprint }
           ].map((stat, i) => (
             <div key={i} className="p-6 rounded-2xl bg-[#161b22]/60 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                   <p className="text-xl font-bold text-white mb-0">{stat.value}</p>
                </div>
                <stat.icon className="w-6 h-6 text-white/10 group-hover:text-primary transition-colors" />
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
