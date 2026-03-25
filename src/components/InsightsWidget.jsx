import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  STORAGE_KEYS,
  DEFAULT_SUBJECTS,
  DEFAULT_ASSIGNMENTS,
} from '../utils/storage'

function AnimatedNumber({ value, decimals = 0, suffix = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const step = 16
    const increment = (end - start) / (duration / step)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplay(end)
        clearInterval(timer)
      } else {
        setDisplay(parseFloat(start.toFixed(decimals)))
      }
    }, step)

    return () => clearInterval(timer)
  }, [value, decimals])

  return <span>{display.toFixed(decimals)}{suffix}</span>
}

function ScoreRing({ score, color, size = 80 }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="6"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span
        className="relative font-bold"
        style={{ fontSize: '16px', color: '#ffffff' }}
      >
        {Math.round(score)}
      </span>
    </div>
  )
}

function StatBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.45)' }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color }}>
          {value.toFixed(1)} / {max}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '4px', background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

export default function InsightsWidget() {
  const [subjects]    = useLocalStorage(STORAGE_KEYS.SUBJECTS,    DEFAULT_SUBJECTS)
  const [assignments] = useLocalStorage(STORAGE_KEYS.ASSIGNMENTS, DEFAULT_ASSIGNMENTS)

  // --- Calculations ---
  const totalAssignments = assignments.length
  const completedAssignments = assignments.filter((a) => a.completed).length
  const completionRate = totalAssignments > 0
    ? (completedAssignments / totalAssignments) * 100
    : 0

  const avgGrade = subjects.length > 0
    ? subjects.reduce((sum, s) => sum + Number(s.grade), 0) / subjects.length
    : 0

  const passingSubjects = subjects.filter((s) => Number(s.grade) >= 5.5).length
  const gradeScore = (avgGrade / 10) * 100

  const overdueCount = assignments.filter((a) => {
    if (a.completed) return false
    const due = new Date(a.dueDate)
    due.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return due < today
  }).length

  const overduepenalty = Math.min(30, overdueCount * 10)

  // Productivity score: weighted mix
  const productivityScore = Math.max(
    0,
    Math.min(
      100,
      completionRate * 0.4 +
      gradeScore     * 0.4 +
      20             * 1.0 -
      overduepenalty
    )
  )

  const getScoreLabel = (score) => {
    if (score >= 85) return { label: 'Excellent', color: '#10b981' }
    if (score >= 70) return { label: 'Great',     color: '#a855f7' }
    if (score >= 55) return { label: 'Good',      color: '#3b82f6' }
    if (score >= 40) return { label: 'Fair',      color: '#f59e0b' }
    return               { label: 'Needs Work',  color: '#ef4444' }
  }

  const scoreInfo = getScoreLabel(productivityScore)

  const highestSubject = subjects.length > 0
    ? subjects.reduce((a, b) => Number(a.grade) > Number(b.grade) ? a : b)
    : null

  const lowestSubject = subjects.length > 0
    ? subjects.reduce((a, b) => Number(a.grade) < Number(b.grade) ? a : b)
    : null

  return (
    <motion.div
      className="rounded-3xl p-6 flex flex-col gap-6"
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
            <span style={{ fontSize: '18px' }}>🧠</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}>
              Insights
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Productivity overview
            </p>
          </div>
        </div>

        {/* Score badge */}
        <motion.div
          className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider"
          style={{
            background: `${scoreInfo.color}20`,
            border: `1px solid ${scoreInfo.color}40`,
            color: scoreInfo.color,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
        >
          {scoreInfo.label}
        </motion.div>
      </div>

      {/* Main score + rings row */}
      <div
        className="rounded-2xl p-4 flex items-center gap-6"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Big productivity ring */}
        <div className="flex flex-col items-center gap-2">
          <ScoreRing
            score={productivityScore}
            color={scoreInfo.color}
            size={90}
          />
          <span className="text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.3)' }}>
            Productivity
          </span>
        </div>

        {/* Divider */}
        <div style={{
          width: '1px', alignSelf: 'stretch',
          background: 'rgba(255,255,255,0.06)',
        }} />

        {/* Mini rings */}
        <div className="flex flex-1 justify-around">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing
              score={completionRate}
              color="#a855f7"
              size={60}
            />
            <span className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Tasks
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreRing
              score={gradeScore}
              color="#ec4899"
              size={60}
            />
            <span className="text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              Grades
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: 'rgba(255,255,255,0.25)' }}>
          Breakdown
        </p>
        <StatBar
          label="Assignment Completion"
          value={completedAssignments}
          max={totalAssignments || 1}
          color="#a855f7"
        />
        <StatBar
          label="Average Grade"
          value={avgGrade}
          max={10}
          color="#ec4899"
        />
        <StatBar
          label="Subjects Passing"
          value={passingSubjects}
          max={subjects.length || 1}
          color="#10b981"
        />
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-3">
        {/* Best subject */}
        {highestSubject && (
          <div
            className="rounded-2xl p-3 flex flex-col gap-1"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              🏆 Best Subject
            </span>
            <span className="text-sm font-semibold truncate"
              style={{ color: '#4ade80' }}>
              {highestSubject.name}
            </span>
            <span className="text-xs font-bold" style={{ color: '#4ade80' }}>
              {Number(highestSubject.grade).toFixed(1)} / 10
            </span>
          </div>
        )}

        {/* Weakest subject */}
        {lowestSubject && lowestSubject.id !== highestSubject?.id && (
          <div
            className="rounded-2xl p-3 flex flex-col gap-1"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              📈 Focus On
            </span>
            <span className="text-sm font-semibold truncate"
              style={{ color: '#f87171' }}>
              {lowestSubject.name}
            </span>
            <span className="text-xs font-bold" style={{ color: '#f87171' }}>
              {Number(lowestSubject.grade).toFixed(1)} / 10
            </span>
          </div>
        )}

        {/* Overdue warning */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: overdueCount > 0
              ? 'rgba(239,68,68,0.08)'
              : 'rgba(16,185,129,0.08)',
            border: overdueCount > 0
              ? '1px solid rgba(239,68,68,0.2)'
              : '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {overdueCount > 0 ? '⚠️ Overdue' : '✅ On Track'}
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: overdueCount > 0 ? '#f87171' : '#4ade80' }}
          >
            {overdueCount > 0
              ? `${overdueCount} task${overdueCount !== 1 ? 's' : ''}`
              : 'No overdue!'}
          </span>
        </div>

        {/* Completion stat */}
        <div
          className="rounded-2xl p-3 flex flex-col gap-1"
          style={{
            background: 'rgba(168,85,247,0.08)',
            border: '1px solid rgba(168,85,247,0.2)',
          }}
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            📊 Completed
          </span>
          <span className="text-sm font-semibold" style={{ color: '#a855f7' }}>
            <AnimatedNumber value={completionRate} decimals={0} suffix="%" />
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            of all tasks
          </span>
        </div>
      </div>
    </motion.div>
  )
}