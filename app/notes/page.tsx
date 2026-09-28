import type { Metadata } from "next"
import { StickyNote, Sparkles } from "lucide-react"
import Paster from "@/components/utilities/paster"

export const metadata: Metadata = {
  title: "AI Notes | AI Tool Hub",
  description: "Save and organize the useful parts of your AI workflow.",
}

export default function NotesPage() {
  return <div className="notes-page mx-auto w-full max-w-5xl py-5 sm:py-9">
    <div className="mb-7 sm:mb-9">
      <span className="section-kicker"><span className="kicker-line"/> YOUR THOUGHTS, IN ONE PLACE</span>
      <div className="mt-4 flex items-start gap-3">
        <span className="notes-page-icon"><StickyNote className="h-5 w-5"/></span>
        <div><h1 className="text-3xl font-semibold tracking-[-.065em] text-white sm:text-4xl">AI Notes</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/48">Capture prompts, useful answers and the ideas you want to come back to.</p></div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-[10px] text-white/35"><Sparkles className="h-3.5 w-3.5 text-violet-300"/> Saved notes stay in your browser, ready when you return.</div>
    </div>
    <section className="notes-workspace rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 shadow-[0_22px_70px_rgba(0,0,0,.2)] sm:p-5"><Paster/></section>
  </div>
}
