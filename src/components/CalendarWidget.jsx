import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS, DEFAULT_EVENTS } from '../utils/storage'

const EVENT_TYPES = {
  exam:         { label: 'Exam',         color: '#ef4444' },
  quiz:         { label: 'Quiz',         color: '#f59e0b' },
  presentation: { label: 'Presentation', color: '#3b82f6' },
  assignment:   { label: 'Assignment',   color: '#10b981' },
  other:        { label: 'Other',        color: '#a855f7' },
}

const COLORS = [
  '#a855f7', '#ec4899', '#3b82f6',
  '#f59e0b', '#10b981', '#ef4444',
]

function generateId() {
  return Date.now().toString()
}

function getDaysUntil(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24))
}

function DaysLabel({ days }) {
  if (days < 0)  return <span style={{ color: '#6b7280', fontSize: '11px' }}>Passed</span>
  if (days === 0) return <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>Today!</span>
  if (days === 1) return <span style={{ color: '#f97316', fontSize: '11px', fontWeight: 600 }}>Tomorrow</span>
  if (days <= 3)  return <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>{days}d away</span>
  if (days <= 7)  return <span style={{ color: '#f59e0b', fontSize: '11px' }}>{days}d away</span>
  return <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{days}d away</span>
}

export default function CalendarWidget() {
  const [events, setEvents] = useLocalStorage(STORAGE_KEYS.EVENTS, DEFAULT_EVENTS)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newType, setNewType] = useState('exam')
  const [newColor, setNewColor] = useState(COLORS[0])

  const handleAdd = () => {
    if (!newTitle.trim() || !newDate) return
    setEvents([
      ...events,
      {
        id: generateId(),
        title: newTitle.trim(),
        date: newDate,
        type: newType,
        color: newColor,
      },
    ])
    setNewTitle('')
    setNewDate('')
    setNewType('exam')
    setNewColor(COLORS[0])
    setAdding(false)
  }

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  // Sort by date, soonest first
  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  const upcoming = sorted.filter((e) => getDaysUntil(e.date) >= 0)
  const past     = sorted.filter((e) => getDaysUntil(e.date) < 0)

  return (
    <motion.div
      className="rounded-3xl p-6 flex flex-col gap-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
      whileHover={{
        borderColor: 'rgba(168,85,247,0.3)',
        boxShadow: '0 0 30px rgba(168,85,247,0.08)',
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-2xl flex items-center justify-center"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
              border: '1px solid rgba(168,85,247,0.3)',
            }}
          >
            <span style={{ fontSize: '18px' }}>📅</span>
          </div>
          <div>
            <p
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Upcoming Tests
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {upcoming.length} upcoming
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => setAdding(!adding)}
          className="px-4 py-2 rounded-2xl text-xs font-semibold"
          style={{
            background: adding
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
            border: adding
              ? '1px solid rgba(239,68,68,0.3)'
              : '1px solid rgba(168,85,247,0.3)',
            color: adding ? '#f87171' : '#a855f7',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {adding ? '✕ Cancel' : '+ Add'}
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <input
                type="text"
                placeholder="Event title (e.g. Math Exam)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />

              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  colorScheme: 'dark',
                }}
              />

              {/* Type selector */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(EVENT_TYPES).map(([key, val]) => (
                  <motion.button
                    key={key}
                    onClick={() => setNewType(key)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                    style={{
                      background: newType === key
                        ? `${val.color}25`
                        : 'rgba(255,255,255,0.03)',
                      border: newType === key
                        ? `1px solid ${val.color}50`
                        : '1px solid rgba(255,255,255,0.08)',
                      color: newType === key
                        ? val.color
                        : 'rgba(255,255,255,0.3)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {val.label}
                  </motion.button>
                ))}
              </div>

              {/* Color picker */}
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => setNewColor(color)}
                    className="rounded-full"
                    style={{
                      width: '24px',
                      height: '24px',
                      background: color,
                      border: newColor === color
                        ? '2px solid white'
                        : '2px solid transparent',
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={handleAdd}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  color: '#ffffff',
                }}
                whileHover={{ scale: 1.02, opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                Add Event
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming events */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {upcoming.map((event) => {
            const days = getDaysUntil(event.date)
            const isUrgent = days <= 3

            return (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-3.5 flex items-center gap-3"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: isUrgent
                    ? `1px solid ${event.color}40`
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isUrgent
                    ? `0 0 16px ${event.color}15`
                    : 'none',
                }}
              >
                {/* Color dot */}
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    width: '10px',
                    height: '10px',
                    background: event.color,
                    boxShadow: `0 0 8px ${event.color}80`,
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: 'rgba(255,255,255,0.85)' }}
                  >
                    {event.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: `${EVENT_TYPES[event.type]?.color}20`,
                        color: EVENT_TYPES[event.type]?.color,
                        border: `1px solid ${EVENT_TYPES[event.type]?.color}40`,
                      }}
                    >
                      {EVENT_TYPES[event.type]?.label}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                    <DaysLabel days={days} />
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <motion.button
                    onClick={() => handleDelete(event.id)}
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: 'rgba(239,68,68,0.5)',
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: 'rgba(239,68,68,0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✕
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {upcoming.length === 0 && (
          <p
            className="text-center py-4 text-sm"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            No upcoming events. You're all clear! 🎉
          </p>
        )}
      </div>

      {/* Past events — collapsed */}
      {past.length > 0 && (
        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            Past
          </p>
          {past.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl p-3 flex items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                opacity: 0.5,
              }}
            >
              <div
                className="rounded-full flex-shrink-0"
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                }}
              />
              <p
                className="text-sm flex-1 truncate"
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'line-through',
                }}
              >
                {event.title}
              </p>
              <motion.button
                onClick={() => handleDelete(event.id)}
                className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: 'rgba(239,68,68,0.4)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}