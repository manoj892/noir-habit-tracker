import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"

const faqs = [
  {
    question: "How should I care for the garments to prevent fading?",
    answer:
      "To maintain the absolute depth of the black fabric, we recommend washing all garments inside out on a delicate, cold cycle. Hang dry only. Avoid direct, prolonged sunlight during drying to preserve the kinetic architecture of the fibers.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes. Our digital ritual extends globally. International shipping is calculated at checkout based on your exact coordinates. Please allow 7-14 business days for cross-border transit.",
  },
  {
    question: "What is your return policy on limited drops?",
    answer:
      "We accept returns within 14 days of delivery. The garment must be unworn, unwashed, and returned in its original futuristic packaging. Limited edition drops and archives are final sale.",
  },
  {
    question: "How does the sizing run for the collections?",
    answer:
      "Our silhouettes are designed with a slightly oversized, modern drape to allow for discipline in motion. If you prefer a more tailored fit, we recommend sizing down.",
  },
]

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="homepage future-homepage mega-homepage min-h-screen">
      <div className="future-noise" />
      <div className="future-grid" />
      <motion.div className="future-glow glow-a" style={{ y: -50, x: -50 }} />

      <nav className="future-nav" style={{ padding: '24px', zIndex: 10, position: 'relative' }}>
        <motion.div
          className="brand-lockup"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>

        <motion.div
          className="future-nav-actions"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          <Link to="/" className="secondary-btn nav-link-btn">
            Back to Home
          </Link>
        </motion.div>
      </nav>

      <main className="faq-main">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8 }}
          className="faq-header"
        >
          <p className="eyebrow">Information Protocol</p>
          <h1 className="future-title">Frequently Asked</h1>
          <p className="future-text">
            Everything you need to know about our systems, shipping, and fabric architecture.
          </p>
        </motion.div>

        <div className="faq-container">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="faq-button"
                >
                  <h3 className="faq-question">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="faq-icon"
                  >
                    +
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-wrapper"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default FAQPage