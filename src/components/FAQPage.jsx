import { useState, useRef, useLayoutEffect, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import './FAQPage.css'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: "general",
    label: "General & Pricing",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill="currentColor" />
      </svg>
    ),
    items: [
      { q: "Is the app really free?", a: "Yes. Obsidure is completely free for a lifetime to track your habits, view analytics, and build nested routines." },
      { q: "Is the AI Coach free?", a: "Yes. Every user gets 5 free AI Coach chats every single day. Your daily limit resets at midnight. Conversations are saved up to 5 in the sidebar — sign in and upgrade for unlimited saved conversations." },
      { q: "What if I need more than 5 AI Coach chats a day?", a: "You have two flexible options:\n\nGo Unlimited — Upgrade to a premium subscription for just $4.99/month to unlock unlimited daily coaching.\n\nPay-per-usage — Buy a booster pack of 500 chat credits for just $1.00 to use whenever you need them." },
      { q: "Why is the interface only available in dark mode?", a: "Obsidure is designed from the ground up as a focused, low-friction digital environment. The deep, high-contrast dark theme minimizes digital eye strain and keeps you entirely locked into your rituals without visual clutter." },
    ],
  },
  {
    id: "mechanics",
    label: "Mechanics & Features",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    items: [
      { q: "What is 'Pushed the limit'?", a: "A flag for the days you went beyond your usual target — the days you really remember. The Analytics charts will highlight these specific days." },
      { q: "Can I have sub-habits?", a: "Yes. Any habit can have nested children. This is incredibly useful for grouping complex routines (e.g., Fitness → Calisthenics, Dance)." },
      { q: "What are the 'Energy', 'Pulse', and 'Focus' nodes in the tracker?", a: "Instead of just ticking a binary yes/no box, Obsidure measures the intensity of your habits. These nodes let you log your cognitive focus, physical energy levels, and overall execution flow to give your analytics true depth." },
      { q: "What exactly is the 'Adaptive Core'?", a: "It is your daily system intelligence panel. It synthesizes your logged effort, mood, and intensity into actionable data, mapping out your behavioral patterns over time so you can visualize your consistency." },
    ],
  },
  {
    id: "mental",
    label: "Mental Framework & AI Coach",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14z" />
      </svg>
    ),
    items: [
      { q: "I missed a day. Is my progress ruined?", a: "Not at all. Obsidure prioritizes long-term consistency over fragile daily streaks. A missed day is just data for the Coach to analyze." },
      { q: "How does the AI Coach work?", a: "The Brain analyzes your selected date range and gives you brutally honest feedback. No fluff, just pattern recognition and actionable next steps to ensure your routines endure." },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    items: [
      { q: "Does it work offline?", a: "Yes. Obsidure stores everything locally first, and automatically syncs to the cloud when you sign in and come back online." },
      { q: "Is my data private?", a: "Your data lives locally and in your private cloud row, scoped strictly to your account. Nobody else can read it, ensuring your habits and Coach conversations remain completely confidential." },
      { q: "How does the cloud sync work?", a: "Once you sign in with your email, your data seamlessly backs up to our secure database in real-time, allowing you to switch between your phone and desktop." },
      { q: "How do I delete my data?", a: "You have full control. You can delete individual habits, wipe specific conversations via the Coach sidebar, or clear your data entirely from the system." },
    ],
  },
]

const TICKER_ITEMS = [
  "Free Forever", "5 AI Chats Daily", "Offline First", "End-to-End Private",
  "Nested Habits", "Adaptive Core", "Energy · Pulse · Focus", "Discipline in Motion",
]

/* ── Count-up hook ── */
function useCountUp(target, duration = 1200, startOnMount = false) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  const start = () => {
    if (started.current) return
    started.current = true
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }
  if (startOnMount) { useEffect(() => start(), []) }
  return [value, start]
}

/* ── Stat chip with count-up ── */
function StatChip({ val, label, numeric, target }) {
  const ref = useRef(null)
  const [count, startCount] = useCountUp(target || 0, 1000)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (!numeric) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) { setTriggered(true); startCount() }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [triggered])

  return (
    <motion.div
      ref={ref}
      className="faq-stat-chip"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, borderColor: "rgba(22,224,196,0.3)" }}
    >
      <span className="faq-stat-val">
        {numeric ? (val.replace(/\d+/, count.toString())) : val}
      </span>
      <span className="faq-stat-label">{label}</span>
    </motion.div>
  )
}

