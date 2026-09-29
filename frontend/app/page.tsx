"use client"

import Link from "next/link"
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion"
import { useRef, type ReactNode } from "react"
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Brain, Braces, Check, ChevronRight, Command, FileText, Languages, MessageSquareText, MousePointer2, Play, Sparkles, Stars, Zap } from "lucide-react"
import { allTools } from "@/lib/tools-data"

const appear: Variants = { hidden: { opacity: 0, y: 30, filter: "blur(9px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 90, damping: 18 } } }
const tileVariants: Variants = { hidden: { opacity: 0, y: 34, scale: .96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 110, damping: 17 } } }
const utilities = [
  { name: "AI Summarizer", description: "Find the signal in long documents, articles and notes.", icon: FileText, href: "/utilities", tag: "READ & SYNTHESIZE", tint: "violet", shortcut: "01" },
  { name: "Translator", description: "Move ideas across languages without losing their nuance.", icon: Languages, href: "/utilities", tag: "SPEAK EVERYWHERE", tint: "blue", shortcut: "02" },
  { name: "Code Assistant", description: "Go from a rough idea to working code, faster.", icon: Braces, href: "/utilities", tag: "BUILD WITH AI", tint: "amber", shortcut: "03" },
  { name: "AI Chat", description: "Think out loud, get unstuck and explore what comes next.", icon: MessageSquareText, href: "/orchestrator", tag: "THINK TOGETHER", tint: "pink", shortcut: "04" },
]

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = Boolean(useReducedMotion())
  return <motion.div variants={appear} initial={reduceMotion ? false : "hidden"} whileInView="show" viewport={{ once: true, amount: 0.16 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 18, delay }} className={className}>{children}</motion.div>
}

function ToolTile({ item }: { item: typeof utilities[number] }) {
  const Icon = item.icon
  const reduceMotion = Boolean(useReducedMotion())
  return <motion.div variants={tileVariants} whileHover={reduceMotion ? undefined : { y: -9, rotateX: 2.5, rotateY: -2.5, transition: { type: "spring", stiffness: 320, damping: 20 } }} whileTap={reduceMotion ? undefined : { scale: .975 }} style={{ transformPerspective: 900 }}>
  <Link href={item.href} className={`utility-tile tone-${item.tint} group focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300`}>
    <div className="flex items-start justify-between"><motion.span className="tool-icon-wrap" whileHover={reduceMotion ? undefined : { rotate: -9, scale: 1.12 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14 }}><Icon className="h-[19px] w-[19px]"/></motion.span><span className="tool-index">{item.shortcut}</span></div>
    <div className="mt-8"><span className="tool-tag">{item.tag}</span><h3 className="mt-2 text-[17px] font-semibold tracking-[-.035em] text-white">{item.name}</h3><p className="mt-2 max-w-[260px] text-[13px] leading-6 text-white/50">{item.description}</p></div>
    <motion.span className="tile-arrow" whileHover={reduceMotion ? undefined : { x: 3, y: -3 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 15 }}><ArrowUpRight className="h-4 w-4"/></motion.span>
    <span className="tile-orb" aria-hidden="true"/>
  </Link></motion.div>
}

