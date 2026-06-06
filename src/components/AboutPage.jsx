import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "motion/react"
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function AboutPage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Animations
      gsap.to(".future-grid", {
        backgroundPosition: "0 100px",
        duration: 12,
        repeat: -1,
        ease: "none",
      })

      gsap.to(".glow-a", {
        scale: 1.08,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".glow-c", {
        scale: 1.1,
        duration: 4.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Entrance Animations
      gsap.fromTo(
        ".fade-up-element",
        { y: 40, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-content",
            start: "top 80%",
          },
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="homepage future-homepage mega-homepage" ref={pageRef}>
      {/* Shared Background Elements */}
      <div className="future-noise" />
      <div className="future-grid" />
      <motion.div className="future-glow glow-a" />
      <motion.div className="future-glow glow-c" />

      {/* Hero Section */}
      <header 
        ref={heroRef} 
        style={{ 
          minHeight: "60vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          position: "relative",
          zIndex: 2
        }}
      >
        <motion.div 
          style={{ y: titleY, opacity: opacityFade, textAlign: "center", maxWidth: "800px", padding: "0 24px" }}
        >
          <p className="eyebrow" style={{ marginBottom: "24px" }}>The Philosophy</p>
          <h1 className="future-title" style={{ fontSize: "clamp(48px, 8vw, 110px)", marginBottom: "32px" }}>
            Built for the<br/>long haul.
          </h1>
          <p className="future-text" style={{ margin: "0 auto", fontSize: "22px" }}>
            We don't believe in speed or short-term life hacks. Noir Habit is designed for sustainability, endurance, and the quiet power of daily repetition.
          </p>
        </motion.div>
      </header>

      {/* Content Section */}
      <section className="about-content" style={{ position: "relative", zIndex: 2, padding: "80px 24px 160px", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div className="fade-up-element hero-data-bar" style={{ marginBottom: "60px", padding: "40px" }}>
          <p className="card-label">01. Discipline as a Practice</p>
          <h3 style={{ fontSize: "32px", marginBottom: "16px", color: "var(--home-text)" }}>Mastery requires presence.</h3>
          <p className="future-text" style={{ fontSize: "18px", margin: 0 }}>
            Real progress isn't about how fast you move; it's about how long you can sustain the effort without breaking form. We built this system to act as a mirror for your daily practice, helping you build a foundation that lasts 365 days a year.
          </p>
        </div>

        <div className="fade-up-element hero-data-bar" style={{ marginBottom: "60px", padding: "40px" }}>
          <p className="card-label">02. Deep Focus, Deeper Recovery</p>
          <h3 style={{ fontSize: "32px", marginBottom: "16px", color: "var(--home-text)" }}>Rest is part of the work.</h3>
          <p className="future-text" style={{ fontSize: "18px", margin: 0 }}>
            You cannot optimize output without optimizing recovery. True momentum requires stepping away, resetting the mind, and understanding your energy cycles. Noir Habit tracks your effort, but it also forces you to respect your limits.
          </p>
        </div>

        <div className="fade-up-element hero-data-bar" style={{ padding: "40px" }}>
          <p className="card-label">03. Aesthetic Minimalism</p>
          <h3 style={{ fontSize: "32px", marginBottom: "16px", color: "var(--home-text)" }}>Removing the noise.</h3>
          <p className="future-text" style={{ fontSize: "18px", margin: 0 }}>
            Cluttered interfaces lead to cluttered minds. We designed a dark, stripped-back, architectural experience because your focus should be on your actions, not the software.
          </p>
        </div>

      </section>
    </div>
  )
}

export default AboutPage