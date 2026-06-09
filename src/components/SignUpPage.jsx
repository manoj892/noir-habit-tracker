import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import "./SignUpPage.css"

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
  { code: "+55", flag: "🇧🇷", name: "BR" },
  { code: "+52", flag: "🇲🇽", name: "MX" },
  { code: "+34", flag: "🇪🇸", name: "ES" },
  { code: "+39", flag: "🇮🇹", name: "IT" },
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
  { code: "+90", flag: "🇹🇷", name: "TR" },
  { code: "+972", flag: "🇮🇱", name: "IL" },
  { code: "+30", flag: "🇬🇷", name: "GR" },
  { code: "+48", flag: "🇵🇱", name: "PL" },
  { code: "+46", flag: "🇸🇪", name: "SE" },
  { code: "+47", flag: "🇳🇴", name: "NO" },
  { code: "+45", flag: "🇩🇰", name: "DK" },
  { code: "+41", flag: "🇨🇭", name: "CH" },
  { code: "+351", flag: "🇵🇹", name: "PT" },
  { code: "+380", flag: "🇺🇦", name: "UA" },
  { code: "+64", flag: "🇳🇿", name: "NZ" },
  { code: "+54", flag: "🇦🇷", name: "AR" },
  { code: "+56", flag: "🇨🇱", name: "CL" },
  { code: "+57", flag: "🇨🇴", name: "CO" },
]

const TIMEZONES = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00 (PST)",
  "UTC-07:00 (MST)", "UTC-06:00 (CST)", "UTC-05:00 (EST)", "UTC-04:00",
  "UTC-03:00", "UTC-02:00", "UTC-01:00", "UTC+00:00 (GMT)", "UTC+01:00 (CET)",
  "UTC+02:00 (EET)", "UTC+03:00 (MSK)", "UTC+04:00", "UTC+05:00",
  "UTC+05:30 (IST)", "UTC+06:00", "UTC+07:00 (ICT)", "UTC+08:00 (CST)",
  "UTC+09:00 (JST)", "UTC+10:00 (AEST)", "UTC+11:00", "UTC+12:00 (NZST)",
]

const HABIT_GOALS = [
  "Build better sleep habits", "Exercise & fitness", "Mindfulness & meditation",
  "Reading & learning", "Healthy eating", "Reduce screen time",
  "Creative practice", "Journaling", "Language learning", "Productivity",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
}

function CountryDropdownPortal({ anchorRef, onSelect, onClose, selected }) {
  const [search, setSearch] = useState("")
  const [rect, setRect] = useState(null)

  useEffect(() => {
    if (anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect())
    }
    const onScroll = () => onClose()
    window.addEventListener("scroll", onScroll, true)
    return () => window.removeEventListener("scroll", onScroll, true)
  }, [])

  const filtered = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )

  if (!rect) return null

  return createPortal(
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 99998 }} onClick={onClose} />
      <div
        style={{
          position: "fixed",
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width + 200,
          zIndex: 99999,
          background: "#0e1526",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
          overflow: "hidden",
        }}
      >
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
            style={{
              width: "100%", height: 38, padding: "0 12px 0 36px",
              background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "#f5f7fb", fontSize: 14, outline: "none",
            }}
          />
        </div>
        <ul style={{ listStyle: "none", maxHeight: 220, overflowY: "auto", padding: "8px 0", margin: 0 }}>
          {filtered.map((c, i) => (
            <li
              key={`${c.name}-${i}`}
              onClick={() => { onSelect(c); onClose() }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 16px", cursor: "pointer", fontSize: 14,
                background: selected.name === c.name ? "#1e2a3e" : "transparent",
                color: selected.name === c.name ? "#16e0c4" : "#f5f7fb",
              }}
              onMouseEnter={(e) => { if (selected.name !== c.name) e.currentTarget.style.background = "#1a2235" }}
              onMouseLeave={(e) => { if (selected.name !== c.name) e.currentTarget.style.background = "transparent" }}
            >
              <span>{c.flag}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ color: "#a7b0c0", fontSize: 13 }}>{c.code}</span>
            </li>
          ))}
          {filtered.length === 0 && (
            <li style={{ padding: 16, textAlign: "center", color: "#a7b0c0", fontSize: 14 }}>No results</li>
          )}
        </ul>
      </div>
    </>,
    document.body
  )
}

