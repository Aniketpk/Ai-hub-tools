"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

export function AIResultMotion({ children }: { children: ReactNode }) {
  const reduceMotion = Boolean(useReducedMotion())
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20, scale: .985, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 20 }}>{children}</motion.div>
}

export function AIProcessingPulse({ label }: { label: string }) {
  const reduceMotion = Boolean(useReducedMotion())
  return <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 }} className="relative my-4 overflow-hidden rounded-xl border border-violet-300/20 bg-violet-300/[0.06] p-4" role="status" aria-live="polite">
    {!reduceMotion && <motion.span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-violet-300/15 to-transparent" animate={{ x: ["0%", "420%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} />}
    <div className="relative flex items-center gap-3"><motion.span animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [.6, 1, .6] }} transition={{ duration: 1.1, repeat: Infinity }}><Sparkles className="h-4 w-4 text-violet-300" /></motion.span><span className="text-sm text-foreground/80">{label}</span><span className="ml-auto flex gap-1" aria-hidden="true">{[0, 1, 2].map((dot) => <motion.i key={dot} className="h-1.5 w-1.5 rounded-full bg-violet-300" animate={reduceMotion ? undefined : { opacity: [.25, 1, .25], y: [0, -3, 0] }} transition={{ duration: .85, repeat: Infinity, delay: dot * .14 }} />)}</span></div>
  </motion.div>
}
