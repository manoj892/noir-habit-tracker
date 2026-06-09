import { motion, useScroll, useTransform } from "motion/react"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import './AboutPage.css'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  {
    label: "The Core Philosophy",
    title: "Welcome to Obsidure.",
    text: "We believe that building a meaningful life is not a sprint; it is an exercise in absolute sustainability. Most productivity tools optimize for short bursts of speed—pushing you to move faster and burn hotter until you inevitably crash. Obsidure is built for the exact opposite. We engineer for duration. We believe that true, unbreakable momentum is forged quietly, deliberately, and consistently over the long haul.",
  },
  {
    label: "The Operating System",
    title: "A Futuristic Ritual Operating System.",
    text: "Obsidure is not a static checklist. It is designed for those who understand that human performance is dynamic. Mastering a complex physical discipline, executing a long-term business strategy, or simply optimizing your daily life requires more than just ticking a box. It requires a holistic understanding of your biological and mental states. That is why Obsidure tracks your effort, mood, intensity, and momentum. By visualizing elements like ENERGY, FOCUS, and PULSE, our platform adapts to your living reality—helping you recognize when to push your limits and when to prioritize the deep recovery necessary to sustain a lifelong streak.",
  },
  {
    label: "The Commitment",
    title: "Discipline in Motion.",
    text: "Obsidure exists to transform fleeting motivation into Discipline in Motion. We provide a premium, visually powerful digital environment that turns your daily actions into a resilient, unshakeable core. Build routines as tough as volcanic glass. Endure any disruption. Track your evolution.",
  },
]

function AboutPage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacityFade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // background ambience
      gsap.to(".future-grid", {
        backgroundPosition: "0 100px",
        duration: 12, repeat: -1, ease: "none",
      })
      gsap.to(".glow-a", {
        scale: 1.08, duration: 5.5, repeat: -1, yoyo: true, ease: "sine.inOut",
      })
      gsap.to(".glow-c", {
        scale: 1.1, duration: 4.8, repeat: -1, yoyo: true, ease: "sine.inOut",
      })

      // hero text stagger on load
      gsap.fromTo(".about-hero-eyebrow",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 }
      )
      gsap.fromTo(".about-hero-title",
        { y: 50, opacity: 0, filter: "blur(14px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, ease: "power4.out", delay: 0.25 }
      )
      gsap.fromTo(".about-hero-lead",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.55 }
      )
      gsap.fromTo(".about-scroll-hint",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.1 }
      )
      gsap.to(".about-scroll-line", {
        scaleY: 0.35, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut",
        transformOrigin: "top center",
      })

      // each section row
      gsap.utils.toArray(".about-section-row").forEach((row, i) => {
        const isAlt = i % 2 !== 0
        const left  = row.querySelector(".about-section-left")
        const right = row.querySelector(".about-section-right")
        const line  = row.querySelector(".about-accent-line")
        const label = row.querySelector(".card-label")
        const title = row.querySelector(".about-pillar-title")
        const text  = row.querySelector(".about-pillar-text")

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        })

        // accent line draws in
        if (line) {
          tl.fromTo(line,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
            0
          )
        }

        // left col slides in from outside
        tl.fromTo(left,
          { x: isAlt ? 48 : -48, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
          0.05
        )

        // right col slides in from opposite side
        tl.fromTo(right,
          { x: isAlt ? -48 : 48, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
          0.18
        )

        // label & title stagger inside left col
        if (label) {
          tl.fromTo(label,
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            0.4
          )
        }
        if (title) {
          tl.fromTo(title,
            { y: 22, opacity: 0, filter: "blur(8px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
            0.52
          )
        }

        // body text fades in
        if (text) {
          tl.fromTo(text,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            0.55
          )
        }
      })

      // tagline
      gsap.fromTo(".about-tagline",
        { y: 32, opacity: 0, filter: "blur(10px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-tagline-strip",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="future-homepage mega-homepage brand-page" ref={pageRef}>
      <div className="future-noise" />
      <div className="future-grid" />
      <motion.div className="future-glow glow-a" />
      <motion.div className="future-glow glow-c" />

      {/* Hero */}
      <header className="about-hero" ref={heroRef}>
        <motion.div
          className="about-hero-inner"
          style={{ y: titleY, opacity: opacityFade }}
        >
          <p className="eyebrow about-hero-eyebrow">Obsidian + Endure</p>

          <h1 className="future-title about-title about-hero-title">
            Forging Systems That<br />Outlast Motivation.
          </h1>

          <p className="future-text about-lead about-hero-lead">
            Be the best version of yourself. Sharp, resilient, and tough — Obsidure is a premium tool designed to help your routines survive through any disruption.
          </p>

          <div className="about-scroll-hint">
            <span className="about-scroll-line" />
          </div>
        </motion.div>
      </header>

      {/* Sections */}
      <section className="about-content">
        {sections.map((s, i) => (
          <div
            key={s.label}
            className={`about-section-row ${i % 2 !== 0 ? "about-section-row--alt" : ""}`}
          >
            <div className="about-section-left">
              <span className="about-accent-line" />
              <p className="card-label">{s.label}</p>
              <h3 className="about-pillar-title">{s.title}</h3>
            </div>
            <div className="about-section-right">
              <p className="future-text about-pillar-text">{s.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Tagline */}
      <div className="about-tagline-strip">
        <p className="about-tagline">Be the best version of yourself.</p>
      </div>
    </div>
  )
}

export default AboutPage
