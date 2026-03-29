import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAssignments } from '../hooks/useAssignments'

const PRIORITIES = {
  high:   { label: 'High',   color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.3)'   },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.3)'  },
  low:    { label: 'Low',    color: '#10b981', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.3)'  },
}

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

function DueDateLabel({ dateStr }) {
  const days = getDaysUntil(dateStr)
  let label = ''
  let color = 'rgba(255,255,255,0.3)'

  if (days < 0) {
    label = `${Math.abs(days)}d overdue`
    color = '#ef4444'
  } else if (days === 0) {
    label = 'Due today'
    color = '#f59e0b'
  } else if (days === 1) {
    label = 'Due tomorrow'
    color = '#f59e0b'
  } else {
    label = `${days}d left`
    color = 'rgba(255,255,255,0.3)'
  }

  return (
    <span className="text-xs font-medium" style={{ color }}>
      {label}
    </span>
  )
}

export default function AssignmentsWidget() {
  const [assignments, setAssignments, loading] = useAssignments()
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [filter, setFilter] = useState('all')

  const handleAdd = () => {
    if (!newTitle.trim() || !newDate) return
    setAssignments([
      ...assignments,
      {
        id: generateId(),
        title: newTitle.trim(),
        dueDate: newDate,
        priority: newPriority,
        completed: false,
      },
    ])
    setNewTitle('')
    setNewDate('')
    setNewPriority('medium')
    setAdding(false)
  }

  const handleToggle = (id) => {
    setAssignments(assignments.map((a) =>
      a.id === id ? { ...a, completed: !a.completed } : a
    ))
  }

  const handleDelete = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id))
  }

  const filtered = assignments.filter((a) => {
    if (filter === 'active')    return !a.completed
    if (filter === 'completed') return a.completed
    return true
  })

  const completedCount = assignments.filter((a) => a.completed).length
  const totalCount = assignments.length

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
            <span style={{ fontSize: '18px' }}>✅</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Assignments
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {completedCount}/{totalCount} completed
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

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            }}
            initial={{ width: '0%' }}
            animate={{
              width: totalCount > 0
                ? `${(completedCount / totalCount) * 100}%`
                : '0%',
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
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
                placeholder="Assignment title"
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

              {/* Priority selector */}
              <div className="flex gap-2">
                {Object.entries(PRIORITIES).map(([key, val]) => (
                  <motion.button
                    key={key}
                    onClick={() => setNewPriority(key)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold"
                    style={{
                      background: newPriority === key ? val.bg : 'rgba(255,255,255,0.03)',
                      border: newPriority === key
                        ? `1px solid ${val.border}`
                        : '1px solid rgba(255,255,255,0.08)',
                      color: newPriority === key ? val.color : 'rgba(255,255,255,0.3)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {val.label}
                  </motion.button>
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
                Add Assignment
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
          {loading && (
      <div className="flex items-center gap-2 py-1">
        <motion.div
          className="rounded-full"
          style={{ width: '6px', height: '6px', background: '#a855f7' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Syncing...
        </span>
      </div>
    )}
      {/* Filter tabs */}
      <div
        className="flex rounded-2xl p-1 gap-1"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        {['all', 'active', 'completed'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setFilter(tab)}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize"
            style={{
              background: filter === tab
                ? 'rgba(168,85,247,0.2)'
                : 'transparent',
              color: filter === tab
                ? '#a855f7'
                : 'rgba(255,255,255,0.3)',
              border: filter === tab
                ? '1px solid rgba(168,85,247,0.3)'
                : '1px solid transparent',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Assignment list */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filtered.map((assignment) => {
            const p = PRIORITIES[assignment.priority]
            const days = getDaysUntil(assignment.dueDate)
            const isUrgent = !assignment.completed && days <= 1

            return (
              <motion.div
                key={assignment.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-3.5 flex items-center gap-3"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: isUrgent
                    ? `1px solid ${p.border}`
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isUrgent
                    ? `0 0 20px ${p.color}20`
                    : 'none',
                }}
              >
                {/* Checkbox */}
                <motion.button
                  onClick={() => handleToggle(assignment.id)}
                  className="rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '22px',
                    height: '22px',
                    background: assignment.completed
                      ? 'linear-gradient(135deg, #a855f7, #ec4899)'
                      : 'rgba(255,255,255,0.05)',
                    border: assignment.completed
                      ? 'none'
                      : '2px solid rgba(255,255,255,0.15)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {assignment.completed && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ fontSize: '11px', color: '#fff' }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{
                      color: assignment.completed
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(255,255,255,0.85)',
                      textDecoration: assignment.completed ? 'line-through' : 'none',
                    }}
                  >
                    {assignment.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DueDateLabel dateStr={assignment.dueDate} />
                    <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: p.bg,
                        color: p.color,
                        border: `1px solid ${p.border}`,
                      }}
                    >
                      {p.label}
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <motion.button
                  onClick={() => handleDelete(assignment.id)}
                  className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    color: 'rgba(239,68,68,0.5)',
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center py-6 text-sm"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            {filter === 'completed' ? 'Nothing completed yet.' : 'All clear! No assignments.'}
          </p>
        )}
      </div>
    </motion.div>
  )
}