import { Link } from "react-router-dom"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "motion/react"
import { useLayoutEffect, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const floatingSignals = [
  { label: "Focus", x: "14%", y: "18%" },
  { label: "Flow", x: "82%", y: "22%" },
  { label: "Energy", x: "20%", y: "72%" },
  { label: "Rhythm", x: "78%", y: "74%" },
  { label: "Depth", x: "50%", y: "14%" },
]

const marqueeWords = [
  "Momentum",
  "Focus",
  "Consistency",
  "Rhythm",
  "Discipline",
  "Energy",
  "Clarity",
  "Recovery",
]

const heroGlyphs = [
  { icon: "✦", x: "10%", y: "28%", size: "18px" },
  { icon: "◌", x: "88%", y: "30%", size: "16px" },
  { icon: "△", x: "16%", y: "84%", size: "18px" },
  { icon: "◈", x: "86%", y: "78%", size: "15px" },
  { icon: "✧", x: "52%", y: "10%", size: "14px" },
  { icon: "○", x: "62%", y: "86%", size: "16px" },
]

const systemIcons = [
  { label: "Sync", icon: "◎" },
  { label: "Pulse", icon: "◍" },
  { label: "Mind", icon: "△" },
  { label: "Track", icon: "□" },
]

function Counter({
  value,
  suffix = "",
  duration = 1.6,
  className = "",
  decimals = 0,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let frameId = null
    let startTime = null

    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = value * eased
      setDisplayValue(nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateValue)
      }
    }

    frameId = window.requestAnimationFrame(animateValue)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [isInView, value, duration])

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString()

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
    >
      {formatted}
      {suffix}
    </motion.span>
  )
}

