import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl px-8 py-5 flex items-center justify-between"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Left — Branding */}
      <div className="flex flex-col gap-1">
        <motion.h1
          className="font-bold tracking-tight"
          style={{
            fontSize: '28px',
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          NikhOS
        </motion.h1>
        <motion.p
          className="text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Your personal student dashboard
        </motion.p>
      </div>

      {/* Center — Live Clock */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <span
          className="font-bold tracking-widest"
          style={{
            fontSize: '26px',
            fontVariantNumeric: 'tabular-nums',
            background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {formatTime(time)}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {formatDate(time)}
        </span>
      </motion.div>

      {/* Right — UNASAT Logo Placeholder */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
            border: '1px solid rgba(168,85,247,0.3)',
          }}
        >
          <span style={{ fontSize: '22px' }}>🎓</span>
        </div>
        <span
          className="text-xs font-semibold tracking-wider"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          UNASAT
        </span>
      </motion.div>

    </motion.header>
  )
}