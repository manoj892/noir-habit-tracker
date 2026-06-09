import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import './TrackerShell.css'

// ─── Auth helpers ────────────────────────────────────────────────────────────
const AUTH_KEY  = "habitflow-auth"
const DATA_KEY  = "habitflow-groups"
const getAuth   = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)) } catch { return null } }
const clearAuth = () => localStorage.removeItem(AUTH_KEY)

// ─── Constants ───────────────────────────────────────────────────────────────
const FREE_LIMIT = 5

const EMOJI_LIST = [
  "💰","💵","📈","💳","🏦","💎","🤑","💸","📊","🏧",
  "❤️","🫀","🩺","🩻","💊","🧬","🌡️","🩹","🏥","💉",
  "🏋️","🤸","🧘","🚴","🏃","⚽","🏊","🥊","🤾","🧗",
  "🧠","📚","✏️","🎓","🔬","🧩","📖","💡","🔭","📝",
  "💼","🖥️","📋","🗂️","📌","🛠️","⚙️","🖨️","🗃️","📎",
  "🤝","👥","💬","🎉","🥂","🫂","🌐","📣","🗣️","🫶",
  "🎨","🎵","🎬","✍️","🖌️","📷","🎭","🎸","🎹","🎤",
  "😴","🌙","🛏️","🧸","☁️","🌿","🕯️","🛁","🌛","🫧",
  "🥗","🍎","🥤","🫖","🥦","🍳","🧃","🥑","🍇","🥕",
  "⚡","🔥","🌟","✨","🎯","🏆","🚀","🛸","💫","🌈",
  "🦋","🌸","🍀","🌊","☀️","⭐","🌺","🌻","🍃","🦄",
  "🧲","🔑","🗝️","🛡️","⚔️","🎪","🎠","🎡","🎢","🎰",
]

const PRESET_UNITS = [
  { label: "Minutes",    value: "min"   },
  { label: "Hours",      value: "hr"    },
  { label: "Seconds",    value: "sec"   },
  { label: "Sets",       value: "sets"  },
  { label: "Reps",       value: "reps"  },
  { label: "Pages",      value: "pages" },
  { label: "Kilometers", value: "km"    },
  { label: "Steps",      value: "steps" },
  { label: "Litres",     value: "L"     },
  { label: "Calories",   value: "kcal"  },
  { label: "Times",      value: "×"     },
  { label: "Custom…",    value: "__custom__" },
]

const PALETTE = [
  "#f5c542","#ff6b81","#a78bfa","#34d399","#60a5fa",
  "#f97316","#e879f9","#2dd4bf","#fb7185","#818cf8",
  "#facc15","#4ade80","#38bdf8","#c084fc","#f472b6",
  "#fb923c","#86efac","#67e8f9","#d8b4fe","#fda4af",
]

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 10 }, (_, i) => THIS_YEAR - 9 + i).reverse()

const defaultGroups = [
  {
    id: 1, name: "Wealth", icon: "💰", color: "#f5c542", collapsed: false,
    children: [
      { id: 11, name: "Job applications", icon: "💼", color: "#f5c542", goal: 5,   unit: "×",    entries: { "2026-06-03": { done: true,  note: "Applied to 3.", pushed: false, value: 3 } } },
      { id: 12, name: "Freelancing",      icon: "💻", color: "#f5c542", goal: 2,   unit: "hr",   entries: { "2026-06-03": { done: false, note: "",            pushed: false, value: "" } } },
    ]
  },
  {
    id: 2, name: "Health", icon: "❤️", color: "#ff6b81", collapsed: false,
    children: [
      { id: 21, name: "Morning walk", icon: "🏃", color: "#ff6b81", goal: 30,  unit: "min",  entries: { "2026-06-03": { done: true,  note: "Felt great.", pushed: false, value: 35 } } },
      { id: 22, name: "Hydration",    icon: "🥤", color: "#ff6b81", goal: 2.5, unit: "L",    entries: { "2026-06-03": { done: false, note: "",            pushed: false, value: "" } } },
    ]
  },
  {
    id: 3, name: "Mind", icon: "🧠", color: "#a78bfa", collapsed: false,
    children: [
      { id: 31, name: "Reading", icon: "📖", color: "#a78bfa", goal: 20, unit: "pages", entries: { "2026-06-03": { done: true, note: "10 pages.", pushed: false, value: 10 } } },
    ]
  },
]

function getStreak(habit, fromDateKey, getDateKeyFn) {
  let streak = 0
  const d = new Date(fromDateKey)
  while (true) {
    const key = getDateKeyFn(d)
    if (habit.entries[key]?.done) { streak++; d.setDate(d.getDate() - 1) } else break
  }
  return streak
}

// ─── EmojiPicker — closes on outside click ───────────────────────────────────
function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="emoji-picker-wrap" ref={wrapRef}>
      <button className="emoji-trigger" type="button" onClick={() => setOpen(o => !o)}>
        <span>{value || "⚡"}</span>
        <span className="emoji-trigger-caret">{open ? "▲" : "▼"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="emoji-panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            {EMOJI_LIST.map(e => (
              <button key={e} type="button"
                className={`emoji-cell ${value === e ? "emoji-cell-active" : ""}`}
                onClick={() => { onChange(e); setOpen(false) }}
              >{e}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker-row">
      {PALETTE.map(c => (
        <button key={c} type="button"
          className={`color-swatch ${value === c ? "color-swatch-active" : ""}`}
          style={{ background: c }} onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}

// ─── Limit row: goal + unit side by side ─────────────────────────────────────
function LimitSelector({ unit, goal, onUnitChange, onGoalChange }) {
  const isCustom = !PRESET_UNITS.find(u => u.value === unit && u.value !== "__custom__")
  return (
    <div className="unit-selector-wrap">
      <div className="limit-row">
        <input className="habit-input goal-input" type="number" min="0" step="any"
          placeholder="Limit" value={goal} onChange={e => onGoalChange(e.target.value)} />
        <div className="unit-chips">
          {PRESET_UNITS.map(u => {
            const active = u.value === "__custom__" ? isCustom : unit === u.value
            return (
              <button key={u.value} type="button"
                className={`unit-chip ${active ? "unit-chip-active" : ""}`}
                onClick={() => u.value === "__custom__" ? onUnitChange("") : onUnitChange(u.value)}
              >{u.label}</button>
            )
          })}
        </div>
      </div>
      {isCustom && (
        <input className="habit-input" placeholder="Your unit (e.g. pushups)"
          value={unit} onChange={e => onUnitChange(e.target.value)} />
      )}
    </div>
  )
}

function LimitBanner({ navigate }) {
  return (
    <motion.div className="limit-banner" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <span>🔒 Free plan: 5 habits max.</span>
      <span className="limit-banner-sub">Sign in to unlock unlimited habits.</span>
      <button className="limit-signin-btn" onClick={() => navigate("/signin")}>Sign In →</button>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TrackerShell() {
  const navigate = useNavigate()
  const [authUser, setAuthUser] = useState(getAuth)

  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem(DATA_KEY)
    return saved ? JSON.parse(saved) : defaultGroups
  })

  const [currentDate,  setCurrentDate]  = useState(new Date("2026-06-03"))
  const [selectedDate, setSelectedDate] = useState(new Date("2026-06-03"))
  const [jumpOpen,  setJumpOpen]  = useState(false)
  const [jumpMonth, setJumpMonth] = useState(new Date("2026-06-03").getMonth())
  const [jumpYear,  setJumpYear]  = useState(new Date("2026-06-03").getFullYear())

  // create form
  const [modal,       setModal]       = useState(false)
  const [fGroupId,    setFGroupId]    = useState(null)
  const [fGroupName,  setFGroupName]  = useState("")
  const [fGroupIcon,  setFGroupIcon]  = useState("⚡")
  const [fGroupColor, setFGroupColor] = useState(PALETTE[0])
  const [fName,  setFName]  = useState("")
  const [fIcon,  setFIcon]  = useState("⚡")
  const [fColor, setFColor] = useState(PALETTE[0])
  const [fGoal,  setFGoal]  = useState("")
  const [fUnit,  setFUnit]  = useState("min")

  // edit form
  const [editModal,   setEditModal]   = useState(null)
  const [editGroupId, setEditGroupId] = useState(null)
  const [editName,  setEditName]  = useState("")
  const [editIcon,  setEditIcon]  = useState("⚡")
  const [editColor, setEditColor] = useState(PALETTE[0])
  const [editGoal,  setEditGoal]  = useState("")
  const [editUnit,  setEditUnit]  = useState("min")

  useEffect(() => { localStorage.setItem(DATA_KEY, JSON.stringify(groups)) }, [groups])

  // ── date helpers ──────────────────────────────────────────────────────────
  const getStartOfWeek = (date) => {
    const c = new Date(date); const day = c.getDay()
    c.setDate(c.getDate() + (day === 0 ? -6 : 1 - day)); c.setHours(0,0,0,0); return c
  }
  const getWeekDays = (date) => {
    const s = getStartOfWeek(date)
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate()+i); return d })
  }
  const fmt       = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const fmtDay    = (d) => d.toLocaleDateString("en-US", { weekday: "short" })
  const fmtNum    = (d) => d.toLocaleDateString("en-US", { day: "2-digit" })
  const isSameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()
  const getDateKey = (d) => d.toLocaleDateString("en-CA")

  const selectedDateKey = getDateKey(selectedDate)
  const weekDays        = getWeekDays(currentDate)
  const allChildren     = groups.flatMap(g => g.children)
  const completedToday  = allChildren.filter(h => h.entries[selectedDateKey]?.done).length
  const totalChildren   = allChildren.length
  const progressPct     = totalChildren ? Math.round((completedToday / totalChildren) * 100) : 0
  const atLimit         = !authUser && totalChildren >= FREE_LIMIT

  const getDayDensity = (date) => {
    const key = getDateKey(date)
    const done = allChildren.filter(h => h.entries[key]?.done).length
    return totalChildren ? done / totalChildren : 0
  }

  const prevWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate()-7); setCurrentDate(d); setSelectedDate(d) }
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate()+7); setCurrentDate(d); setSelectedDate(d) }
  const applyJump = () => { const d = new Date(jumpYear, jumpMonth, 1); setCurrentDate(d); setSelectedDate(d); setJumpOpen(false) }

  const toggleGroupCollapse = (gid) =>
    setGroups(prev => prev.map(g => g.id === gid ? { ...g, collapsed: !g.collapsed } : g))

  // ── create ────────────────────────────────────────────────────────────────
  const openModal = (presetGroupId = null) => {
    if (atLimit) { navigate("/signin"); return }
    setFGroupId(presetGroupId ?? (groups.length ? groups[0].id : "__new__"))
    setFGroupName(""); setFGroupIcon("⚡"); setFGroupColor(PALETTE[0])
    setFName(""); setFIcon("⚡")
    setFColor(presetGroupId ? (groups.find(g => g.id===presetGroupId)?.color || PALETTE[0]) : PALETTE[0])
    setFGoal(""); setFUnit("min")
    setModal(true)
  }

  const saveHabit = () => {
    if (!fName.trim()) return
    let gid = fGroupId
    if (fGroupId === "__new__") {
      if (!fGroupName.trim()) return
      gid = Date.now()
      setGroups(prev => [...prev, { id: gid, name: fGroupName, icon: fGroupIcon, color: fGroupColor, collapsed: false, children: [] }])
    }
    const child = { id: Date.now()+1, name: fName, icon: fIcon, color: fColor, goal: fGoal ? Number(fGoal) : null, unit: fUnit, entries: {} }
    setGroups(prev => prev.map(g => g.id !== gid ? g : { ...g, children: [...g.children, child] }))
    setModal(false)
  }

  // ── edit ──────────────────────────────────────────────────────────────────
  const openEdit = (groupId, child) => {
    setEditModal({ groupId, childId: child.id })
    setEditGroupId(groupId)
    setEditName(child.name); setEditIcon(child.icon || "⚡")
    setEditColor(child.color || PALETTE[0]); setEditGoal(child.goal ?? ""); setEditUnit(child.unit || "min")
  }
  const saveEdit = () => {
    if (!editName.trim()) return
    let saved = null
    setGroups(prev => {
      const s1 = prev.map(g => {
        if (g.id !== editModal.groupId) return g
        saved = g.children.find(c => c.id === editModal.childId)
        return { ...g, children: g.children.filter(c => c.id !== editModal.childId) }
      })
      return s1.map(g => {
        if (g.id !== editGroupId) return g
        const updated = { ...(saved||{}), name: editName, icon: editIcon, color: editColor, goal: editGoal ? Number(editGoal) : null, unit: editUnit }
        return { ...g, children: [...g.children, updated] }
      })
    })
    setEditModal(null)
  }

  // ── delete ────────────────────────────────────────────────────────────────
  const deleteGroup = (gid) => setGroups(prev => prev.filter(g => g.id !== gid))
  const deleteChild = (gid, cid) =>
    setGroups(prev => prev.map(g => g.id !== gid ? g : { ...g, children: g.children.filter(c => c.id !== cid) }))

  // ── entries ───────────────────────────────────────────────────────────────
  const updateChildEntry = (gid, cid, updater) =>
    setGroups(prev => prev.map(g => {
      if (g.id !== gid) return g
      return { ...g, children: g.children.map(c => {
        if (c.id !== cid) return c
        const cur = c.entries[selectedDateKey] || { done: false, note: "", pushed: false, value: "" }
        return { ...c, entries: { ...c.entries, [selectedDateKey]: updater(cur) } }
      })}
    }))

  const toggleDone = (gid, cid) => updateChildEntry(gid, cid, e => ({ ...e, done: !e.done }))

  const togglePushed = (gid, cid) => updateChildEntry(gid, cid, e => ({ ...e, pushed: !e.pushed }))

  const updateNote  = (gid, cid, val) => updateChildEntry(gid, cid, e => ({ ...e, note: val }))

  // when value changes: auto-sync pushed based on whether value exceeds goal
  const updateValue = (gid, cid, val, habit) => {
    updateChildEntry(gid, cid, e => {
      const numVal = parseFloat(val)
      const autoPushed = habit.goal && !isNaN(numVal) && val !== ""
        ? numVal > habit.goal
        : false
      return { ...e, value: val, pushed: autoPushed }
    })
  }

  const resetAllData = () => {
    if (!window.confirm("Clear all groups and entries?")) return
    setGroups(defaultGroups); localStorage.removeItem(DATA_KEY)
  }

  const handleSignOut = () => { clearAuth(); setAuthUser(null) }

  // ── shared modal fields ───────────────────────────────────────────────────
  const GroupFields = ({ gid, gName, gIcon, gColor, setGName, setGIcon, setGColor }) => (
    <AnimatePresence>
      {gid === "__new__" && (
        <motion.div className="modal-subfields"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
        >
          <div className="modal-field">
            <label className="modal-label">Group name</label>
            <input className="habit-input" placeholder="e.g. Wealth" value={gName} onChange={e => setGName(e.target.value)} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Group icon</label>
            <EmojiPicker value={gIcon} onChange={setGIcon} />
          </div>
          <div className="modal-field">
            <label className="modal-label">Group color</label>
            <ColorPicker value={gColor} onChange={setGColor} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <section className="tracker-shell-section">
      <motion.div className="section-heading"
        initial={{ opacity: 0, filter: "blur(10px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8 }}
      >
        <p className="eyebrow">Tracker preview</p>
        <h2>A weekly calendar habit tracker with notes and intensity.</h2>
      </motion.div>

      <motion.div className="tracker-shell"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8 }}
      >
        {totalChildren > 0 && (
          <div className="tracker-progress-bar-wrap">
            <div className="tracker-progress-meta">
              <span>{completedToday} / {totalChildren} done</span>
              <span>{progressPct}%</span>
            </div>
            <div className="tracker-progress-track">
              <motion.div className="tracker-progress-fill"
                initial={{ scaleX: 0 }} animate={{ scaleX: progressPct / 100 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )}

        {/* Topbar */}
        <div className="tracker-topbar">
          <button className="week-arrow" onClick={prevWeek}>←</button>
          <div className="tracker-week">
            <p className="card-label">Week view</p>
            <h3>{fmt(weekDays[0])} – {fmt(weekDays[6])}</h3>
            <div className="jump-row">
              <button className="jump-toggle-btn" onClick={() => setJumpOpen(o => !o)}>
                📅 Jump to date
              </button>
            </div>
            <AnimatePresence>
              {jumpOpen && (
                <motion.div className="jump-panel"
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="jump-selects">
                    <select className="jump-select" value={jumpMonth} onChange={e => setJumpMonth(Number(e.target.value))}>
                      {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select className="jump-select" value={jumpYear} onChange={e => setJumpYear(Number(e.target.value))}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button className="primary-btn jump-go-btn" onClick={applyJump}>Go</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="week-arrow" onClick={nextWeek}>→</button>
        </div>

        {/* Week strip */}
        <div className="week-strip">
          {weekDays.map((date, i) => {
            const density = getDayDensity(date)
            return (
              <motion.button key={date.toISOString()}
                className={`day-pill ${isSameDay(date, selectedDate) ? "active-day" : ""}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}
                onClick={() => setSelectedDate(date)}
              >
                <span>{fmtDay(date)}</span>
                <strong>{fmtNum(date)}</strong>
                {density > 0 && (
                  <div className="day-density-bar">
                    <div className="day-density-fill" style={{ width: `${density * 100}%` }} />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Toolbar */}
        <div className="tracker-toolbar">
          <div className="selected-date-line">
            <span>Selected day:</span>{" "}
            {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </div>
          <div className="tracker-toolbar-actions">
            <button className="secondary-btn" onClick={() => openModal()}>+ Create Habit</button>
            <button className="danger-btn" onClick={resetAllData}>Reset All</button>
          </div>
        </div>

        {atLimit && <LimitBanner navigate={navigate} />}

        {/* Habit groups */}
        <div className="habit-list">
          <AnimatePresence>
            {groups.length === 0 && (
              <motion.div className="habit-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>No habits yet. Hit "+ Create Habit" to get started!</p>
              </motion.div>
            )}

            {groups.map((group) => {
              const groupDone  = group.children.filter(c => c.entries[selectedDateKey]?.done).length
              const groupTotal = group.children.length
              const groupPct   = groupTotal ? Math.round((groupDone / groupTotal) * 100) : 0

              return (
                <motion.div key={group.id} className="habit-group" layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
                >
                  <div className="habit-group-header">
                    <button className="group-collapse-btn" onClick={() => toggleGroupCollapse(group.id)}>
                      <span className="group-icon">{group.icon}</span>
                      <span className="group-name">{group.name}</span>
                      <span className="group-count">{groupDone}/{groupTotal}</span>
                      <motion.span className="group-chevron"
                        animate={{ rotate: group.collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}
                      >▾</motion.span>
                    </button>
                    <div className="group-header-actions">
                      <button className="group-add-btn" onClick={() => openModal(group.id)}>+ Add</button>
                      <button className="delete-btn" onClick={() => deleteGroup(group.id)}>✕</button>
                    </div>
                  </div>

                  {groupTotal > 0 && (
                    <div className="group-progress-track">
                      <motion.div className="group-progress-fill"
                        style={{ background: group.color }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: groupPct / 100 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  )}

                  <AnimatePresence>
                    {!group.collapsed && (
                      <motion.div className="habit-children"
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      >
                        {group.children.length === 0 && (
                          <p className="children-empty">No habits yet — <button className="inline-link" onClick={() => openModal(group.id)}>add one</button></p>
                        )}

                        {group.children.map((habit) => {
                          const entry  = habit.entries[selectedDateKey] || { done: false, note: "", pushed: false, value: "" }
                          const streak = getStreak(habit, selectedDateKey, getDateKey)
                          const pct    = habit.goal && entry.value !== "" ? Math.min(Math.round((parseFloat(entry.value) / habit.goal) * 100), 999) : null
                          const accentColor = habit.color || group.color

                          return (
                            <motion.div key={habit.id}
                              className={`habit-row child-row ${entry.done ? "child-done" : ""}`}
                              layout
                              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}
                            >
                              <div className="child-accent" style={{ background: accentColor }} />

                              <div className="habit-check-area">
                                <button
                                  className={`check-circle ${entry.done ? "checked" : ""}`}
                                  style={entry.done ? { background: accentColor, borderColor: "transparent", boxShadow: `0 0 14px ${accentColor}66` } : {}}
                                  onClick={() => toggleDone(group.id, habit.id)}
                                >
                                  <AnimatePresence>
                                    {entry.done && (
                                      <motion.svg key="chk" viewBox="0 0 14 14" fill="none"
                                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                      >
                                        <polyline points="2,7 6,11 12,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </motion.svg>
                                    )}
                                  </AnimatePresence>
                                </button>
                              </div>

                              <div className="habit-main">
                                <div className="habit-head">
                                  <div className="habit-title-row">
                                    <span className="child-icon">{habit.icon}</span>
                                    <h4 className={entry.done ? "habit-done" : ""}>{habit.name}</h4>
                                    {habit.goal && (
                                      <span className="goal-badge" style={{ color: accentColor, borderColor: `${accentColor}44` }}>
                                        {habit.goal} {habit.unit}
                                      </span>
                                    )}
                                    {streak > 0 && <span className="streak-badge">🔥 {streak}d</span>}
                                  </div>
                                  <div className="habit-head-right">
                                    <button className="icon-action-btn" onClick={() => openEdit(group.id, habit)}>✎</button>
                                    <button className="delete-btn" onClick={() => deleteChild(group.id, habit.id)}>✕</button>
                                  </div>
                                </div>

                                {/* Value input — shown when done */}
                                <AnimatePresence>
                                  {entry.done && (
                                    <motion.div className="value-row"
                                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                                    >
                                      <div className="value-input-wrap">
                                        <input
                                          className="value-input"
                                          type="number" min="0" step="any"
                                          placeholder={`How much? ${habit.unit ? `(${habit.unit})` : ""}`}
                                          value={entry.value ?? ""}
                                          onChange={e => updateValue(group.id, habit.id, e.target.value, habit)}
                                          style={{ borderColor: `${accentColor}55` }}
                                        />
                                        {pct !== null && (
                                          <div className="value-pct-wrap">
                                            <div className="value-pct-track">
                                              <motion.div className="value-pct-fill"
                                                style={{ background: accentColor }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(pct, 100)}%` }}
                                                transition={{ duration: 0.4 }}
                                              />
                                            </div>
                                            <span className="value-pct-label" style={{ color: accentColor }}>
                                              {pct}% of limit
                                              {pct > 100 && <span className="pushed-auto-badge"> 🔥 Pushed!</span>}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <textarea className="habit-note-input" placeholder="Write a note..."
                                  value={entry.note} onChange={e => updateNote(group.id, habit.id, e.target.value)} />
                              </div>

                              <div className="habit-toggle-area">
                                <span className="toggle-label">Pushed the limit</span>
                                <button
                                  className={`push-toggle ${entry.pushed ? "toggle-on" : ""}`}
                                  style={entry.pushed ? { background: accentColor } : {}}
                                  onClick={() => togglePushed(group.id, habit.id)}
                                >
                                  <div className="toggle-knob" />
                                </button>
                              </div>
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Auth bar — bottom */}
        <div className="auth-bar-bottom">
          {authUser ? (
            <div className="auth-bar">
              <span>👤 {authUser.name || authUser.email}</span>
              <button className="auth-bar-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <div className="auth-bar auth-bar--guest">
              <span>Guest mode · <strong>{totalChildren}/{FREE_LIMIT}</strong> habits used</span>
              <button className="auth-bar-btn auth-bar-btn--accent" onClick={() => navigate("/signin")}>Sign in for unlimited habits →</button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Create Habit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div className="habit-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(false)}
          >
            <motion.div className="habit-modal"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <p className="card-label">New habit</p>
              <h3>Create a habit</h3>

              <div className="modal-field">
                <label className="modal-label">Group <span className="modal-label-optional">(optional)</span></label>
                <select className="habit-input habit-select" value={fGroupId ?? ""}
                  onChange={e => setFGroupId(e.target.value === "__new__" ? "__new__" : Number(e.target.value))}
                >
                  {groups.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
                  <option value="__new__">+ Create new group…</option>
                </select>
              </div>

              <GroupFields gid={fGroupId} gName={fGroupName} gIcon={fGroupIcon} gColor={fGroupColor}
                setGName={setFGroupName} setGIcon={setFGroupIcon} setGColor={setFGroupColor} />

              <div className="modal-field">
                <label className="modal-label">Habit name & icon</label>
                <div className="name-icon-row">
                  <EmojiPicker value={fIcon} onChange={setFIcon} />
                  <input className="habit-input" placeholder="e.g. Freelancing" value={fName}
                    onChange={e => setFName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveHabit()} />
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-label">Habit color</label>
                <ColorPicker value={fColor} onChange={setFColor} />
              </div>

              <div className="modal-field">
                <label className="modal-label">Daily limit & unit <span className="modal-label-optional">(optional)</span></label>
                <LimitSelector unit={fUnit} goal={fGoal} onUnitChange={setFUnit} onGoalChange={setFGoal} />
              </div>

              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setModal(false)}>Cancel</button>
                <button className="primary-btn" onClick={saveHabit}>Save Habit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Habit Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {editModal && (
          <motion.div className="habit-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditModal(null)}
          >
            <motion.div className="habit-modal"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              <p className="card-label">Edit habit</p>
              <h3>Update habit</h3>

              <div className="modal-field">
                <label className="modal-label">Group</label>
                <select className="habit-input habit-select" value={editGroupId ?? ""}
                  onChange={e => setEditGroupId(Number(e.target.value))}
                >
                  {groups.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Habit name & icon</label>
                <div className="name-icon-row">
                  <EmojiPicker value={editIcon} onChange={setEditIcon} />
                  <input className="habit-input" value={editName}
                    onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit()} />
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-label">Color</label>
                <ColorPicker value={editColor} onChange={setEditColor} />
              </div>

              <div className="modal-field">
                <label className="modal-label">Daily limit & unit</label>
                <LimitSelector unit={editUnit} goal={editGoal} onUnitChange={setEditUnit} onGoalChange={setEditGoal} />
              </div>

              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setEditModal(null)}>Cancel</button>
                <button className="primary-btn" onClick={saveEdit}>Save Changes</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