function HomePage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const orbitPathRef = useRef(null)
  const storySectionRef = useRef(null)
  const storyTrackRef = useRef(null)
  const controlRef = useRef(null)
  const timelineRef = useRef(null)
  const spiralSectionRef = useRef(null)
  const spiralCardsRef = useRef(null)
  const ctaPrimaryRef = useRef(null)
  const ctaSecondaryRef = useRef(null)
  const heroVisualRef = useRef(null)
  const satelliteARef = useRef(null)
  const satelliteBRef = useRef(null)
  const satelliteCRef = useRef(null)
  const satelliteDRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springMouseX = useSpring(mouseX, { damping: 20, stiffness: 120 })
  const springMouseY = useSpring(mouseY, { damping: 20, stiffness: 120 })

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: controlScroll } = useScroll({
    target: controlRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  })

  const titleY = useTransform(heroScroll, [0, 1], [0, 140])
  const textY = useTransform(heroScroll, [0, 1], [0, 90])
  const visualRotate = useTransform(heroScroll, [0, 1], [0, 10])
  const visualScale = useTransform(heroScroll, [0, 1], [1, 1.06])
  const glowOneY = useTransform(heroScroll, [0, 1], [0, -120])
  const glowTwoY = useTransform(heroScroll, [0, 1], [0, 90])
  const glowThreeY = useTransform(heroScroll, [0, 1], [0, -70])
  const heroMouseX = useTransform(springMouseX, [-200, 200], [-24, 24])
  const heroMouseY = useTransform(springMouseY, [-200, 200], [-24, 24])

  const deviceLeftY = useTransform(controlScroll, [0, 1], [70, -40])
  const deviceRightY = useTransform(controlScroll, [0, 1], [-60, 70])
  const deviceRotate = useTransform(controlScroll, [0, 1], [-5, 5])
  const railScale = useTransform(timelineScroll, [0, 1], [0, 1])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) return

      gsap.fromTo(
        ".logo-path",
        { strokeDasharray: 420, strokeDashoffset: 420 },
        {
          strokeDashoffset: 0,
          duration: 1.3,
          ease: "power3.out",
          stagger: 0.05,
        }
      )

      gsap.to(".future-grid", {
        backgroundPosition: "0 100px",
        duration: 12,
        repeat: -1,
        ease: "none",
      })

      gsap.to(".ring-one", {
        rotate: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      })

      gsap.to(".ring-two", {
        rotate: -360,
        duration: 34,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      })

      gsap.to(".ring-three", {
        rotate: 360,
        duration: 46,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      })

      gsap.to(".ring-three", {
        scale: 1.06,
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      })

      gsap.to(".ring-dash", {
        rotate: -360,
        duration: 42,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      })

      gsap.to(".core-main", {
        y: -12,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".core-side-a", {
        y: -10,
        x: 8,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".core-side-b", {
        y: 10,
        x: -8,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".glow-a", {
        scale: 1.08,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".glow-b", {
        scale: 0.94,
        duration: 6.2,
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

      gsap.utils.toArray(".hero-glyph").forEach((glyph, index) => {
        gsap.to(glyph, {
          y: index % 2 === 0 ? -18 : 18,
          x: index % 3 === 0 ? 8 : -8,
          rotate: index % 2 === 0 ? 10 : -10,
          duration: 4.2 + index * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      gsap.utils.toArray(".hero-grid-line").forEach((line, index) => {
        gsap.fromTo(
          line,
          { opacity: 0.08, scaleX: 0.6 },
          {
            opacity: 0.28,
            scaleX: 1,
            duration: 2.4 + index * 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "left center",
          }
        )
      })

      gsap.to(".core-shine", {
        xPercent: 220,
        duration: 3.8,
        repeat: -1,
        ease: "none",
      })

      gsap.to(".corner-bracket", {
        opacity: 1,
        duration: 1.4,
        stagger: 0.08,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".timeline-rail-fill", {
        backgroundPositionY: "180px",
        duration: 4.6,
        repeat: -1,
        ease: "none",
      })

      gsap.utils.toArray(".timeline-card").forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -8 : 8,
          duration: 4 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      gsap.utils.toArray(".live-row").forEach((row, index) => {
        gsap.to(row, {
          opacity: 0.55,
          duration: 0.9 + index * 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      gsap.utils.toArray(".stat-orb").forEach((orb, index) => {
        gsap.to(orb, {
          scale: index % 2 === 0 ? 1.2 : 0.82,
          opacity: index % 2 === 0 ? 0.9 : 0.45,
          duration: 2.6 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      gsap.to(".final-cta-orb-a", {
        x: 18,
        y: -12,
        scale: 1.08,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".final-cta-orb-b", {
        x: -22,
        y: 16,
        scale: 0.94,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.utils.toArray(".signal-chip").forEach((chip, index) => {
        gsap.to(chip, {
          y: index % 2 === 0 ? -12 : 12,
          duration: 3 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      gsap.utils.toArray(".ambient-particle").forEach((particle, index) => {
        gsap.to(particle, {
          y: index % 2 === 0 ? -30 : 30,
          x: index % 3 === 0 ? 18 : -18,
          duration: 5 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      const orbitTargets = [
        { ref: satelliteARef, start: 0, end: 1 },
        { ref: satelliteBRef, start: 0.25, end: 1.25 },
        { ref: satelliteCRef, start: 0.5, end: 1.5 },
        { ref: satelliteDRef, start: 0.75, end: 1.75 },
      ]

      orbitTargets.forEach(({ ref, start, end }) => {
        if (!ref.current || !orbitPathRef.current) return

        gsap.set(ref.current, {
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "50% 50%",
        })

        gsap.to(ref.current, {
          duration: 18,
          repeat: -1,
          ease: "none",
          motionPath: {
            path: orbitPathRef.current,
            align: orbitPathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
            start,
            end,
          },
        })
      })

      gsap.fromTo(
        ".hero-data-bar-fill",
        { width: 0 },
        {
          width: "86%",
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-data-bar",
            start: "top 92%",
            end: "bottom 68%",
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        ".wave-fill",
        { backgroundPositionX: 0 },
        {
          backgroundPositionX: 220,
          ease: "none",
          scrollTrigger: {
            trigger: ".wave-track",
            start: "top 90%",
            end: "bottom 50%",
            scrub: true,
          },
        }
      )

      if (storySectionRef.current && storyTrackRef.current) {
        const getScrollAmount = () => {
          const trackWidth = storyTrackRef.current.scrollWidth
          const windowWidth = window.innerWidth
          return trackWidth > windowWidth ? -(trackWidth - windowWidth + 48) : 0
        }

        gsap.to(storyTrackRef.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      gsap.to(".signal-marquee-track", {
        xPercent: -50,
        duration: 20,
        repeat: -1,
        ease: "none",
      })

      gsap.utils.toArray(".timeline-row").forEach((row, index) => {
        gsap.fromTo(
          row,
          { opacity: 0.28, filter: "blur(10px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            delay: index * 0.02,
            scrollTrigger: {
              trigger: row,
              start: "top 84%",
              end: "top 42%",
              scrub: true,
            },
          }
        )
      })

      gsap.utils.toArray(".parallax-layer").forEach((layer, index) => {
        const depth = index & 1 ? 24 : -24

        gsap.fromTo(
          layer,
          { y: 0 },
          {
            y: depth,
            ease: "none",
            scrollTrigger: {
              trigger: layer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        )
      })

      gsap.utils.toArray(".fade-up-element").forEach((panel, index) => {
        gsap.fromTo(
          panel,
          {
            clipPath: "inset(12% 0 0 0)",
            opacity: 0.2,
            filter: "blur(10px)",
          },
          {
            clipPath: "inset(0 0 0 0)",
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            delay: index * 0.02,
            scrollTrigger: {
              trigger: panel,
              start: "top 88%",
              end: "top 52%",
              scrub: true,
            },
          }
        )
      })

      gsap.to(".scan-line", {
        yPercent: 320,
        duration: 5.5,
        repeat: -1,
        ease: "none",
      })

      gsap.to(".pulse-dot", {
        scale: 1.35,
        opacity: 0.45,
        stagger: 0.25,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(".metric-bar-fill", {
        scaleX: 1,
        transformOrigin: "left center",
        stagger: 0.14,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".desktop-device",
          start: "top 78%",
        },
      })

      if (spiralSectionRef.current && spiralCardsRef.current) {
        const items = gsap.utils.toArray(".cylinder-item")

        if (items.length) {
          gsap.set(items, {
            xPercent: -50,
            yPercent: -50,
            transformPerspective: 1800,
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            willChange: "transform, opacity, filter",
          })

          const state = { progress: 0 }

          const itemData = [
            { el: items[0], baseAngle: 306, radius: 190, pitch: 380 },
            { el: items[1], baseAngle: 210, radius: 190, pitch: 300 },
            { el: items[2], baseAngle: 114, radius: 190, pitch: 220 },
            { el: items[3], baseAngle: 18, radius: 190, pitch: 140 },
            { el: items[4], baseAngle: 282, radius: 190, pitch: 60 },
            { el: items[5], baseAngle: 186, radius: 190, pitch: -20 },
          ]

          let mm = gsap.matchMedia()

          mm.add("(max-width: 900px)", () => {
            gsap.set(".cylinder-core", { left: "50%", xPercent: -50, zIndex: 1 })

            gsap.set(".cylinder-copy", {
              position: "absolute",
              zIndex: 10,
              top: "16%",
              left: 0,
              right: 0,
              padding: "0 24px",
            })

            gsap.set(".cylinder-scene", { marginTop: 0 })

            gsap.set(".cylinder-item-triangle .cylinder-face h3", {
              padding: "0 28px",
              fontSize: "15px",
              lineHeight: "1.4",
              maxWidth: "200px",
              margin: "0 auto",
            })

            gsap.to(".cylinder-copy", {
              y: -220,
              opacity: 0,
              ease: "power1.inOut",
              scrollTrigger: {
                trigger: spiralSectionRef.current,
                start: "top top",
                end: "+=240",
                scrub: true,
              },
            })
          })

          mm.add("(min-width: 901px)", () => {
            gsap.set(".cylinder-core", { left: "66%", xPercent: -50, zIndex: 1 })
            gsap.set(".cylinder-copy", { clearProps: "all" })
            gsap.set(".cylinder-scene", { clearProps: "all" })
            gsap.set(".cylinder-item-triangle .cylinder-face h3", { clearProps: "all" })
          })

          const renderCylinder = () => {
            const rotation = state.progress * 720
            const upwardTravel = state.progress * 600

            const isMobile = window.innerWidth <= 900
            const currentLeft = isMobile ? "50%" : "66%"
            const currentRadius = isMobile ? 140 : 190

            itemData.forEach((item) => {
              const totalAngleDeg = item.baseAngle + rotation
              const angle = (totalAngleDeg * Math.PI) / 180

              const x = Math.cos(angle) * currentRadius
              const z = Math.sin(angle) * currentRadius

              const y = 500 - upwardTravel - item.pitch

              const frontness = (z + currentRadius) / (currentRadius * 2)
              const sideVisibility = 1 - Math.abs(frontness - 0.5) * 2
              const depthVisibility = 0.55 + frontness * 0.45

              const yCenterDist = Math.abs(y)
              const cutoffDistance = isMobile ? 220 : 260
              const fadeStart = isMobile ? 80 : 120

              let verticalOpacity = 1

              if (yCenterDist > cutoffDistance) {
                verticalOpacity = 0
              } else if (yCenterDist > fadeStart) {
                verticalOpacity =
                  1 - (yCenterDist - fadeStart) / (cutoffDistance - fadeStart)
              }

              const presence = 0.38 + sideVisibility * 0.22 + depthVisibility * 0.4
              const opacity = presence * verticalOpacity

              const scale = gsap.utils.interpolate(0.78, 1, depthVisibility)
              const rotateY = -totalAngleDeg + 90
              const rotateX = gsap.utils.interpolate(10, -4, frontness)

              const glowAlpha = 0.08 + depthVisibility * 0.22
              const dropShadow = `drop-shadow(0px 0px ${18 + depthVisibility * 24}px rgba(78,255,228,${glowAlpha}))`

              gsap.set(item.el, {
                left: currentLeft,
                top: "56%",
                x,
                y,
                z,
                rotateY,
                rotateX,
                scale,
                opacity,
                filter: `blur(0px) ${dropShadow}`,
                zIndex: Math.round((z + currentRadius) * 2) + 2,
                boxShadow: "none",
              })

              const frontFace = item.el.querySelector(".cylinder-face-front")
              const backFace = item.el.querySelector(".cylinder-face-back")
              const frontLabel = frontFace?.querySelector(".card-label")
              const frontHeading = frontFace?.querySelector("h3")
              const frontSpan = frontFace?.querySelector("span")

              const frontPlateOpacity = gsap.utils.interpolate(0.16, 1, Math.pow(frontness, 1.6))
              const backPlateOpacity = gsap.utils.interpolate(0.5, 0.16, frontness)
              const textVisibility = Math.max(0, (frontness - 0.58) / 0.42)
              const textOpacity = Math.pow(textVisibility, 1.35)

              if (frontFace) {
                gsap.set(frontFace, {
                  opacity: frontPlateOpacity,
                })
              }

              if (backFace) {
                gsap.set(backFace, {
                  opacity: backPlateOpacity,
                })
              }

              if (frontLabel) {
                gsap.set(frontLabel, {
                  opacity: textOpacity,
                })
              }

              if (frontHeading) {
                gsap.set(frontHeading, {
                  opacity: textOpacity,
                })
              }

              if (frontSpan) {
                gsap.set(frontSpan, {
                  opacity: textOpacity,
                })
              }
            })
          }

          renderCylinder()

          gsap.to(state, {
            progress: 1,
            ease: "none",
            onUpdate: renderCylinder,
            scrollTrigger: {
              trigger: spiralSectionRef.current,
              start: "top top",
              end: "+=1200",
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })

          gsap.to(".cylinder-core-glow", {
            opacity: 0.95,
            scaleY: 1.06,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center center",
          })
        }
      }

      const magneticButtons = [ctaPrimaryRef.current, ctaSecondaryRef.current]
      const listeners = []

      magneticButtons.forEach((button) => {
        if (!button) return

        const moveButton = (e) => {
          const rect = button.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2

          gsap.to(button, {
            x: x * 0.12,
            y: y * 0.12,
            duration: 0.28,
            ease: "power3.out",
          })
        }

        const resetButton = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
          })
        }

        button.addEventListener("mousemove", moveButton)
        button.addEventListener("mouseleave", resetButton)
        listeners.push({ button, moveButton, resetButton })
      })

      const refreshOnLoad = () => ScrollTrigger.refresh()
      window.addEventListener("load", refreshOnLoad)

      return () => {
        listeners.forEach(({ button, moveButton, resetButton }) => {
          button.removeEventListener("mousemove", moveButton)
          button.removeEventListener("mouseleave", resetButton)
        })
        window.removeEventListener("load", refreshOnLoad)
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleHeroMove = (e) => {
    if (!heroVisualRef.current) return
    const rect = heroVisualRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  const handleHeroLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const strictVisibility = {
    opacity: 1,
    filter: "none",
    clipPath: "none",
    transform: "translateZ(0)",
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
  }

  const glassStyle = {
    background: "rgba(12, 36, 86, 0.75)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    borderRadius: "24px",
    padding: "16px 32px",
  }

  return (
    <div className="homepage future-homepage mega-homepage" ref={pageRef}>
      <header className="future-hero mega-hero" ref={heroRef}>
        <div className="future-noise" />
        <div className="future-grid" />

        <motion.div className="future-glow glow-a" style={{ y: glowOneY }} />
        <motion.div className="future-glow glow-b" style={{ y: glowTwoY }} />
        <motion.div className="future-glow glow-c" style={{ y: glowThreeY }} />

        <div className="ambient-particles">
          {Array.from({ length: 10 }).map((_, index) => (
            <span
              key={index}
              className={`ambient-particle particle-${index + 1}`}
              style={{
                left: `${8 + index * 8}%`,
                top: `${10 + (index % 5) * 16}%`,
              }}
            />
          ))}
        </div>

        <div className="future-hero-layout">
          <div className="future-copy">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              Futuristic ritual operating system
            </motion.p>

            <motion.h1
              className="future-title"
              style={{ y: titleY }}
              initial={{ opacity: 0, filter: "blur(16px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.05, delay: 0.18 }}
            >
              Discipline
              <br />
              in motion.
            </motion.h1>

            <motion.p
              className="future-text"
              style={{ y: textY }}
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.95, delay: 0.3 }}
            >
              A premium digital ritual for people who want habits to feel alive,
              intelligent, and visually powerful across mobile and desktop.
            </motion.p>

            <motion.div
              className="future-actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.46 }}
            >
              <Link
                to="/tracker"
                className="primary-btn nav-link-btn magnetic-btn"
                ref={ctaPrimaryRef}
              >
                Launch Experience
              </Link>

              <a
                href="#future-story"
                className="secondary-btn nav-link-btn magnetic-btn"
                ref={ctaSecondaryRef}
              >
                Scroll Deeper
              </a>
            </motion.div>

            <div className="hero-stats-grid">
              <div className="hero-stat-chip fade-up-element">
                <span className="hero-stat-label">Active streak</span>
                <Counter value={18} suffix="d" className="hero-stat-value" />
              </div>

              <div className="hero-stat-chip fade-up-element">
                <span className="hero-stat-label">Daily score</span>
                <Counter value={86} suffix="%" className="hero-stat-value" />
              </div>

              <div className="hero-stat-chip fade-up-element">
                <span className="hero-stat-label">Focus sync</span>
                <Counter value={92} suffix="%" className="hero-stat-value" />
              </div>
            </div>

            <div className="hero-data-bar fade-up-element">
              <div className="hero-data-bar-top">
                <span>Consistency engine</span>
                <span>86%</span>
              </div>
              <div className="hero-data-bar-track">
                <div className="hero-data-bar-fill" />
              </div>
            </div>

            <div className="wave-track fade-up-element" aria-hidden="true">
              <div className="wave-fill" />
            </div>
          </div>

          <motion.div
            className="future-visual parallax-layer"
            ref={heroVisualRef}
            onMouseMove={handleHeroMove}
            onMouseLeave={handleHeroLeave}
            style={{
              rotate: visualRotate,
              scale: visualScale,
              x: heroMouseX,
              y: heroMouseY,
            }}
          >
            <svg className="orbit-svg" viewBox="0 0 760 760" aria-hidden="true">
              <path
                ref={orbitPathRef}
                d="M380 40C567.777 40 720 192.223 720 380C720 567.777 567.777 720 380 720C192.223 720 40 567.777 40 380C40 192.223 192.223 40 380 40Z"
                fill="none"
              />
            </svg>

            <div className="orbit-ring ring-one" />
            <div className="orbit-ring ring-two" />
            <div className="orbit-ring ring-three" />
            <div className="orbit-ring ring-dash" />

            <div className="hero-grid-overlay" aria-hidden="true">
              <span className="hero-grid-line line-1" />
              <span className="hero-grid-line line-2" />
              <span className="hero-grid-line line-3" />
            </div>

            {heroGlyphs.map((glyph, index) => (
              <span
                key={`${glyph.icon}-${index}`}
                className="hero-glyph"
                style={{
                  left: glyph.x,
                  top: glyph.y,
                  fontSize: glyph.size,
                }}
                aria-hidden="true"
              >
                {glyph.icon}
              </span>
            ))}

            {floatingSignals.map((signal, index) => (
              <div
                className="signal-chip"
                key={signal.label}
                style={{
                  left: signal.x,
                  top: signal.y,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {signal.label}
              </div>
            ))}

            <div className="orbit-satellite sat-a" ref={satelliteARef}>
              <span>Focus</span>
            </div>
            <div className="orbit-satellite sat-b" ref={satelliteBRef}>
              <span>Streak</span>
            </div>
            <div className="orbit-satellite sat-c" ref={satelliteCRef}>
              <span>Energy</span>
            </div>
            <div className="orbit-satellite sat-d" ref={satelliteDRef}>
              <span>Flow</span>
            </div>

            <div className="hero-core-card core-main no-blur-card">
              <div className="core-shine" aria-hidden="true" />
              <div className="core-corners" aria-hidden="true">
                <span className="corner-bracket corner-a" />
                <span className="corner-bracket corner-b" />
                <span className="corner-bracket corner-c" />
                <span className="corner-bracket corner-d" />
              </div>

              <p className="card-label">Adaptive core</p>
              <h3>Daily system intelligence</h3>
              <p>
                Track effort, mood, intensity, and momentum in a living visual
                system.
              </p>

              <div className="core-pulse-row" aria-hidden="true">
                <span className="pulse-dot" />
                <span className="pulse-dot" />
                <span className="pulse-dot" />
              </div>

              <div className="core-icon-row" aria-hidden="true">
                {systemIcons.map((item) => (
                  <span key={item.label} className="core-icon-chip">
                    <strong>{item.icon}</strong>
                    <em>{item.label}</em>
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-core-card core-side core-side-a no-blur-card">
              <p className="card-label">Streak sync</p>
              <h4>18 day streak</h4>
            </div>

            <div className="hero-core-card core-side core-side-b no-blur-card">
              <p className="card-label">Emotion log</p>
              <h4>Focused + tired</h4>
            </div>
          </motion.div>
        </div>
      </header>

      <section className="signal-marquee">
        <div className="signal-marquee-track">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords].map((word, index) => (
            <span key={`${word}-${index}`}>{word}</span>
          ))}
        </div>
      </section>

      <section
        className="story-pin-section compact-story-section"
        ref={storySectionRef}
        id="future-story"
      >
        <div className="story-track" ref={storyTrackRef}>
          <article className="story-slide" style={strictVisibility}>
            <p className="card-label">Signal 01</p>
            <h3>One system for discipline, mood, and rhythm.</h3>
            <p>
              A habit tracker should feel like a living interface, not a flat
              list of boxes and checkmarks.
            </p>
          </article>

          <article className="story-slide" style={strictVisibility}>
            <p className="card-label">Signal 02</p>
            <h3>See your daily state, not only completion.</h3>
            <p>
              Track effort, energy, and focus together so your streak actually
              means something deeper.
            </p>
          </article>

          <article className="story-slide" style={strictVisibility}>
            <p className="card-label">Signal 03</p>
            <h3>Built to feel premium on desktop and mobile.</h3>
            <p>
              The homepage creates emotion first, then smoothly leads users into
              the actual tracker experience.
            </p>
          </article>

          <article className="story-slide" style={strictVisibility}>
            <p className="card-label">Signal 04</p>
            <h3>Progress should look alive, not static.</h3>
            <p>
              Motion, light, and responsive interface rhythm make the product
              feel active even before interaction.
            </p>
          </article>
        </div>
      </section>

      <section className="control-center-section" ref={controlRef}>
        <div className="control-copy">
          <div className="control-copy-block fade-up-element">
            <p className="eyebrow">Control center</p>
            <h2>A product scene that floats as you scroll.</h2>
            <p className="future-text small-text">
              This section creates a cleaner bridge from cinematic homepage
              storytelling into the practical product interface.
            </p>
          </div>

          <div className="control-bullets">
            <div className="control-bullet fade-up-element">
              <span className="bullet-index">01</span>
              <p>Weekly rhythm and emotional signal layered together.</p>
            </div>

            <div className="control-bullet fade-up-element">
              <span className="bullet-index">02</span>
              <p>Desktop and mobile story told in one moving section.</p>
            </div>

            <div className="control-bullet fade-up-element">
              <span className="bullet-index">03</span>
              <p>Depth without losing readability.</p>
            </div>
          </div>
        </div>

        <div className="device-scene">
          <motion.div
            className="device-card desktop-device fade-up-element"
            style={{ y: deviceLeftY, rotate: deviceRotate }}
          >
            <div className="scan-line" aria-hidden="true" />
            <div className="device-topbar">
              <span />
              <span />
              <span />
            </div>

            <div className="device-screen-grid">
              <div className="screen-panel large-panel">
                <p className="card-label">Today</p>
                <h3>
                  <Counter value={4} />
                  /5 habits
                </h3>

                <div className="stat-orb-row" aria-hidden="true">
                  <span className="stat-orb orb-a" />
                  <span className="stat-orb orb-b" />
                  <span className="stat-orb orb-c" />
                </div>

                <div className="metric-bars">
                  <span className="metric-bar">
                    <span className="metric-bar-fill fill-a" />
                  </span>
                  <span className="metric-bar">
                    <span className="metric-bar-fill fill-b" />
                  </span>
                  <span className="metric-bar">
                    <span className="metric-bar-fill fill-c" />
                  </span>
                </div>
              </div>

              <div className="screen-panel">
                <p className="card-label">Mood</p>
                <h4>Focused</h4>
                <div className="mini-signal-row" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="screen-panel">
                <p className="card-label">Streak</p>
                <h4>18 days</h4>
                <div className="tiny-ring" aria-hidden="true" />
              </div>

              <div className="screen-panel wide-panel">
                <p className="card-label">Reflection</p>
                <p>Kept going even with low energy.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="device-card mobile-device fade-up-element"
            style={{ y: deviceRightY, rotate: deviceRotate }}
          >
            <div className="mobile-notch" />
            <div className="mobile-screen">
              <div className="mobile-stat">
                <p className="card-label">Daily score</p>
                <h3>
                  <Counter value={86} suffix="%" />
                </h3>
              </div>

              <div className="mobile-list">
                <div className="mobile-list-row live-row" />
                <div className="mobile-list-row short live-row" />
                <div className="mobile-list-row live-row" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="timeline-signature-section" ref={timelineRef}>
        <div className="timeline-signature-intro">
          <p className="eyebrow">Why it feels different</p>
          <h2>A homepage story with layered progression.</h2>
        </div>

        <div className="timeline-layout">
          <div className="timeline-rail">
            <motion.div className="timeline-rail-fill" style={{ scaleY: railScale }} />
          </div>

          <div className="timeline-content">
            <div className="timeline-row fade-up-element">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-step">Phase 01</span>
                <h3>Attract attention immediately.</h3>
                <p>
                  Strong hero motion, orbit systems, and brand presence make the
                  page feel expensive from the first second.
                </p>
                <div className="timeline-card-line" aria-hidden="true" />
              </div>
            </div>

            <div className="timeline-row fade-up-element">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-step">Phase 02</span>
                <h3>Shift information instead of stacking it.</h3>
                <p>
                  Horizontal motion, floating cards, and cinematic section
                  changes create a sense of progression.
                </p>
                <div className="timeline-card-line" aria-hidden="true" />
              </div>
            </div>

            <div className="timeline-row fade-up-element">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-step">Phase 03</span>
                <h3>Bridge story to product.</h3>
                <p>
                  The homepage creates desire. The tracker page then becomes the
                  practical tool users enter after the story.
                </p>
                <div className="timeline-card-line" aria-hidden="true" />
              </div>
            </div>

            <div className="timeline-row fade-up-element">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <span className="timeline-step">Phase 04</span>
                <h3>Leave with a signature impression.</h3>
                <p>
                  Theme shifts, logo motion, and a coherent visual system make
                  the brand feel memorable instead of generic.
                </p>
                <div className="timeline-card-line" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cylinder-feature-section" ref={spiralSectionRef}>
        <div className="cylinder-feature-stage">
          <div className="cylinder-copy">
            <p className="eyebrow">System architecture</p>
            <h2>The product language rises like a living signal.</h2>
            <p className="future-text small-text">
              Each message block is attached to an invisible cylinder around the
              core. As you scroll, the cylinder rotates upward like a screw,
              revealing back, side, and front angles naturally.
            </p>
          </div>

          <div className="cylinder-scene" ref={spiralCardsRef}>
            <div className="cylinder-core" aria-hidden="true">
              <span className="cylinder-core-beam" />
              <span className="cylinder-core-glow" />
            </div>

            <div className="cylinder-items">
              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Premium motion</p>
                  <h3>Built for product-launch energy.</h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Premium motion</span>
                </div>
              </article>

              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Kinetic architecture</p>
                  <h3>
                    Orbiting objects, magnetic CTA buttons, and scroll choreography.
                  </h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Kinetic architecture</span>
                </div>
              </article>

              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Mobile depth</p>
                  <h3>Dramatic without losing clarity on small screens.</h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Mobile depth</span>
                </div>
              </article>

              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Brand system</p>
                  <h3>Not a template. A stronger futuristic identity.</h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Brand system</span>
                </div>
              </article>

              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Visual Rhythm</p>
                  <h3>Continuous momentum reflected through dynamic design.</h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Visual Rhythm</span>
                </div>
              </article>

              <article
                className="cylinder-item"
                style={{ aspectRatio: "2.4 / 1", minHeight: "auto" }}
              >
                <div className="cylinder-face cylinder-face-front" style={glassStyle}>
                  <p className="card-label">Seamless State</p>
                  <h3>No loading, no waiting. Just pure interactive flow.</h3>
                </div>
                <div
                  className="cylinder-face cylinder-face-back"
                  aria-hidden="true"
                  style={glassStyle}
                >
                  <span>Seamless State</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="future-final-cta">
        <motion.div
          className="final-cta-box fade-up-element final-cta-enhanced"
          whileInView={{ scale: [0.98, 1], opacity: [0.75, 1] }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7 }}
        >
          <div className="final-cta-orb final-cta-orb-a" aria-hidden="true" />
          <div className="final-cta-orb final-cta-orb-b" aria-hidden="true" />

          <p className="eyebrow">Enter the product</p>
          <h2>Now the homepage carries the ambition your idea needed.</h2>
          <p className="future-text small-text">
            Keep the homepage cinematic. Keep the tracker page functional.
          </p>

          <div className="cta-footer-row">
            <Link to="/tracker" className="primary-btn nav-link-btn">
              Open Tracker Page
            </Link>

            <div>
              <div className="cta-mini-stats">
                <span>18 day streak</span>
                <span>86% daily score</span>
              </div>

              <div className="cta-signal-strip" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage
