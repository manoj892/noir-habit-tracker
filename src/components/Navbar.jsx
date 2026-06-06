import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Track", path: "/tracker" },
  { name: "Coach", path: "/coach" },
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Lock background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Track scroll position so the header can attach a backdrop after leaving the top
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`global-navbar ${scrolled ? "is-scrolled" : ""}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="navbar-container">
        <Link to="/" className="brand-logo">
          <svg className="brand-mark-small" viewBox="0 0 72 72" aria-hidden="true">
            <circle className="global-nav-orbit" cx="36" cy="36" r="28" />
            <path className="global-nav-path" d="M20 49L36 17L52 49" fill="none" />
            <path className="global-nav-path" d="M28 49L36 33L44 49" fill="none" />
            <path className="global-nav-path" d="M25 55H47" fill="none" />
            <circle className="global-nav-node" cx="36" cy="17" r="3.2" />
          </svg>
          <span>Noir Habit</span>
        </Link>

        <div className="desktop-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="nav-divider"></div>
          <Link to="/tracker" className="secondary-btn nav-signin-btn">
            Sign In
          </Link>
        </div>

        <button
          className="mobile-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="mobile-drawer-header">
                <span>Menu</span>
                <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <motion.div
                className="mobile-drawer-links"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
                }}
              >
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: 24 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.path}
                      className={`mobile-nav-item ${location.pathname === link.path ? "active" : ""}`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="mobile-nav-divider"></div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 24 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link to="/tracker" className="primary-btn mobile-signin-btn">
                    Sign In
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
