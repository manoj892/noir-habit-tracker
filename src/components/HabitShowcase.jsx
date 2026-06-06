import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

function HabitShowcase() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const yCardOne = useTransform(scrollYProgress, [0, 1], [120, -120])
  const yCardTwo = useTransform(scrollYProgress, [0, 1], [80, -80])
  const yCardThree = useTransform(scrollYProgress, [0, 1], [140, -140])

  const textY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.4])

  return (
    <section ref={sectionRef} className="habit-showcase">
      <motion.div className="showcase-copy" style={{ y: textY, opacity: textOpacity }}>
        <p className="eyebrow">Motion system</p>
        <h2>Your habits should feel alive.</h2>
        <p className="showcase-text">
          Instead of a flat checklist, your tracker can feel layered, responsive,
          and full of momentum. Each action can reward the user with calm,
          premium movement.
        </p>
      </motion.div>

      <div className="showcase-visual">
        <motion.div className="floating-card card-one" style={{ y: yCardOne }}>
          <p className="card-label">Morning</p>
          <h3>Wake up at 6:00</h3>
          <span>Completed</span>
        </motion.div>

        <motion.div className="floating-card card-two" style={{ y: yCardTwo }}>
          <p className="card-label">Reading</p>
          <h3>20 min reading</h3>
          <span>7 day streak</span>
        </motion.div>

        <motion.div className="floating-card card-three" style={{ y: yCardThree }}>
          <p className="card-label">Fitness</p>
          <h3>Workout session</h3>
          <span>85% consistency</span>
        </motion.div>
      </div>
    </section>
  )
}

export default HabitShowcase