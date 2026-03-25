import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MODES = {
  work:       { label: 'Focus',       duration: 25 * 60, color: '#a855f7' },
  shortBreak: { label: 'Short Break', duration: 5  * 60, color: '#10b981' },
  longBreak:  { label: 'Long Break',  duration: 15 * 60, color: '#3b82f6' },
}

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function StudyTimer() {
  const [mode, setMode] = useState('work')
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef(null)

  const totalDuration = MODES[mode].duration
  const progress = timeLeft / totalDuration
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)
  const currentColor = MODES[mode].color

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (mode === 'work') setSessions((s) => s + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setTimeLeft(MODES[newMode].duration)
    setRunning(false)
  }

  const handleReset = () => {
    setTimeLeft(MODES[mode].duration)
    setRunning(false)
  }

  const handleStartPause = () => {
    setRunning((r) => !r)
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
            <span style={{ fontSize: '18px' }}>⏱️</span>
          </div>
          <div>
            <p
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Study Timer
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {sessions} session{sessions !== 1 ? 's' : ''} completed
            </p>
          </div>
        </div>

        {/* Session dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{
                width: '8px',
                height: '8px',
                background: i < sessions % 4
                  ? currentColor
                  : 'rgba(255,255,255,0.1)',
                boxShadow: i < sessions % 4
                  ? `0 0 6px ${currentColor}` : 'none',
              }}
              animate={{ scale: i < sessions % 4 ? 1 : 0.8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div
        className="flex rounded-2xl p-1 gap-1"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        {Object.entries(MODES).map(([key, val]) => (
          <motion.button
            key={key}
            onClick={() => handleModeChange(key)}
            className="flex-1 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: mode === key
                ? `${val.color}25`
                : 'transparent',
              color: mode === key
                ? val.color
                : 'rgba(255,255,255,0.3)',
              border: mode === key
                ? `1px solid ${val.color}50`
                : '1px solid transparent',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {val.label}
          </motion.button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center"
          style={{ width: '160px', height: '160px' }}
        >
          {/* Glow behind circle */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '130px',
              height: '130px',
              background: `radial-gradient(circle, ${currentColor}15, transparent 70%)`,
            }}
            animate={{
              opacity: running ? [0.5, 1, 0.5] : 0.4,
              scale: running ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: running ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />

          {/* SVG Ring */}
          <svg
            width="160"
            height="160"
            style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
          >
            {/* Track */}
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress */}
            <motion.circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={currentColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                filter: `drop-shadow(0 0 6px ${currentColor})`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="relative flex flex-col items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={timeLeft}
                className="font-bold tabular-nums"
                style={{
                  fontSize: '32px',
                  color: '#ffffff',
                  fontVariantNumeric: 'tabular-nums',
                }}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {formatTime(timeLeft)}
              </motion.span>
            </AnimatePresence>
            <span
              className="text-xs font-medium"
              style={{ color: currentColor }}
            >
              {MODES[mode].label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Reset */}
          <motion.button
            onClick={handleReset}
            className="rounded-2xl flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '16px',
            }}
            whileHover={{
              scale: 1.1,
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ↺
          </motion.button>

          {/* Start / Pause */}
          <motion.button
            onClick={handleStartPause}
            className="rounded-2xl flex items-center justify-center font-semibold text-sm"
            style={{
              width: '120px',
              height: '48px',
              background: running
                ? 'rgba(255,255,255,0.08)'
                : `linear-gradient(135deg, ${currentColor}, #ec4899)`,
              border: running
                ? '1px solid rgba(255,255,255,0.15)'
                : 'none',
              color: '#ffffff',
              boxShadow: running
                ? 'none'
                : `0 0 20px ${currentColor}40`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={running ? 'pause' : 'start'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {running ? '⏸ Pause' : timeLeft === 0 ? '↺ Restart' : '▶ Start'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Skip */}
          <motion.button
            onClick={() => handleModeChange(mode)}
            className="rounded-2xl flex items-center justify-center"
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '16px',
            }}
            whileHover={{
              scale: 1.1,
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            ⏭
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}