import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function ContactPage() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  )

  useEffect(() => {
    document.documentElement.setAttribute("data-home-theme", theme)
  }, [theme])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="future-homepage mega-homepage contact-page-wrapper">
      <div className="future-noise" />
      <div className="future-grid" />

      {/* Background Glows */}
      <div className="future-glow glow-a" style={{ top: "10%", left: "10%" }} />
      <div className="future-glow glow-b" style={{ bottom: "20%", right: "10%" }} />

      {/* Ambient Particles */}
      <div className="ambient-particles">
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className={`ambient-particle particle-${index + 1}`}
            style={{
              left: `${10 + index * 12}%`,
              top: `${15 + (index % 4) * 20}%`,
              animationDuration: `${6 + index}s`,
            }}
          />
        ))}
      </div>

      <nav className="future-nav contact-nav">
        <motion.div
          className="brand-lockup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Link to="/" className="brand-lockup" style={{ textDecoration: "none" }}>
            <svg className="brand-mark" viewBox="0 0 72 72" aria-hidden="true">
              <circle className="brand-orbit" cx="36" cy="36" r="28" />
              <path className="logo-path" d="M20 49L36 17L52 49" fill="none" />
              <path className="logo-path" d="M28 49L36 33L44 49" fill="none" />
              <path className="logo-path" d="M25 55H47" fill="none" />
              <circle className="brand-node" cx="36" cy="17" r="3.2" />
            </svg>
            <div className="logo-wordmark">
              <span className="logo">Noir Habit</span>
            </div>
          </Link>
        </motion.div>
      </nav>

      <main className="contact-main">
        <motion.div
          className="contact-header"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="eyebrow" variants={itemVariants}>
            System Communication
          </motion.p>
          <motion.h1 className="future-title" variants={itemVariants}>
            Signal the
            <br />
            Core.
          </motion.h1>
          <motion.p className="future-text" variants={itemVariants}>
            Connect with the network. Whether it's a technical query, a partnership proposal, or feedback on the system rhythm, our channels are open.
          </motion.p>
        </motion.div>

        <motion.div
          className="contact-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Email Block */}
          <motion.div className="hero-core-card contact-card" variants={itemVariants}>
            <div className="core-corners" aria-hidden="true">
              <span className="corner-bracket corner-a" />
              <span className="corner-bracket corner-b" />
              <span className="corner-bracket corner-c" />
              <span className="corner-bracket corner-d" />
            </div>
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="card-label">Encrypted Mail</p>
            <h3>transmission@noirhabit.com</h3>
            <p className="contact-desc">Average system response time is under 12 hours.</p>
            <a href="mailto:transmission@noirhabit.com" className="primary-btn contact-btn">Initialize Link</a>
          </motion.div>

          {/* Phone Block */}
          <motion.div className="hero-core-card contact-card" variants={itemVariants}>
            <div className="core-corners" aria-hidden="true">
              <span className="corner-bracket corner-a" />
              <span className="corner-bracket corner-b" />
              <span className="corner-bracket corner-c" />
              <span className="corner-bracket corner-d" />
            </div>
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="card-label">Direct Frequency</p>
            <h3>+91 98765 43210</h3>
            <p className="contact-desc">Available for voice connection during standard operating cycles.</p>
            <a href="tel:+919876543210" className="secondary-btn contact-btn">Open Channel</a>
          </motion.div>

          {/* Socials Block */}
          <motion.div className="hero-core-card contact-card full-width-card" variants={itemVariants}>
             <div className="core-shine" aria-hidden="true" style={{ animationDuration: '8s' }} />
             <div className="core-corners" aria-hidden="true">
              <span className="corner-bracket corner-a" />
              <span className="corner-bracket corner-b" />
              <span className="corner-bracket corner-c" />
              <span className="corner-bracket corner-d" />
            </div>
            <p className="card-label">Network Nodes</p>
            <div className="social-links-container">
              <a href="#" className="social-node">
                <strong>IN</strong>
                <em>Instagram</em>
              </a>
              <a href="#" className="social-node">
                <strong>X</strong>
                <em>Twitter</em>
              </a>
              <a href="#" className="social-node">
                <strong>YT</strong>
                <em>YouTube</em>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default ContactPage