/* ── FAQ accordion item ── */
function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className={`faq-item ${open ? "is-open" : ""}`}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      layout
    >
      <motion.button
        className="faq-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        whileTap={{ scale: 0.995 }}
      >
        <span className="faq-question">{item.q}</span>
        <motion.span
          className="faq-icon"
          animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "rgba(22,224,196,0.1)" : "transparent" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* animated left accent bar */}
            <motion.div
              className="faq-answer-bar"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            <div className="faq-answer">
              {item.a.split("\n\n").map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main page ── */
function FAQPage() {
  const pageRef = useRef(null)
  const bodyRef = useRef(null)

  /* smooth scroll with navbar offset on sidebar clicks */
  const handleNavClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const offset = 110
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: "smooth" })
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // background
      gsap.to(".future-grid", { backgroundPosition: "0 80px", duration: 14, repeat: -1, ease: "none" })
      gsap.to(".glow-a", { scale: 1.12, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" })
      gsap.to(".glow-b", { scale: 1.08, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" })

      // scan line drift
      gsap.to(".faq-scan-line", {
        y: "100%", duration: 3.5, repeat: -1, ease: "none",
        onRepeat: () => gsap.set(".faq-scan-line", { y: "-100%" }),
      })

      // hero entrance
      const heroTl = gsap.timeline()
      heroTl
        .fromTo(".faq-hero-eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
        .fromTo(".faq-hero-title",   { opacity: 0, y: 52, filter: "blur(16px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power4.out" }, "-=0.2")
        .fromTo(".faq-hero-sub",     { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }, "-=0.55")
        .fromTo(".faq-ticker-strip", { opacity: 0 },         { opacity: 1, duration: 0.5 }, "-=0.3")

      // category headers slide in
      gsap.utils.toArray(".faq-category-header").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, x: -36, filter: "blur(6px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" } }
        )
      })

      // sidebar links stagger in
      gsap.fromTo(".faq-sidebar-link",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.9 }
      )

    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="future-homepage mega-homepage brand-page faq-page-wrapper" ref={pageRef}>
      <div className="future-noise" />
      <div className="future-grid" />
      <div className="future-glow glow-a" style={{ top: "4%", left: "4%" }} />
      <div className="future-glow glow-b" style={{ bottom: "18%", right: "6%" }} />

      {/* Hero */}
      <header className="faq-hero">
        {/* moving scan line */}
        <div className="faq-scan-line" />

        <p className="eyebrow faq-hero-eyebrow">Information Protocol</p>
        <h1 className="future-title faq-hero-title">Frequently Asked.</h1>
        <p className="future-text faq-hero-sub">
          Every detail behind the Obsidure system — pricing, mechanics, the AI Coach, and how your data stays yours.
        </p>

        {/* Stat chips with count-up */}
        <div className="faq-stats-row">
          <StatChip val="Free"   label="Forever for core features"   numeric={false} />
          <StatChip val="5/day"  label="Free AI Coach chats"         numeric={false} />
          <StatChip val="$4.99"  label="Unlimited coaching / month"  numeric={false} />
          <StatChip val="500"    label="Credits booster pack — $1"   numeric={true} target={500} />
        </div>
      </header>

      {/* Ticker strip */}
      <div className="faq-ticker-strip">
        <div className="faq-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="faq-ticker-item">
              <span className="faq-ticker-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="faq-body" ref={bodyRef}>

        {/* Sticky sidebar aligned to FAQ body start */}
        <nav className="faq-sidebar">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="faq-sidebar-link"
              onClick={(e) => handleNavClick(e, cat.id)}
            >
              <span className="faq-sidebar-icon">{cat.icon}</span>
              <span>{cat.label}</span>
            </a>
          ))}
        </nav>

        {/* FAQ groups */}
        <div className="faq-groups">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="faq-category">
              <div className="faq-category-header">
                <motion.span
                  className="faq-category-icon"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {cat.icon}
                </motion.span>
                <h2 className="faq-category-title">{cat.label}</h2>
              </div>
              <div className="faq-list">
                {cat.items.map((item, ii) => (
                  <FAQItem key={item.q} item={item} index={ii} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Tagline - footer */}
      <div className="faq-tagline-strip">
        <p className="faq-tagline">Clarity is the blueprint of progress.</p>
      </div>
    </div>
  )
}

export default FAQPage
