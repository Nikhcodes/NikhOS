import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSubjects } from '../hooks/useSubjects'

const COLORS = [
  '#a855f7', '#ec4899', '#3b82f6', '#f59e0b',
  '#10b981', '#ef4444', '#06b6d4', '#f97316',
]

function generateId() {
  return Date.now().toString()
}

export default function SubjectsWidget() {
  const [subjects, setSubjects, loading] = useSubjects()
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newName, setNewName] = useState('')
  const [newGrade, setNewGrade] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])

  const handleAdd = () => {
    if (!newName.trim()) return
    const grade = Math.min(10, Math.max(0, parseFloat(newGrade) || 0))
    setSubjects([
      ...subjects,
      { id: generateId(), name: newName.trim(), grade, color: newColor },
    ])
    setNewName('')
    setNewGrade('')
    setNewColor(COLORS[0])
    setAdding(false)
  }

  const handleDelete = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const handleEdit = (subject) => {
    setEditingId(subject.id)
  }

  const handleSaveEdit = (id, name, grade, color) => {
    const clamped = Math.min(10, Math.max(0, parseFloat(grade) || 0))
    setSubjects(subjects.map((s) =>
      s.id === id ? { ...s, name, grade: clamped, color } : s
    ))
    setEditingId(null)
  }

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
            <span style={{ fontSize: '18px' }}>📚</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Subjects
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {subjects.length} total
            </p>
          </div>
        </div>

        {/* Add button */}
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
                placeholder="Subject name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <input
                type="number"
                placeholder="Grade (0–10)"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                min="0"
                max="10"
                step="0.1"
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              {/* Color picker */}
              <div className="flex gap-2 flex-wrap">
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
                Add Subject
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
      {/* Subject list */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {subjects.map((subject) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              isEditing={editingId === subject.id}
              onEdit={() => handleEdit(subject)}
              onDelete={() => handleDelete(subject.id)}
              onSave={(name, grade, color) =>
                handleSaveEdit(subject.id, name, grade, color)
              }
              onCancel={() => setEditingId(null)}
            />
          ))}
        </AnimatePresence>

        {subjects.length === 0 && (
          <p className="text-center py-4 text-sm"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            No subjects yet. Add one above.
          </p>
        )}
      </div>
    </motion.div>
  )
}

function SubjectRow({ subject, isEditing, onEdit, onDelete, onSave, onCancel }) {
  const [name, setName] = useState(subject.name)
  const [grade, setGrade] = useState(subject.grade)
  const [color, setColor] = useState(subject.color)

  const passing = Number(grade) >= 5.5

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${subject.color}22`,
      }}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}
          />
          <input
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            min="0" max="10" step="0.1"
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}
          />
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <motion.button
                key={c}
                onClick={() => setColor(c)}
                className="rounded-full"
                style={{
                  width: '20px', height: '20px',
                  background: c,
                  border: color === c ? '2px solid white' : '2px solid transparent',
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => onSave(name, grade, color)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#ffffff',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save
            </motion.button>
            <motion.button
              onClick={onCancel}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full"
              style={{
                width: '10px', height: '10px',
                background: subject.color,
                boxShadow: `0 0 8px ${subject.color}80`,
              }}
            />
            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {subject.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-bold"
              style={{ color: passing ? '#4ade80' : '#f87171' }}
            >
              {Number(subject.grade).toFixed(1)}
            </span>
            <motion.button
              onClick={onEdit}
              className="text-xs px-2.5 py-1 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.4)',
              }}
              whileHover={{ scale: 1.05, color: '#a855f7' }}
              whileTap={{ scale: 0.95 }}
            >
              ✎
            </motion.button>
            <motion.button
              onClick={onDelete}
              className="text-xs px-2.5 py-1 rounded-lg"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: 'rgba(239,68,68,0.6)',
              }}
              whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}