function SignUpPage() {
  const navigate = useNavigate()

  // mandatory
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // optional profile
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState(COUNTRIES[3])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const countryBtnRef = useRef(null)
  const [gender, setGender] = useState("")
  const [dob, setDob] = useState("")
  const [bio, setBio] = useState("")
  const [timezone, setTimezone] = useState("")
  const [selectedGoals, setSelectedGoals] = useState([])
  const [weekStart, setWeekStart] = useState("")
  const [reminderTime, setReminderTime] = useState("")

  const [errors, setErrors] = useState({})

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const validate = () => {
    const e = {}
    if (!email) e.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email"
    if (!password) e.password = "Password is required"
    else if (password.length < 8) e.password = "Minimum 8 characters"
    if (confirmPassword && confirmPassword !== password) e.confirmPassword = "Passwords don't match"
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // save user to persistent store
    const users = JSON.parse(localStorage.getItem("habitflow-users") || "{}")
    users[email] = { password, name: displayName || email }
    localStorage.setItem("habitflow-users", JSON.stringify(users))
    // auto sign in
    localStorage.setItem("habitflow-auth", JSON.stringify({ email, name: displayName || email }))
    navigate("/tracker")
  }

  const PasswordIcon = () => (
    <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )

  const EyeOpen = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  const EyeClosed = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

  return (
    <div className="future-homepage mega-homepage brand-page su-page-wrapper">
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

      <main className="su-main">
        <motion.div
          className="su-card hero-core-card"
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

          {/* Header */}
          <motion.div className="su-header" variants={itemVariants}>
            <Link to="/" className="su-brand">
              <svg className="brand-mark-small" viewBox="0 0 72 72" aria-hidden="true">
                <circle className="global-nav-orbit" cx="36" cy="36" r="28" />
                <path className="global-nav-path" d="M20 49L36 17L52 49" fill="none" />
                <path className="global-nav-path" d="M28 49L36 33L44 49" fill="none" />
                <path className="global-nav-path" d="M25 55H47" fill="none" />
                <circle className="global-nav-node" cx="36" cy="17" r="3.2" />
              </svg>
              <span>Obsidure</span>
            </Link>
            <p className="eyebrow">New Account</p>
            <h1 className="su-title">Sign Up</h1>
            <p className="su-sub">Create your profile. Only email &amp; password are required.</p>
          </motion.div>

          <motion.form className="su-form" onSubmit={handleSubmit} noValidate variants={containerVariants}>

            {/* ── MANDATORY ── */}
            <motion.div className="su-section-label" variants={itemVariants}>
              <span className="su-section-badge">Required</span>
            </motion.div>

            {/* Email */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-email">Email Address</label>
              <div className="su-input-wrap">
                <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  id="su-email"
                  type="email"
                  className={`su-input ${errors.email ? "su-input-error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })) }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="su-error-msg">{errors.email}</p>}
            </motion.div>

            {/* Password */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-password">Password</label>
              <div className="su-input-wrap">
                <PasswordIcon />
                <input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  className={`su-input ${errors.password ? "su-input-error" : ""}`}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }}
                  autoComplete="new-password"
                />
                <button type="button" className="su-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {errors.password && <p className="su-error-msg">{errors.password}</p>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-confirm">Confirm Password</label>
              <div className="su-input-wrap">
                <PasswordIcon />
                <input
                  id="su-confirm"
                  type={showConfirm ? "text" : "password"}
                  className={`su-input ${errors.confirmPassword ? "su-input-error" : ""}`}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: "" })) }}
                  autoComplete="new-password"
                />
                <button type="button" className="su-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {errors.confirmPassword && <p className="su-error-msg">{errors.confirmPassword}</p>}
            </motion.div>

            {/* ── OPTIONAL ── */}
            <motion.div className="su-section-label" variants={itemVariants}>
              <span className="su-section-badge su-section-badge--opt">Optional — Build your profile</span>
            </motion.div>

            {/* Display Name */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-name">Display Name</label>
              <div className="su-input-wrap">
                <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  id="su-name"
                  type="text"
                  className="su-input"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="nickname"
                />
              </div>
            </motion.div>

            {/* Gender + DOB row */}
            <motion.div className="su-row-2" variants={itemVariants}>
              <div className="su-field">
                <label className="su-label" htmlFor="su-gender">Gender</label>
                <div className="su-select-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <select id="su-gender" className="su-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not">Prefer not to say</option>
                    <option value="other">Other</option>
                  </select>
                  <svg className="su-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="su-field">
                <label className="su-label" htmlFor="su-dob">Date of Birth</label>
                <div className="su-input-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="su-dob"
                    type="date"
                    className="su-input su-date-input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </motion.div>

            {/* Phone number */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-phone">Phone Number</label>
              <div className="su-phone-wrap">
                <div
                  ref={countryBtnRef}
                  className="su-country-selector"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>{countryCode.flag}</span>
                  <span className="su-country-dial">{countryCode.code}</span>
                  <svg className={`su-country-chevron ${dropdownOpen ? "open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  id="su-phone"
                  type="tel"
                  className="su-input su-phone-input"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

            {/* Bio */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-bio">Short Bio</label>
              <textarea
                id="su-bio"
                className="su-textarea"
                placeholder="Tell us a little about yourself and your goals…"
                rows={3}
                maxLength={240}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <span className="su-char-count">{bio.length}/240</span>
            </motion.div>

            {/* Timezone + Week start row */}
            <motion.div className="su-row-2" variants={itemVariants}>
              <div className="su-field">
                <label className="su-label" htmlFor="su-tz">Timezone</label>
                <div className="su-select-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select id="su-tz" className="su-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="">Select timezone</option>
                    {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                  </select>
                  <svg className="su-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="su-field">
                <label className="su-label" htmlFor="su-week">Week Starts On</label>
                <div className="su-select-wrap">
                  <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <select id="su-week" className="su-select" value={weekStart} onChange={(e) => setWeekStart(e.target.value)}>
                    <option value="">Select day</option>
                    <option value="monday">Monday</option>
                    <option value="sunday">Sunday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                  <svg className="su-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Daily reminder time */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label" htmlFor="su-reminder">Daily Reminder Time</label>
              <div className="su-input-wrap">
                <svg className="su-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <input
                  id="su-reminder"
                  type="time"
                  className="su-input su-time-input"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </motion.div>

            {/* Habit Goals */}
            <motion.div className="su-field" variants={itemVariants}>
              <label className="su-label">Habit Goals <span className="su-label-hint">(pick any)</span></label>
              <div className="su-goals-grid">
                {HABIT_GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={`su-goal-chip ${selectedGoals.includes(goal) ? "selected" : ""}`}
                    onClick={() => toggleGoal(goal)}
                  >
                    {selectedGoals.includes(goal) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="primary-btn su-submit-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Account
            </motion.button>

            {/* Divider */}
            <motion.div className="su-divider" variants={itemVariants}>
              <span>or continue with</span>
            </motion.div>

            {/* Google */}
            <motion.button
              type="button"
              className="su-social-btn"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
            >
              <svg className="su-social-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            <motion.p className="su-footer-text" variants={itemVariants}>
              Already have an account?{" "}
              <Link to="/signin" className="su-link">Sign In</Link>
            </motion.p>

          </motion.form>
        </motion.div>
      </main>
    </div>
  )
}

export default SignUpPage
