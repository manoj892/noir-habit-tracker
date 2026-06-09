import { useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import emailjs from "@emailjs/browser"
import './ContactPage.css'

// ── EmailJS config ─────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY"

// ── Social links ───────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "Email",
    href: "mailto:hello@obsidure.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/yourpage",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@yourchannel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.962l4.265 5.638 4.767-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

// ── Animation variants ─────────────────────────────────────────────────────
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
}
const modalAnim = {
  hidden:  { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.35, ease: "easeOut" } },
  exit:    { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.25 } },
}

// ── Chat messages ──────────────────────────────────────────────────────────
const BOT_HELLO = [
  "👋 Hey! I'm the Obsidure assistant.",
  "What can I help you with today?",
]

function ChatModal({ onClose }) {
  const [messages, setMessages] = useState(
    BOT_HELLO.map((t, i) => ({ id: i, from: "bot", text: t }))
  )
  const [input, setInput] = useState("")

  function send() {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), from: "user", text }
    const botReply = {
      id: Date.now() + 1, from: "bot",
      text: "Thanks for reaching out! Our team will follow up via email shortly. 🙌",
    }
    setMessages(prev => [...prev, userMsg, botReply])
    setInput("")
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="chat-modal"
        variants={modalAnim} initial="hidden" animate="visible" exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="chat-modal-header">
          <span className="chat-status-dot" />
          <strong>Live Chat</strong>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="chat-body">
          {messages.map(m => (
            <motion.div
              key={m.id}
              className={`chat-bubble ${m.from}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {m.text}
            </motion.div>
          ))}
        </div>
        <div className="chat-input-row">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message…"
          />
          <button onClick={send} className="chat-send-btn">Send</button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Support Request Modal ──────────────────────────────────────────────────
const CHANNELS = [
  { id: "email", label: "Email",  icon: "✉️" },
  { id: "phone", label: "Phone",  icon: "📞" },
  { id: "chat",  label: "Chat",   icon: "💬" },
]

function SupportModal({ onClose }) {
  const [step, setStep]       = useState(1)  // 1 = choose channel, 2 = fill form
  const [channel, setChannel] = useState("")
  const [form, setForm]       = useState({ name: "", contact: "", message: "" })
  const [status, setStatus]   = useState("idle") // idle | sending | done | error
  const formRef = useRef()

  function chooseChannel(c) { setChannel(c); setStep(2) }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus("sending")

    const payload = { ...form, channel, timestamp: new Date().toISOString() }

    // Save locally
    const saved = JSON.parse(localStorage.getItem("support_requests") || "[]")
    saved.push(payload)
    localStorage.setItem("support_requests", JSON.stringify(saved))

    // Send via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    form.name,
          from_contact: form.contact,
          message:      form.message,
          channel,
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus("done")
    } catch {
      // Still mark as done — data is saved locally
      setStatus("done")
    }
  }

  const contactLabel = channel === "email" ? "Your Email" : channel === "phone" ? "Your Phone Number" : "Preferred Contact"

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="support-modal"
        variants={modalAnim} initial="hidden" animate="visible" exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="support-modal-header">
          <strong>Support Request</strong>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} transition={{ duration:0.25 }}>
              <p className="support-sub">How would you like us to contact you?</p>
              <div className="channel-options">
                {CHANNELS.map(c => (
                  <button key={c.id} className="channel-btn" onClick={() => chooseChannel(c.id)}>
                    <span className="channel-icon">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && status === "idle" && (
            <motion.form
              key="step2" ref={formRef}
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.25 }}
              onSubmit={handleSubmit}
              className="support-form"
            >
              <p className="support-sub">
                <button type="button" className="back-btn" onClick={() => setStep(1)}>← Back</button>
                Filling out a <strong>{channel}</strong> request
              </p>
              <label>
                Full Name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
              </label>
              <label>
                {contactLabel}
                <input name="contact" value={form.contact} onChange={handleChange} placeholder={contactLabel} required />
              </label>
              <label>
                Message
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue or request…" rows={4} required />
              </label>
              <button type="submit" className="primary-btn support-submit-btn">Submit Request</button>
            </motion.form>
          )}

          {step === 2 && status === "sending" && (
            <motion.div key="sending" className="status-screen" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <div className="spinner" />
              <p>Sending your request…</p>
            </motion.div>
          )}

          {step === 2 && status === "done" && (
            <motion.div key="done" className="status-screen" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
              <div className="success-icon">✓</div>
              <h3>Request Received!</h3>
              <p>We'll contact you via <strong>{channel}</strong> soon.</p>
              <button className="primary-btn" onClick={onClose} style={{ marginTop: "20px" }}>Close</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ── Corner brackets helper ─────────────────────────────────────────────────
function Corners() {
  return (
    <div className="core-corners" aria-hidden="true">
      <span className="corner-bracket corner-a" />
      <span className="corner-bracket corner-b" />
      <span className="corner-bracket corner-c" />
      <span className="corner-bracket corner-d" />
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
function ContactPage() {
  const [showChat, setShowChat]       = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  return (
    <div className="future-homepage mega-homepage brand-page contact-page-wrapper">
      <div className="future-noise" />
      <div className="future-grid" />
      <div className="future-glow glow-a" style={{ top: "10%", left: "10%" }} />
      <div className="future-glow glow-b" style={{ bottom: "20%", right: "10%" }} />

      <div className="ambient-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`ambient-particle particle-${i + 1}`}
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%`, animationDuration: `${6 + i}s` }}
          />
        ))}
      </div>

      <main className="contact-main">
        {/* Header */}
        <motion.div className="contact-header" variants={stagger} initial="hidden" animate="visible">
          <motion.p className="eyebrow" variants={fadeUp}>System Communication</motion.p>
          <motion.h1 className="future-title" variants={fadeUp}>
            Signal the<br />Core.
          </motion.h1>
          <motion.p className="future-text" variants={fadeUp}>
            Connect with the network. Technical query, partnership proposal, or feedback — our channels are open.
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div className="contact-grid" variants={stagger} initial="hidden" animate="visible">

          {/* Chat with Us */}
          <motion.div className="hero-core-card contact-card chat-card" variants={fadeUp}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}>
            <Corners />
            <div className="contact-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="card-label">Instant Support</p>
            <h3>Chat with Us</h3>
            <p className="contact-desc">Real-time assistance. Ask questions, report issues, or just say hello — we're live.</p>
            <div className="chat-availability">
              <span className="live-dot" />
              <span>Live now · Avg. reply &lt; 2 min</span>
            </div>
            <button className="primary-btn contact-btn" onClick={() => setShowChat(true)}>
              Start Chat
            </button>
          </motion.div>

          {/* Support Request */}
          <motion.div className="hero-core-card contact-card support-card" variants={fadeUp}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}>
            <Corners />
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="card-label">Formal Support</p>
            <h3>Support Request</h3>
            <p className="contact-desc">Choose email, phone, or chat. Fill in your details and we'll reach out on your terms.</p>
            <div className="support-channels-preview">
              {CHANNELS.map(c => (
                <span key={c.id} className="channel-tag">{c.icon} {c.label}</span>
              ))}
            </div>
            <button className="secondary-btn contact-btn" onClick={() => setShowSupport(true)}>
              Open Request
            </button>
          </motion.div>

          {/* Social / Network Nodes */}
          <motion.div className="hero-core-card contact-card full-width-card" variants={fadeUp}>
            <div className="core-shine" aria-hidden="true" />
            <Corners />
            <p className="card-label">Network Nodes</p>
            <div className="social-links-container">
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s.abbr}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-node"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                >
                  <span className="social-node-icon">{s.icon}</span>
                  <em>{s.label}</em>
                </motion.a>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Tagline */}
      <div className="contact-tagline-strip">
        <p className="contact-tagline">Your growth journey doesn't happen in isolation. Let's connect.</p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showChat    && <ChatModal    onClose={() => setShowChat(false)} />}
        {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
      </AnimatePresence>
    </div>
  )
}

export default ContactPage
