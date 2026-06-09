import { motion } from "motion/react"
import ScrollProgress from "./ScrollProgress"
import TrackerShell from "./TrackerShell"

function TrackerPage() {
  return (
    <>
      <ScrollProgress />
      <div className="future-homepage mega-homepage brand-page tracker-page">
        <div className="future-noise" />
        <div className="future-grid" />
        <div className="future-glow glow-a" />
        <div className="future-glow glow-b" />

        <main className="brand-page-main">
          <motion.section
            className="brand-page-hero tracker-page-hero"
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Your system</p>
            <h1 className="future-title">Track habits week by week.</h1>
            <p className="future-text">
              A weekly command center for discipline, notes, intensity, and
              momentum, tuned to the same living interface as the homepage.
            </p>
          </motion.section>

          <TrackerShell />
        </main>
      </div>
    </>
  )
}

export default TrackerPage
