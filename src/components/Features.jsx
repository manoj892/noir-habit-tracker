import { motion } from "motion/react"

const features = [
  {
    label: "Consistency",
    title: "Track habits with visual momentum",
    text: "See your daily progress, streak growth, and completion flow in one smooth experience."
  },
  {
    label: "Focus",
    title: "Reduce clutter and stay on one goal",
    text: "Your dashboard highlights the habits that matter most right now instead of showing everything equally."
  },
  {
    label: "Insights",
    title: "Understand your routine over time",
    text: "Spot patterns in your week, notice weak days, and improve your system with simple analytics."
  }
]

function Features() {
  return (
    <section className="features-section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <p className="eyebrow">Why it feels different</p>
        <h2>Built like a premium product, not a boring tracker.</h2>
      </motion.div>

      <div className="features-grid">
        {features.map((item, index) => (
          <motion.div
            key={item.title}
            className="feature-card"
            initial={{ opacity: 0, filter: "blur(12px)", clipPath: "inset(20% 0 20% 0 round 28px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0% 0 0% 0 round 28px)" }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: index * 0.06 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="card-label">{item.label}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Features