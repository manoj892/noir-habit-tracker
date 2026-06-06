import { motion } from "motion/react"

const bars = [60, 90, 45, 100, 70, 80, 55]

function StatsSection() {
  return (
    <section className="stats-section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <p className="eyebrow">Progress</p>
        <h2>See momentum, not just checkmarks.</h2>
      </motion.div>

      <div className="stats-layout">
        <motion.div
          className="stats-panel stats-main-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="stats-top">
            <div>
              <p className="card-label">Weekly consistency</p>
              <h3>82%</h3>
            </div>
            <div className="mini-badge">+12%</div>
          </div>

          <div className="bar-chart">
            {bars.map((height, index) => (
              <motion.div
                key={index}
                className="bar-wrap"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <motion.div
                  className="bar"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.06 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="stats-side">
          <motion.div
            className="stats-panel stat-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="card-label">Best streak</p>
            <h3>21 days</h3>
            <p>Longest uninterrupted habit run this month.</p>
          </motion.div>

          <motion.div
            className="stats-panel stat-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="card-label">Completed today</p>
            <h3>5 / 6</h3>
            <p>You are one habit away from a perfect day.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection