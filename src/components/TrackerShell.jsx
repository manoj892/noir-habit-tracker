import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const defaultHabits = [
  {
    id: 1,
    name: "Morning walk",
    category: "Health",
    entries: {
      "2026-06-03": {
        done: true,
        note: "Today I felt energized.",
        pushed: false
      }
    }
  },
  {
    id: 2,
    name: "Reading",
    category: "Mind",
    entries: {
      "2026-06-03": {
        done: true,
        note: "Today I was calm and focused.",
        pushed: true
      }
    }
  },
  {
    id: 3,
    name: "Workout",
    category: "Fitness",
    entries: {
      "2026-06-03": {
        done: false,
        note: "Today I felt exhausted but still finished.",
        pushed: false
      }
    }
  }
]

function TrackerShell() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habitflow-habits")
    return saved ? JSON.parse(saved) : defaultHabits
  })

  const [newHabit, setNewHabit] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date("2026-06-03"))
  const [selectedDate, setSelectedDate] = useState(new Date("2026-06-03"))
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem("habitflow-habits", JSON.stringify(habits))
  }, [habits])

  const getStartOfWeek = (date) => {
    const copy = new Date(date)
    const day = copy.getDay()
    const diff = day === 0 ? -6 : 1 - day
    copy.setDate(copy.getDate() + diff)
    copy.setHours(0, 0, 0, 0)
    return copy
  }

  const getWeekDays = (date) => {
    const start = getStartOfWeek(date)
    const days = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }

    return days
  }

  const formatDayName = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" })

  const formatDayNumber = (date) =>
    date.toLocaleDateString("en-US", { day: "2-digit" })

  const formatWeekRange = (days) => {
    const first = days[0]
    const last = days[6]

    const firstText = first.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })

    const lastText = last.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })

    return `${firstText} – ${lastText}`
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const getDateKey = (date) => {
    return date.toLocaleDateString("en-CA")
  }

  const selectedDateKey = getDateKey(selectedDate)
  const weekDays = getWeekDays(currentDate)

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
    setSelectedDate(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
    setSelectedDate(newDate)
  }

  const addHabit = () => {
    if (newHabit.trim() === "") return

    const newHabitItem = {
      id: Date.now(),
      name: newHabit,
      category: newCategory || "General",
      entries: {}
    }

    setHabits((prev) => [...prev, newHabitItem])
    setNewHabit("")
    setNewCategory("")
    setIsModalOpen(false)
  }

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  const updateHabitEntry = (habitId, updater) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit

        const currentEntry = habit.entries[selectedDateKey] || {
          done: false,
          note: "",
          pushed: false
        }

        return {
          ...habit,
          entries: {
            ...habit.entries,
            [selectedDateKey]: updater(currentEntry)
          }
        }
      })
    )
  }

  const toggleDone = (habitId) => {
    updateHabitEntry(habitId, (entry) => ({
      ...entry,
      done: !entry.done
    }))
  }

  const togglePushed = (habitId) => {
    updateHabitEntry(habitId, (entry) => ({
      ...entry,
      pushed: !entry.pushed
    }))
  }

  const updateNote = (habitId, value) => {
    updateHabitEntry(habitId, (entry) => ({
      ...entry,
      note: value
    }))
  }

  const resetAllData = () => {
    const confirmed = window.confirm("Do you want to clear all habits and saved entries?")
    if (!confirmed) return

    setHabits(defaultHabits)
    localStorage.removeItem("habitflow-habits")
  }

  return (
    <section className="tracker-shell-section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8 }}
      >
        <p className="eyebrow">Tracker preview</p>
        <h2>A weekly calendar habit tracker with notes and intensity.</h2>
      </motion.div>

      <motion.div
        className="tracker-shell"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8 }}
      >
        <div className="tracker-topbar">
          <button className="week-arrow" onClick={goToPreviousWeek}>
            ←
          </button>

          <div className="tracker-week">
            <p className="card-label">Week view</p>
            <h3>{formatWeekRange(weekDays)}</h3>
          </div>

          <button className="week-arrow" onClick={goToNextWeek}>
            →
          </button>
        </div>

        <div className="week-strip">
          {weekDays.map((date, index) => (
            <motion.button
              key={date.toISOString()}
              className={`day-pill ${isSameDay(date, selectedDate) ? "active-day" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              onClick={() => setSelectedDate(date)}
            >
              <span>{formatDayName(date)}</span>
              <strong>{formatDayNumber(date)}</strong>
            </motion.button>
          ))}
        </div>

        <div className="tracker-toolbar">
          <div className="selected-date-line">
            <span>Selected day:</span>{" "}
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            })}
          </div>

          <div className="tracker-toolbar-actions">
            <button className="secondary-btn" onClick={() => setIsModalOpen(true)}>
              Create Habit
            </button>
            <button className="danger-btn" onClick={resetAllData}>
              Reset All
            </button>
          </div>
        </div>

        <div className="habit-list">
          <AnimatePresence>
            {habits.map((habit) => {
              const entry = habit.entries[selectedDateKey] || {
                done: false,
                note: "",
                pushed: false
              }

              return (
                <motion.div
                  key={habit.id}
                  className="habit-row"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="habit-check-area">
                    <button
                      className={`check-circle ${entry.done ? "checked" : ""}`}
                      onClick={() => toggleDone(habit.id)}
                    ></button>
                  </div>

                  <div className="habit-main">
                    <div className="habit-head">
                      <div>
                        <h4>{habit.name}</h4>
                        <p className="habit-category">{habit.category}</p>
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        Delete
                      </button>
                    </div>

                    <textarea
                      className="habit-note-input"
                      placeholder="Write a note for this habit..."
                      value={entry.note}
                      onChange={(e) => updateNote(habit.id, e.target.value)}
                    />
                  </div>

                  <div className="habit-toggle-area">
                    <span className="toggle-label">Pushed the limit</span>
                    <button
                      className={`push-toggle ${entry.pushed ? "toggle-on" : ""}`}
                      onClick={() => togglePushed(habit.id)}
                    >
                      <div className="toggle-knob"></div>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="habit-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="habit-modal"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="card-label">New habit</p>
              <h3>Create a habit</h3>

              <input
                type="text"
                className="habit-input"
                placeholder="Habit name"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
              />

              <input
                type="text"
                className="habit-input"
                placeholder="Category (Health, Mind, Work...)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={addHabit}>
                  Save Habit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default TrackerShell