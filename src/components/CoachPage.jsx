import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { GoogleGenAI } from "@google/genai"
import { motion, AnimatePresence } from "motion/react"

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" })

const SUGGESTED_COMMANDS = [
  { label: "Analyze My Performance", query: "Analyze my performance for this week." },
  { label: "Audit Calisthenics", query: "Evaluate my current calisthenics frequency and progression." },
  { label: "E-Commerce Action Plan", query: "Give me a strict protocol for my e-commerce brand tomorrow." }
]

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
  const [conversations, setConversations] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState("roast")
  const [dateRange, setDateRange] = useState("week")
  const [customDate, setCustomDate] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [chatsUsed, setChatsUsed] = useState(0)
  const [activeMessageIndex, setActiveMessageIndex] = useState(null)
  const [showConversationMenu, setShowConversationMenu] = useState(null)
  const feedEndRef = useRef(null)

  const MAX_CHATS = 10

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const createNewChat = () => {
    if (chatsUsed >= MAX_CHATS) {
      alert("You've reached your 10 free chat limit. Upgrade to continue.")
      return
    }
    const newChatId = Date.now()
    const newConversation = {
      id: newChatId,
      title: `Chat ${conversations.length + 1}`,
      createdAt: new Date(),
      messages: [
        {
          sender: "coach",
          text: "SYSTEM INITIALIZED. I am your NOIR HABIT intelligence. Select your coaching mode and input a query to audit your routine.",
        }
      ]
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentChatId(newChatId)
    setMessages(newConversation.messages)
    setChatsUsed(prev => prev + 1)
  }

  const selectConversation = (chatId) => {
    const chat = conversations.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
    }
  }

  const deleteConversation = (chatId) => {
    setConversations(prev => prev.filter(c => c.id !== chatId))
    if (currentChatId === chatId) {
      setCurrentChatId(null)
      setMessages([])
    }
    setShowConversationMenu(null)
  }

  const renameConversation = (chatId, newTitle) => {
    setConversations(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c))
    setShowConversationMenu(null)
  }

  const callWithRetry = async (prompt, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite",
          contents: prompt,
        })
        return result.text
      } catch (err) {
        const is503 = err?.message?.includes("503") || err?.message?.includes("UNAVAILABLE") || err?.message?.includes("high demand")
        const isLastAttempt = attempt === maxRetries
        if (is503 && !isLastAttempt) {
          const delay = 1000 * Math.pow(2, attempt - 1)
          console.warn(`Attempt ${attempt} failed (server overload). Retrying in ${delay / 1000}s...`)
          await new Promise(res => setTimeout(res, delay))
        } else {
          throw err
        }
      }
    }
  }

  const generateAIResponse = async (userQuery) => {
    setIsTyping(true)

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error("API Key is missing.")
      }

      let systemPrompt = ""
      if (mode === "roast") {
        systemPrompt = `You are a brutal, highly intelligent, unforgiving performance coach for the Noir Habit system.
        The user is trying to build a minimalist aesthetic life, but they are failing.
        Here is their data for the ${dateRange}: ${USER_WEEKLY_DATA}

        Roast them based on this data. Use sharp, sarcastic headings.
        Call out their excuses. Tell them they are building a museum of untouched intentions.
        End with a strict, unbreakable protocol for tomorrow. Be harsh, concise, formatting with bolding and clean spacing.`
      } else {
        systemPrompt = `You are an elite, highly intelligent, and structured performance coach for the Noir Habit system.
        The user's goal is to build a sustainable lifestyle, focusing on duration and endurance rather than brief bursts of speed.
        Here is their data for the ${dateRange}: ${USER_WEEKLY_DATA}

        Analyze their data. Be highly analytical, supportive, and structured.
        Point out the lack of momentum but focus on how to build sustainable systems.
        Format with clean headings and bullet points.`
      }

      const responseText = await callWithRetry(`${systemPrompt}\n\nUser Query: ${userQuery}`)
      const updatedMessages = [...messages, { sender: "user", text: userQuery }, { sender: "coach", text: responseText }]
      setMessages(updatedMessages)

      if (currentChatId) {
        setConversations(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: updatedMessages } : c))
      }
    } catch (error) {
      console.error("AI Error:", error)
      const is503 = error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE")
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

  const copyMessageToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const downloadChat = (format = "txt") => {
    const content = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n\n")
    const element = document.createElement("a")
    element.setAttribute("href", format === "txt"
      ? `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
      : `data:application/pdf;base64,${btoa(content)}`)
    element.setAttribute("download", `chat_${Date.now()}.${format}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
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

      <div className="coach-interface-container-v2">
        {/* CONVERSATION HISTORY SIDEBAR */}
        <aside className="coach-conversations-panel tracker-shell">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", color: "var(--home-text)" }}>CONVERSATIONS</h3>
            <span style={{ fontSize: "12px", color: "var(--home-accent)" }}>{chatsUsed}/{MAX_CHATS}</span>
          </div>

          <button
            onClick={createNewChat}
            disabled={chatsUsed >= MAX_CHATS}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "12px",
              border: "1px solid var(--home-border)",
              background: chatsUsed >= MAX_CHATS ? "rgba(255, 100, 100, 0.1)" : "rgba(0, 255, 213, 0.1)",
              color: chatsUsed >= MAX_CHATS ? "var(--danger)" : "var(--home-accent)",
              cursor: chatsUsed >= MAX_CHATS ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all var(--transition)"
            }}
          >
            + New Chat
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
            {conversations.map(conv => (
              <div
                key={conv.id}
                style={{
                  position: "relative",
                  padding: "12px",
                  borderRadius: "12px",
                  background: currentChatId === conv.id ? "rgba(0, 255, 213, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${currentChatId === conv.id ? "var(--home-accent)" : "var(--home-border)"}`,
                  cursor: "pointer",
                  transition: "all var(--transition)",
                }}
              >
                <div onClick={() => selectConversation(conv.id)} style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", color: "var(--home-text)", marginBottom: "4px", truncate: "true" }}>{conv.title}</p>
                  <span style={{ fontSize: "11px", color: "var(--home-muted)" }}>
                    {conv.messages.length} messages
                  </span>
                </div>

                <button
                  onClick={() => setShowConversationMenu(showConversationMenu === conv.id ? null : conv.id)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "12px",
                    background: "none",
                    border: "none",
                    color: "var(--home-muted)",
                    fontSize: "18px",
                    cursor: "pointer"
                  }}
                >
                  ⋯
                </button>

                <AnimatePresence>
                  {showConversationMenu === conv.id && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "40px",
                        background: "rgba(11, 16, 32, 0.96)",
                        border: "1px solid var(--home-border)",
                        borderRadius: "8px",
                        backdropFilter: "blur(16px)",
                        zIndex: 1000,
                        minWidth: "160px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      <button
                        onClick={() => {
                          const newName = prompt("Enter new name:", conv.title)
                          if (newName) renameConversation(conv.id, newName)
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          color: "var(--home-muted)",
                          fontSize: "13px",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => downloadChat("txt")}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          color: "var(--home-muted)",
                          fontSize: "13px",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(messages.map(m => `${m.sender}: ${m.text}`).join("\n\n"))
                          alert("Conversation copied!")
                          setShowConversationMenu(null)
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          color: "var(--home-muted)",
                          fontSize: "13px",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                      >
                        Share
                      </button>
                      <button
                        onClick={() => deleteConversation(conv.id)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 14px",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          color: "var(--danger)",
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <Link to="/" className="secondary-btn nav-link-btn" style={{ width: "100%", marginTop: "auto" }}>
            Return Home
          </Link>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="coach-chat-terminal-v2 tracker-shell">
          <header className="terminal-header-node-v2">
            <div>
              <h3>COGNITIVE CONSOLE</h3>
              <p style={{ fontSize: "14px", color: "var(--home-muted)" }}>Live Data Analysis</p>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    border: "1px solid var(--home-border)",
                    background: "rgba(255, 255, 255, 0.03)",
                    color: "var(--home-muted)",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  {dateRange === "custom" ? "CUSTOM" : dateRange.toUpperCase()}
                </button>

                <AnimatePresence>
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: "absolute",
                        top: "40px",
                        right: "0",
                        background: "rgba(11, 16, 32, 0.96)",
                        border: "1px solid var(--home-border)",
                        borderRadius: "8px",
                        backdropFilter: "blur(16px)",
                        padding: "12px",
                        zIndex: 100,
                        minWidth: "160px"
                      }}
                    >
                      {["today", "week", "month", "year"].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setDateRange(option)
                            setShowDatePicker(false)
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "8px 12px",
                            textAlign: "left",
                            background: dateRange === option ? "rgba(0, 255, 213, 0.1)" : "none",
                            border: "none",
                            color: dateRange === option ? "var(--home-accent)" : "var(--home-muted)",
                            fontSize: "13px",
                            cursor: "pointer",
                            borderRadius: "6px",
                            marginBottom: "4px"
                          }}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => {
                          setCustomDate(e.target.value)
                          setDateRange("custom")
                        }}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid var(--home-border)",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: "var(--home-text)",
                          fontSize: "12px",
                          marginTop: "8px"
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <div className="terminal-message-matrix">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`matrix-row ${msg.sender === "user" ? "user-row-align" : "coach-row-align"}`}
                onMouseEnter={() => setActiveMessageIndex(i)}
                onMouseLeave={() => setActiveMessageIndex(null)}
              >
                <div className={`matrix-bubble ${msg.sender === "user" ? "user-bubble-style" : "coach-bubble-style"}`}>
                  <span className="card-label" style={{ fontSize: "10px", marginBottom: "6px", display: "block" }}>
                    {msg.sender === "user" ? "YOU" : `AI [${mode.toUpperCase()}]`}
                  </span>
                  <div style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--home-muted)", marginBottom: "8px" }}>
                    {formatMessage(msg.text)}
                  </div>

                  {activeMessageIndex === i && msg.sender === "coach" && (
                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "8px" }}>
                      <button onClick={() => copyMessageToClipboard(msg.text)} style={{ background: "none", border: "none", color: "var(--home-accent)", fontSize: "12px", cursor: "pointer" }}>📋 Copy</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="matrix-row coach-row-align">
                <div className="matrix-bubble coach-bubble-style intelligence-pulse">
                  <p style={{ fontSize: "14px", color: "var(--home-accent)" }}>Thinking...</p>
                </div>
              </div>
            )}
            <div ref={feedEndRef} />
          </div>

          <footer className="terminal-control-dock-v2">
            <div className="prompt-pill-row-layout">
              {SUGGESTED_COMMANDS.map((cmd, idx) => (
                <button key={idx} className="prompt-action-pill-node" onClick={() => handleSend(cmd.query)}>
                  {cmd.label}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto", gap: "12px", alignItems: "center" }}>
              <form className="terminal-input-input-row" onSubmit={(e) => { e.preventDefault(); handleSend(input); }} style={{ gridColumn: "1" }}>
                <input
                  type="text"
                  className="habit-input"
                  placeholder="Ask your coach..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </form>

              <button onClick={() => copyMessageToClipboard(input)} title="Copy prompt" style={{ background: "none", border: "none", color: "var(--home-accent)", fontSize: "18px", cursor: "pointer" }}>📋</button>
              <button onClick={() => handleSend(input)} disabled={isTyping} style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--home-accent)", background: "rgba(0, 255, 213, 0.1)", color: "var(--home-accent)", cursor: "pointer" }}>Send</button>
              <button onClick={() => downloadChat("txt")} title="Download as TXT" style={{ background: "none", border: "none", color: "var(--home-muted)", fontSize: "16px", cursor: "pointer" }}>⬇️</button>
              <button onClick={() => downloadChat("pdf")} title="Download as PDF" style={{ background: "none", border: "none", color: "var(--home-muted)", fontSize: "16px", cursor: "pointer" }}>📄</button>
              <button onClick={() => copyMessageToClipboard(messages.map(m => `${m.sender}: ${m.text}`).join("\n\n"))} title="Share conversation" style={{ background: "none", border: "none", color: "var(--home-muted)", fontSize: "16px", cursor: "pointer" }}>🔗</button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default CoachPage