export default function HomePage() {
  const featured = allTools.filter((tool) => tool.featured).slice(0, 3)
  const reduceMotion = Boolean(useReducedMotion())
  const heroRef = useRef<HTMLElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-.5, .5], [5, -5]), { stiffness: 120, damping: 18 })
  const rotateY = useSpring(useTransform(pointerX, [-.5, .5], [-6, 6]), { stiffness: 120, damping: 18 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 115])
  return <div className="landing-page overflow-hidden">
    <section ref={heroRef} className="hero-stage relative mx-auto max-w-[1440px] px-4 pb-16 pt-16 sm:px-7 sm:pt-24 lg:px-12 lg:pb-24 lg:pt-28">
      <div className="hero-grid-glow" aria-hidden="true"/><motion.div style={{ y: reduceMotion ? 0 : orbY }} animate={reduceMotion ? undefined : { scale: [1, 1.12, .96, 1], x: [0, 18, -12, 0], opacity: [.72, 1, .8, .72] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="hero-gradient-orb" aria-hidden="true"/><motion.div style={{ y: reduceMotion ? 0 : orbY }} animate={reduceMotion ? undefined : { scale: [1, 1.12, .96, 1], x: [0, 18, -12, 0], opacity: [.72, 1, .8, .72] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="hero-orbit hero-orbit-one" aria-hidden="true"/><motion.div animate={reduceMotion ? undefined : { scale: [1, .92, 1.08, 1], y: [0, -14, 8, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} className="hero-orbit hero-orbit-two" aria-hidden="true"/>
      <div className="relative z-10 grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-10">
        <div className="max-w-[650px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }} className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-violet-200/90"><span className="live-dot"/> THE INTELLIGENT WORKSPACE</motion.div>
          <motion.h1 initial={reduceMotion ? false : "hidden"} animate="show" variants={{ hidden: {}, show: { transition: { delayChildren: reduceMotion ? 0 : .12, staggerChildren: reduceMotion ? 0 : .17 } } }} className="mt-7 max-w-[680px] text-[clamp(3.1rem,7.2vw,6.6rem)] font-semibold leading-[.99] tracking-[-.078em] text-white">{[["One workspace.", ""], ["Every AI tool", "hero-title-muted"], ["you need.", "hero-title-accent"]].map(([line, tone]) => <motion.span key={line} variants={{ hidden: { opacity: 0, y: 28, filter: "blur(12px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 80, damping: 18 } } }} className={`block ${tone}`}>{line}</motion.span>)}</motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="mt-7 max-w-[490px] text-[15px] leading-7 text-white/55 sm:text-base sm:leading-8">Write, summarize, translate, code, debug and organize your ideas with one intelligent AI workspace.</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .3 }} className="mt-8 flex flex-wrap gap-3"><Link href="/utilities" className="action-primary">Explore AI tools <ArrowRight className="h-4 w-4"/></Link><Link href="/dashboard" className="action-secondary"><Play className="h-3.5 w-3.5 fill-current"/> View workspace</Link></motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }} className="mt-10 flex items-center gap-3 text-[11px] text-white/40"><div className="flex -space-x-2">{["A","J","M","S"].map((x,i)=><span key={x} className={`proof-avatar proof-${i}`}>{x}</span>)}</div><span><b className="font-semibold text-white/70">One calm place</b> for all your AI work</span><span className="mx-1 h-1 w-1 rounded-full bg-white/20"/><span className="flex items-center gap-1"><Stars className="h-3.5 w-3.5 text-violet-300"/> Built to help you focus</span></motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 44, scale: .93, rotateX: 4 }} animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 72, damping: 16, delay: .12 }} onPointerMove={(event) => { if (reduceMotion) return; const rect = event.currentTarget.getBoundingClientRect(); pointerX.set((event.clientX - rect.left) / rect.width - .5); pointerY.set((event.clientY - rect.top) / rect.height - .5) }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }} style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1100 }} className="hero-product relative mx-auto w-full max-w-[690px]">
          <div className="product-window">
            <div className="product-chrome"><div className="window-dots"><i/><i/><i/></div><div className="window-address"><Command className="h-3 w-3"/> workspace / overview</div><div className="window-profile">A</div></div>
            <div className="product-body"><aside className="product-mini-nav"><span className="mini-logo"><Brain className="h-3.5 w-3.5"/></span><span className="mini-nav-active"><AudioLines className="h-4 w-4"/></span><span><FileText className="h-4 w-4"/></span><span><Languages className="h-4 w-4"/></span><span><Braces className="h-4 w-4"/></span><span className="mini-nav-bottom"><MessageSquareText className="h-4 w-4"/></span></aside>
              <div className="product-workspace"><div className="product-topline"><div><div className="product-overline">MONDAY, OCTOBER 21</div><h2>Good morning, Aniket <span>✳</span></h2><p>Your ideas have a good place to land.</p></div><button className="product-new"><Sparkles className="h-3.5 w-3.5"/> New workspace</button></div>
                <div className="product-stats"><div><span>AI SESSIONS</span><b>128</b><small>↗ 18% this month</small></div><div><span>SAVED NOTES</span><b>36</b><small>Across 8 topics</small></div><div><span>TOOLS READY</span><b>08</b><small>One connected hub</small></div></div>
                <div className="product-section-head"><span>Pick up where you left off</span><span>See activity <ArrowRight className="h-3 w-3"/></span></div>
                <div className="product-activity"><div className="activity-icon violet"><FileText className="h-4 w-4"/></div><div><b>Launch notes, distilled</b><small>Summarizer · 12 min ago</small></div><span className="activity-done"><Check className="h-3 w-3"/></span></div>
                <div className="product-activity"><div className="activity-icon blue"><Braces className="h-4 w-4"/></div><div><b>Refine a React hook</b><small>Code assistant · Yesterday</small></div><span className="activity-done"><Check className="h-3 w-3"/></span></div>
                <div className="product-prompt"><span className="prompt-spark"><Sparkles className="h-3.5 w-3.5"/></span><span>What would you like to make today?</span><span className="prompt-send"><ArrowRight className="h-3.5 w-3.5"/></span></div>
              </div>
            </div>
          </div>
          <div className="floating-chip chip-top"><span className="chip-pulse"/> Models in sync <ChevronRight className="h-3 w-3"/></div><div className="floating-chip chip-bottom"><span className="chip-spark"><Zap className="h-3.5 w-3.5"/></span><span><b>Ready when you are</b><small>One workspace. Eight ways to begin.</small></span></div>
        </motion.div>
      </div>
      <div className="hero-bottom-note"><span>BUILT FOR THE MOMENT AFTER “WHAT IF?”</span><ArrowDown className="h-3.5 w-3.5"/></div>
    </section>

    <section id="tools" className="hub-section mx-auto max-w-[1440px] px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
      <Reveal className="section-intro"><div><span className="section-kicker"><span className="kicker-line"/> YOUR CREATIVE TOOLKIT</span><h2>Make space for<br/><span>the good ideas.</span></h2></div><div className="section-intro-copy"><p>Less tool-hopping. More flow. The essentials for thinking, making and getting to your next idea.</p><Link href="/utilities" className="subtle-link">Open your workspace <ArrowUpRight className="h-4 w-4"/></Link></div></Reveal>
      <motion.div className="utility-grid" variants={{ hidden: {}, show: { transition: { staggerChildren: .11 } } }} initial="hidden" whileInView="show" viewport={{ once: true, amount: .18 }}>{utilities.map((item)=><ToolTile key={item.name} item={item}/>)}</motion.div>
    </section>

    <section id="about" className="workflow-section border-y border-white/[0.055]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-7 sm:py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
        <Reveal><span className="section-kicker"><span className="kicker-line"/> A BETTER KIND OF WORKFLOW</span><h2 className="mt-5 max-w-[470px] text-4xl font-semibold leading-[1.08] tracking-[-.065em] text-white sm:text-5xl">From first thought<br/>to <span className="hero-title-accent">finished thing.</span></h2><p className="mt-5 max-w-[390px] text-sm leading-7 text-white/48">A thoughtful collection of tools, wrapped in one focused workspace. Start anywhere. Keep your momentum.</p><Link href="/dashboard" className="action-secondary mt-7 inline-flex">Take a look around <ArrowRight className="h-4 w-4"/></Link></Reveal>
        <div className="workflow-steps">{[{n:"01",title:"Start with a thought",text:"Ask a question, paste a draft or bring a messy idea.",icon:MousePointer2},{n:"02",title:"Choose your next move",text:"Summarize, translate, brainstorm, write or build.",icon:Sparkles},{n:"03",title:"Keep the momentum",text:"Save the useful bits and move on with your day.",icon:ArrowUpRight}].map((step,i)=><Reveal key={step.n} delay={i*.08}><div className="workflow-step"><span className="step-number">{step.n}</span><span className="step-icon"><step.icon className="h-[17px] w-[17px]"/></span><div><h3>{step.title}</h3><p>{step.text}</p></div><ArrowRight className="step-arrow h-4 w-4"/></div></Reveal>)}</div>
      </div>
    </section>

    <section className="directory-section mx-auto max-w-[1440px] px-4 py-16 sm:px-7 sm:py-24 lg:px-12">
      <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="section-kicker"><span className="kicker-line"/> A FEW PLACES TO START</span><h2 className="mt-4 text-3xl font-semibold tracking-[-.06em] text-white sm:text-4xl">Good tools. Better work.</h2></div><Link href="/search" className="subtle-link">Explore the directory <ArrowUpRight className="h-4 w-4"/></Link></Reveal>
      <div className="directory-grid">{featured.map((tool,index)=><Reveal key={tool.id} delay={index*.07}><Link href={`/tools/${tool.id}`} className="directory-card group"><span className="directory-image">{tool.image.endsWith(".svg") ? <img src={tool.image} alt=""/> : <span className="directory-image-placeholder"><Brain className="h-7 w-7"/></span>}<span className="directory-open"><ArrowUpRight className="h-4 w-4"/></span></span><span className="mt-4 flex items-center justify-between gap-2"><b>{tool.name}</b><span className="directory-rating">★ {tool.rating}</span></span><small>{tool.category} <span>·</span> {tool.pricing}</small></Link></Reveal>)}</div>
    </section>

    <section className="closing-section mx-auto max-w-[1440px] px-4 pb-12 sm:px-7 lg:px-12">
      <Reveal className="closing-card"><span className="closing-glow"/><span className="closing-icon"><Sparkles className="h-5 w-5"/></span><span className="section-kicker">YOUR NEXT IDEA IS WAITING</span><h2>Ready when<br className="sm:hidden"/> you are.</h2><p>Bring the thought. We’ll bring the tools.</p><Link href="/utilities" className="action-primary">Open the workspace <ArrowRight className="h-4 w-4"/></Link><span className="closing-coordinates">AI TOOL HUB <i>·</i> MADE TO KEEP YOU IN FLOW</span></Reveal>
    </section>
    <footer className="site-footer mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-white/[0.07] px-4 py-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-12"><span className="flex items-center gap-2"><span className="brand-mark brand-mark-small"><Brain className="h-3.5 w-3.5"/></span><b className="font-medium text-white/65">AI Tool Hub</b><span>© 2025</span></span><span>Curated tools for a more considered workflow.</span><span className="flex gap-4"><Link href="/search" className="hover:text-white">Directory</Link><Link href="/utilities" className="hover:text-white">Workspace</Link><Link href="/pricing" className="hover:text-white">Pricing</Link></span></footer>
  </div>
}
