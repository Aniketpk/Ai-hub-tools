"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Bot, History as HistoryIcon, Trash2, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SavedMessage = { role: "user" | "assistant"; content: string; type?: string; model_used?: string }
const STORAGE_KEY = "ai-hub-orchestrator-history"

export default function HistoryPage() {
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const [loaded, setLoaded] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: unknown = JSON.parse(stored)
        if (Array.isArray(parsed)) setMessages(parsed.filter((item): item is SavedMessage => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string"))
      }
    } catch {
      setMessages([])
    } finally {
      setLoaded(true)
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([])
  }

  return <motion.section initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 20 }} className="mx-auto w-full max-w-5xl py-6">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-600">Your workspace</p><h1 className="mt-2 flex items-center gap-3 text-3xl font-semibold tracking-tight text-slate-900"><HistoryIcon className="h-7 w-7 text-violet-600"/>History</h1><p className="mt-2 text-sm text-slate-500">The latest conversation saved by AI Chat on this device.</p></div>{messages.length > 0 && <Button variant="outline" onClick={clearHistory} className="gap-2"><Trash2 className="h-4 w-4"/>Clear conversation</Button>}</div>
    <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><CardTitle className="text-base">Saved conversation</CardTitle></CardHeader><CardContent>
      {!loaded ? (
        <div className="space-y-3" role="status" aria-label="Loading conversation history">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : messages.length ? (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.article
              key={`${index}-${message.role}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.35) }}
              className={`flex gap-3 rounded-xl border p-4 ${
                message.role === "user"
                  ? "border-violet-100 bg-violet-50/60"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-violet-600 shadow-sm">
                {message.role === "user" ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {message.role === "user" ? "You" : `AI Assistant${message.model_used ? ` · ${message.model_used}` : ""}`}
                </p>
                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{message.content}</p>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key="empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
              <HistoryIcon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-semibold text-slate-900">No saved chat yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Conversations from AI Chat are saved in this browser and will appear here.
            </p>
            <Button
              asChild
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold !text-white shadow-md shadow-violet-500/20 transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="/orchestrator" className="inline-flex items-center gap-1.5 !text-white">
                <span className="!text-white font-medium">Start a conversation</span>
                <ArrowUpRight className="h-4 w-4 !text-white" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      )}
    </CardContent></Card>
  </motion.section>
}
