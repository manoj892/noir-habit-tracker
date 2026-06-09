import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import "./SignInPage.css"

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
const GOOGLE_REDIRECT_URI = window.location.origin + "/auth/google/callback"

function handleGoogleAuth() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

function CountryDropdownPortal({ anchorRef, onSelect, onClose, selected }) {
  const [search, setSearch] = useState("")
  const [rect] = useState(() => anchorRef.current?.getBoundingClientRect() ?? null)

  if (!rect) return null

  const filtered = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={onClose} />
      <div style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: Math.max(rect.width + 200, 280),
        zIndex: 99999,
        background: "#0e1526",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", padding: "12px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <svg style={{ position: "absolute", left: 22, top: "50%", transform: "translateY(-55%)", width: 16, height: 16, color: "#a7b0c0", pointerEvents: "none" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country…"
            style={{ width: "100%", height: 38, padding: "0 12px 0 36px", background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#f5f7fb", fontSize: 14, outline: "none" }}
          />
        </div>
        <ul style={{ listStyle: "none", maxHeight: 220, overflowY: "auto", padding: "8px 0", margin: 0 }}>
          {filtered.map((c, i) => (
            <li key={`${c.name}-${i}`}
              onClick={() => { onSelect(c); onClose() }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", fontSize: 14, background: selected.name === c.name ? "#1e2a3e" : "transparent", color: selected.name === c.name ? "#16e0c4" : "#f5f7fb" }}
              onMouseEnter={(e) => { if (selected.name !== c.name) e.currentTarget.style.background = "#1a2235" }}
              onMouseLeave={(e) => { if (selected.name !== c.name) e.currentTarget.style.background = "transparent" }}
            >
              <span>{c.flag}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ color: "#a7b0c0", fontSize: 13 }}>{c.code}</span>
            </li>
          ))}
          {filtered.length === 0 && <li style={{ padding: 16, textAlign: "center", color: "#a7b0c0", fontSize: 14 }}>No results found</li>}
        </ul>
      </div>
    </>,
    document.body
  )
}

const COUNTRIES = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+1", flag: "🇨🇦", name: "CA" },
  { code: "+44", flag: "🇬🇧", name: "GB" },
  { code: "+91", flag: "🇮🇳", name: "IN" },
  { code: "+61", flag: "🇦🇺", name: "AU" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+81", flag: "🇯🇵", name: "JP" },
  { code: "+86", flag: "🇨🇳", name: "CN" },
  { code: "+7", flag: "🇷🇺", name: "RU" },
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+52", flag: "🇲🇽", name: "MX" },
  { code: "+34", flag: "🇪🇸", name: "ES" },
  { code: "+39", flag: "🇮🇹", name: "IT" },
  { code: "+31", flag: "🇳🇱", name: "NL" },
  { code: "+82", flag: "🇰🇷", name: "KR" },
  { code: "+65", flag: "🇸🇬", name: "SG" },
  { code: "+971", flag: "🇦🇪", name: "AE" },
  { code: "+966", flag: "🇸🇦", name: "SA" },
  { code: "+20", flag: "🇪🇬", name: "EG" },
  { code: "+27", flag: "🇿🇦", name: "ZA" },
  { code: "+234", flag: "🇳🇬", name: "NG" },
  { code: "+254", flag: "🇰🇪", name: "KE" },
  { code: "+62", flag: "🇮🇩", name: "ID" },
  { code: "+60", flag: "🇲🇾", name: "MY" },
  { code: "+63", flag: "🇵🇭", name: "PH" },
  { code: "+66", flag: "🇹🇭", name: "TH" },
  { code: "+84", flag: "🇻🇳", name: "VN" },
  { code: "+92", flag: "🇵🇰", name: "PK" },
  { code: "+880", flag: "🇧🇩", name: "BD" },
  { code: "+94", flag: "🇱🇰", name: "LK" },
  { code: "+977", flag: "🇳🇵", name: "NP" },
  { code: "+98", flag: "🇮🇷", name: "IR" },
  { code: "+90", flag: "🇹🇷", name: "TR" },
  { code: "+972", flag: "🇮🇱", name: "IL" },
  { code: "+30", flag: "🇬🇷", name: "GR" },
  { code: "+48", flag: "🇵🇱", name: "PL" },
  { code: "+46", flag: "🇸🇪", name: "SE" },
  { code: "+47", flag: "🇳🇴", name: "NO" },
  { code: "+45", flag: "🇩🇰", name: "DK" },
  { code: "+358", flag: "🇫🇮", name: "FI" },
  { code: "+41", flag: "🇨🇭", name: "CH" },
  { code: "+43", flag: "🇦🇹", name: "AT" },
  { code: "+32", flag: "🇧🇪", name: "BE" },
  { code: "+351", flag: "🇵🇹", name: "PT" },
  { code: "+380", flag: "🇺🇦", name: "UA" },
  { code: "+40", flag: "🇷🇴", name: "RO" },
  { code: "+420", flag: "🇨🇿", name: "CZ" },
  { code: "+36", flag: "🇭🇺", name: "HU" },
  { code: "+64", flag: "🇳🇿", name: "NZ" },
  { code: "+54", flag: "🇦🇷", name: "AR" },
  { code: "+56", flag: "🇨🇱", name: "CL" },
  { code: "+57", flag: "🇨🇴", name: "CO" },
  { code: "+51", flag: "🇵🇪", name: "PE" },
  { code: "+58", flag: "🇻🇪", name: "VE" },
  { code: "+593", flag: "🇪🇨", name: "EC" },
  { code: "+502", flag: "🇬🇹", name: "GT" },
  { code: "+503", flag: "🇸🇻", name: "SV" },
  { code: "+504", flag: "🇭🇳", name: "HN" },
  { code: "+505", flag: "🇳🇮", name: "NI" },
  { code: "+506", flag: "🇨🇷", name: "CR" },
  { code: "+507", flag: "🇵🇦", name: "PA" },
  { code: "+53", flag: "🇨🇺", name: "CU" },
  { code: "+1876", flag: "🇯🇲", name: "JM" },
  { code: "+1868", flag: "🇹🇹", name: "TT" },
  { code: "+213", flag: "🇩🇿", name: "DZ" },
  { code: "+212", flag: "🇲🇦", name: "MA" },
  { code: "+216", flag: "🇹🇳", name: "TN" },
  { code: "+218", flag: "🇱🇾", name: "LY" },
  { code: "+249", flag: "🇸🇩", name: "SD" },
  { code: "+251", flag: "🇪🇹", name: "ET" },
  { code: "+255", flag: "🇹🇿", name: "TZ" },
  { code: "+256", flag: "🇺🇬", name: "UG" },
  { code: "+233", flag: "🇬🇭", name: "GH" },
  { code: "+225", flag: "🇨🇮", name: "CI" },
  { code: "+237", flag: "🇨🇲", name: "CM" },
  { code: "+260", flag: "🇿🇲", name: "ZM" },
  { code: "+263", flag: "🇿🇼", name: "ZW" },
  { code: "+267", flag: "🇧🇼", name: "BW" },
  { code: "+250", flag: "🇷🇼", name: "RW" },
  { code: "+961", flag: "🇱🇧", name: "LB" },
  { code: "+962", flag: "🇯🇴", name: "JO" },
  { code: "+964", flag: "🇮🇶", name: "IQ" },
  { code: "+965", flag: "🇰🇼", name: "KW" },
  { code: "+968", flag: "🇴🇲", name: "OM" },
  { code: "+974", flag: "🇶🇦", name: "QA" },
  { code: "+973", flag: "🇧🇭", name: "BH" },
  { code: "+967", flag: "🇾🇪", name: "YE" },
  { code: "+93", flag: "🇦🇫", name: "AF" },
  { code: "+995", flag: "🇬🇪", name: "GE" },
  { code: "+374", flag: "🇦🇲", name: "AM" },
  { code: "+994", flag: "🇦🇿", name: "AZ" },
  { code: "+7", flag: "🇰🇿", name: "KZ" },
  { code: "+996", flag: "🇰🇬", name: "KG" },
  { code: "+998", flag: "🇺🇿", name: "UZ" },
  { code: "+992", flag: "🇹🇯", name: "TJ" },
  { code: "+993", flag: "🇹🇲", name: "TM" },
  { code: "+976", flag: "🇲🇳", name: "MN" },
  { code: "+856", flag: "🇱🇦", name: "LA" },
  { code: "+855", flag: "🇰🇭", name: "KH" },
  { code: "+95", flag: "🇲🇲", name: "MM" },
  { code: "+975", flag: "🇧🇹", name: "BT" },
  { code: "+960", flag: "🇲🇻", name: "MV" },
  { code: "+670", flag: "🇹🇱", name: "TL" },
  { code: "+679", flag: "🇫🇯", name: "FJ" },
  { code: "+685", flag: "🇼🇸", name: "WS" },
  { code: "+676", flag: "🇹🇴", name: "TO" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
}

function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState("choose")
  const [value, setValue] = useState("")
  const [fpCountry, setFpCountry] = useState(COUNTRIES[3])
  const [fpDropdown, setFpDropdown] = useState(false)
  const [sent, setSent] = useState(false)
  const fpBtnRef = useRef(null)

  const handleSend = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="fp-overlay" onClick={onClose}>
      <motion.div
        className="fp-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <button className="fp-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          <div className="fp-sent">
            <div className="fp-sent-icon">✓</div>
            <h2 className="fp-title">Check your {step === "email" ? "inbox" : "messages"}</h2>
            <p className="fp-sub">We sent a verification code to <strong>{value}</strong></p>
            <button className="primary-btn" style={{ marginTop: 20, width: "100%" }} onClick={onClose}>Done</button>
          </div>
        ) : step === "choose" ? (
          <>
            <h2 className="fp-title">Reset Password</h2>
            <p className="fp-sub">How would you like to receive your verification code?</p>
            <div className="fp-options">
              <button className="fp-option-btn" onClick={() => setStep("email")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </button>
              <button className="fp-option-btn" onClick={() => setStep("phone")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone</span>
              </button>
            </div>
          </>
        ) : step === "email" ? (
          <>
            <button className="fp-back" onClick={() => { setStep("choose"); setValue("") }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="fp-title">Enter your email</h2>
            <p className="fp-sub">We’ll send a verification link to your email address.</p>
            <form onSubmit={handleSend} className="fp-form">
              <div className="signin-input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input type="email" className="signin-input" placeholder="you@example.com" value={value} onChange={(e) => setValue(e.target.value)} required autoFocus />
              </div>
              <button type="submit" className="primary-btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Send Code</button>
            </form>
          </>
        ) : (
          <>
            <button className="fp-back" onClick={() => { setStep("choose"); setValue("") }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="fp-title">Enter your phone</h2>
            <p className="fp-sub">We’ll send a verification code via SMS.</p>
            <form onSubmit={handleSend} className="fp-form">
              <div className="signin-phone-wrap">
                <div ref={fpBtnRef} className="country-selector" onClick={() => setFpDropdown(!fpDropdown)}>
                  <span className="country-flag">{fpCountry.flag}</span>
                  <span className="country-dial">{fpCountry.code}</span>
                  <svg className={`country-chevron ${fpDropdown ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input type="tel" className="signin-input phone-input" placeholder="98765 43210" value={value} onChange={(e) => setValue(e.target.value)} required autoFocus />
              </div>
              {fpDropdown && (
                <CountryDropdownPortal
                  anchorRef={fpBtnRef}
                  selected={fpCountry}
                  onSelect={(c) => setFpCountry(c)}
                  onClose={() => setFpDropdown(false)}
                />
              )}
              <button type="submit" className="primary-btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>Send Code</button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState(COUNTRIES[3])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const countryBtnRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem("habitflow-users") || "{}")
    const user  = users[email]
    if (!user) { setLoginError("No account found with this email."); return }
    if (user.password !== password) { setLoginError("Incorrect password."); return }
    localStorage.setItem("habitflow-auth", JSON.stringify({ email, name: user.name || email }))
    navigate("/tracker")
  }

  return (
    <div className="future-homepage mega-homepage brand-page signin-page-wrapper">
      <div className="future-noise" />
      <div className="future-grid" />
      <div className="future-glow glow-a" style={{ top: "5%", left: "5%" }} />
      <div className="future-glow glow-b" style={{ bottom: "15%", right: "8%" }} />

      <div className="ambient-particles">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`ambient-particle particle-${i + 1}`}
            style={{ left: `${8 + i * 16}%`, top: `${20 + (i % 3) * 25}%`, animationDuration: `${6 + i}s` }}
          />
        ))}
      </div>

      <main className="signin-main">
        <motion.div
          className="signin-card hero-core-card"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="core-corners" aria-hidden="true">
            <span className="corner-bracket corner-a" />
            <span className="corner-bracket corner-b" />
            <span className="corner-bracket corner-c" />
            <span className="corner-bracket corner-d" />
          </div>

          <motion.div className="signin-header" variants={itemVariants}>
            <Link to="/" className="signin-brand">
              <svg className="brand-mark-small" viewBox="0 0 72 72" aria-hidden="true">
                <circle className="global-nav-orbit" cx="36" cy="36" r="28" />
                <path className="global-nav-path" d="M20 49L36 17L52 49" fill="none" />
                <path className="global-nav-path" d="M28 49L36 33L44 49" fill="none" />
                <path className="global-nav-path" d="M25 55H47" fill="none" />
                <circle className="global-nav-node" cx="36" cy="17" r="3.2" />
              </svg>
              <span>Obsidure</span>
            </Link>
            <p className="eyebrow">Access Portal</p>
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-sub">Welcome back. Enter your credentials to continue.</p>
          </motion.div>

          <motion.form
            className="signin-form"
            onSubmit={handleSubmit}
            variants={containerVariants}
          >
            {/* Email */}
            <motion.div className="signin-field" variants={itemVariants}>
              <label className="signin-label" htmlFor="email">Email Address</label>
              <div className="signin-input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  className="signin-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div className="signin-field" variants={itemVariants}>
              <label className="signin-label" htmlFor="password">Password</label>
              <div className="signin-input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="signin-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember me + Forgot password */}
              <div className="signin-password-row">
                <label className="signin-checkbox-label">
                  <div className={`signin-checkbox ${rememberMe ? "checked" : ""}`} onClick={() => setRememberMe(!rememberMe)}>
                    {rememberMe && (
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-btn" onClick={() => setForgotOpen(true)}>Forgot password?</button>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div className="signin-divider" variants={itemVariants}>
              <span>or use phone number</span>
            </motion.div>

            {/* Phone number */}
            <motion.div className="signin-field" variants={itemVariants} style={{ position: "relative", zIndex: 50 }}>
              <label className="signin-label" htmlFor="phone">Phone Number</label>
              <div className="signin-phone-wrap">
                <div ref={countryBtnRef} className="country-selector" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span className="country-flag">{countryCode.flag}</span>
                  <span className="country-dial">{countryCode.code}</span>
                  <svg className={`country-chevron ${dropdownOpen ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="tel"
                  className="signin-input phone-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              {dropdownOpen && (
                <CountryDropdownPortal
                  anchorRef={countryBtnRef}
                  selected={countryCode}
                  onSelect={(c) => setCountryCode(c)}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants}>
              {loginError && <p style={{ color: "#ff6b81", fontSize: 14, marginBottom: 8 }}>{loginError}</p>}
              <motion.button
                type="submit"
                className="primary-btn signin-submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Access System
              </motion.button>
            </motion.div>

            {/* Social divider */}
            <motion.div className="signin-divider" variants={itemVariants}>
              <span>or continue with</span>
            </motion.div>

            {/* Google */}
            <motion.button
              type="button"
              className="social-auth-btn google-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
            >
              <svg className="social-auth-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            <motion.p className="signin-footer-text" variants={itemVariants}>
              Don't have an account?{" "}
              <Link to="/signup" className="signin-link-btn">Sign up</Link>
            </motion.p>


          </motion.form>
        </motion.div>
      </main>

      {forgotOpen && <ForgotPasswordModal onClose={() => setForgotOpen(false)} />}
    </div>
  )
}

export default SignInPage
