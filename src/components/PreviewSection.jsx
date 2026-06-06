import { motion } from "motion/react"

function PreviewSection() {
  return (
    <section className="preview-section">
      <motion.div
        className="preview-card large-card"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9 }}
        whileHover={{ y: -8 }}
      >
        <p className="card-label">Today</p>
        <h2>3 habits completed</h2>
        <p>Stay consistent with your morning routine, reading, and workout.</p>
      </motion.div>

      <div className="preview-grid">
        <motion.div
          className="preview-card"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          whileHover={{ y: -8 }}
        >
          <p className="card-label">Streak</p>
          <h3>12 days</h3>
        </motion.div>

        <motion.div
          className="preview-card"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          whileHover={{ y: -8 }}
        >
          <p className="card-label">Focus</p>
          <h3>85%</h3>
        </motion.div>
      </div>
    </section>
  )
}

export default PreviewSection