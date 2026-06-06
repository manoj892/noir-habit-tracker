import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { GoogleGenAI } from "@google/genai"  // ✅ NEW SDK (replaces deprecated @google/generative-ai)

// Initialize with the new unified Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" })

const SUGGESTED_COMMANDS = [
  { label: "Analyze My Performance", query: "Analyze my performance for this week." },
  { label: "Audit Calisthenics", query: "Evaluate my current calisthenics frequency and progression." },
  { label: "E-Commerce Action Plan", query: "Give me a strict protocol for my e-commerce brand tomorrow." }
]

// Simulated backend data to feed the AI context about your week
const USER_WEEKLY_DATA = `
Current Week Log:
- Calisthenics: 4 minutes
- Content Creation: 4 minutes
- E-commerce / Brand Work: 0 minutes
- Financial Education / Crash Prep: 0 minutes
- B.Com 5th Sem Academics: 6 minutes
Total active days: 1 out of 7.
Habits are heavily fragmented into sub-categories.
`

function CoachPage() {
  const [messages, setMessages] = useState([
    {
      sender: "coach",
      text: "SYSTEM INITIALIZED. I am your NOIR HABIT intelligence. Select your coaching mode and input a query to audit your routine.",
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState("roast") // 'normal' or 'roast'
  const feedEndRef = useRef(null)

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Retry wrapper: handles Google's 503 "high demand" server errors automatically
  const callWithRetry = async (prompt, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite", // ✅ Free forever — 30 RPM / 1,500 req/day, no credit card
          contents: prompt,
        })
        return result.text
      } catch (err) {
        const is503 = err?.message?.includes("503") || err?.message?.includes("UNAVAILABLE") || err?.message?.includes("high demand")
        const isLastAttempt = attempt === maxRetries
        if (is503 && !isLastAttempt) {
          // Exponential backoff: 1s → 2s → 4s
          const delay = 1000 * Math.pow(2, attempt - 1)
          console.warn(`Attempt ${attempt} failed (server overload). Retrying in ${delay / 1000}s...`)
          await new Promise(res => setTimeout(res, delay))
        } else {
          throw err // non-503 error or out of retries → bubble up
        }
      }
    }
  }

  const generateAIResponse = async (userQuery) => {
    setIsTyping(true)

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("API Key is missing. Please ensure your .env file contains VITE_GEMINI_API_KEY=your_key and restart the server.")
      }

      // System Instructions based on selected mode
      let systemPrompt = ""
      if (mode === "roast") {
        systemPrompt = `You are a brutal, highly intelligent, unforgiving performance coach for the Noir Habit system. 
        The user is trying to build a minimalist aesthetic life, but they are failing. 
        Here is their data for the week: ${USER_WEEKLY_DATA}
        
        Roast them based on this data. Use sharp, sarcastic headings like 'The Diagnosis: Ghost Mode', 'The Brutal Reality', 'The Wealth Delusion', or 'Academic Anemia'. 
        Call out their excuses. Tell them they are building a museum of untouched intentions. Mock their 4-minute workouts and 0-minute business building. 
        End with a strict, unbreakable protocol for tomorrow. Be harsh, concise, formatting with bolding and clean spacing.`
      } else {
        systemPrompt = `You are an elite, highly intelligent, and structured performance coach for the Noir Habit system.
        The user's goal is to build a sustainable lifestyle, focusing on duration and endurance rather than brief bursts of speed. 
        Here is their data for the week: ${USER_WEEKLY_DATA}
        
        Analyze their data. Be highly analytical, supportive, and structured. 
        Point out the lack of momentum but focus on how to build sustainable systems. 
        Provide a strategic plan to integrate their calisthenics, e-commerce, and B.Com studies efficiently. Format with clean headings and bullet points.`
      }

      const responseText = await callWithRetry(`${systemPrompt}\n\nUser Query: ${userQuery}`)
      setMessages(prev => [...prev, { sender: "coach", text: responseText }])
    } catch (error) {
      console.error("AI Error:", error)
      const is503 = error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE") || error?.message?.includes("high demand")
      const userMsg = is503
        ? "SERVER OVERLOADED — Google's servers are under heavy load right now. Wait 10–15 seconds and try again."
        : `SYSTEM ERROR: ${error.message || "Failed to connect to neural network."}`
      setMessages(prev => [...prev, { sender: "coach", text: userMsg }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return
    setMessages(prev => [...prev, { sender: "user", text: textToSend }])
    setInput("")
    generateAIResponse(textToSend)
  }

  // Helper function to format the AI's markdown text (bolding and line breaks)
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      // Handle bold text **like this**
      const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} style={{ color: "var(--home-text)" }}>{part.slice(2, -2)}</strong>
        }
        return part
      })
      return <span key={i} style={{ display: "block", marginBottom: "8px" }}>{formattedLine}</span>
    })
  }

  return (
    <div className="homepage future-homepage mega-homepage page">
      <div className="future-noise" />
      <div className="future-grid" />

      <div className="coach-interface-container">

        <aside className="coach-sidebar-panel tracker-shell">
          <div className="brand-lockup" style={{ marginBottom: "32px" }}>
            <svg className="brand-mark" viewBox="0 0 72 72">
              <circle className="brand-orbit" cx="36" cy="36" r="28" />
              <path className="logo-path" d="M20 49L36 17L52 49" fill="none" />
              <circle className="brand-node" cx="36" cy="17" r="3.2" />
            </svg>
            <div className="logo-wordmark">
              <span className="logo" style={{ fontSize: "16px" }}>COACH CONSOLE</span>
            </div>
          </div>

          <div className="diagnostic-metric-card">
            <span className="card-label">COMPLETION RATE</span>
            <h4>~4% ACTIVE</h4>
            <div className="hero-data-bar-track" style={{ marginTop: "8px" }}>
              <div className="hero-data-bar-fill" style={{ width: "4%", background: "var(--danger)" }} />
            </div>
          </div>

          <div className="diagnostic-metric-card">
            <span className="card-label">TOP HABIT</span>
            <h4>B.COM STUDIES</h4>
            <p style={{ fontSize: "13px", color: "var(--home-muted)", marginTop: "4px" }}>
              6 minutes total. Minimal viable effort detected.
            </p>
          </div>

          <div className="diagnostic-metric-card">
            <span className="card-label">SYSTEM WARNING</span>
            <h4 style={{ color: "var(--danger)" }}>GHOST MODE</h4>
            <p style={{ fontSize: "13px", color: "var(--home-muted)", marginTop: "4px" }}>
              Over-architecting detected. Fragmented sub-habits causing paralysis.
            </p>
          </div>

          <Link to="/" className="secondary-btn nav-link-btn" style={{ width: "100%", marginTop: "auto" }}>
            Return to Core Portal
          </Link>
        </aside>

        <main className="coach-chat-terminal tracker-shell">
          <header className="terminal-header-node" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>COGNITIVE CONSOLE</h3>
              <p style={{ fontSize: "14px", color: "var(--home-muted)" }}>
                Live Data Analysis Integration
              </p>
            </div>

            {/* MODE TOGGLE SWITCH */}
            <div className="mode-toggle-wrapper">
              <span className={`mode-label ${mode === 'normal' ? 'active-mode' : ''}`}>NORMAL</span>
              <button
                className={`mode-switch ${mode === 'roast' ? 'roast-active' : ''}`}
                onClick={() => setMode(mode === 'normal' ? 'roast' : 'normal')}
              >
                <div className="mode-knob" />
              </button>
              <span className={`mode-label ${mode === 'roast' ? 'active-roast-mode' : ''}`}>ROAST</span>
            </div>
          </header>

          <div className="terminal-message-matrix">
            {messages.map((msg, i) => (
              <div key={i} className={`matrix-row ${msg.sender === "user" ? "user-row-align" : "coach-row-align"}`}>
                <div className={`matrix-bubble ${msg.sender === "user" ? "user-bubble-style" : "coach-bubble-style"}`}>
                  <span className="card-label" style={{ fontSize: "10px", marginBottom: "6px", display: "block" }}>
                    {msg.sender === "user" ? "USER QUERY" : `AI ANALYSIS [${mode.toUpperCase()}]`}
                  </span>
                  <div style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--home-muted)" }}>
                    {formatMessage(msg.text)}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="matrix-row coach-row-align">
                <div className="matrix-bubble coach-bubble-style intelligence-pulse">
                  <p style={{ fontSize: "14px", color: "var(--home-accent)" }}>Synthesizing brutal reality... (auto-retrying if server overloaded)</p>
                </div>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>

          <footer className="terminal-control-dock">
            <div className="prompt-pill-row-layout">
              {SUGGESTED_COMMANDS.map((cmd, idx) => (
                <button key={idx} className="prompt-action-pill-node" onClick={() => handleSend(cmd.query)}>
                  {cmd.label}
                </button>
              ))}
            </div>

            <form className="terminal-input-input-row" onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
              <input
                type="text"
                className="habit-input"
                placeholder="Ask your coach to analyze your performance..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="primary-btn" style={{ minHeight: "56px", borderRadius: "18px", padding: "0 28px" }} disabled={isTyping}>
                Execute
              </button>
            </form>
          </footer>
        </main>

      </div>
    </div>
  )
}

export default CoachPage
