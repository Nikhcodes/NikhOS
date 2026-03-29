import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Header({ session, onSignOut }) {
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

  const formatDateShort = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="rounded-3xl px-5 sm:px-8 py-4 sm:py-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── MOBILE layout ── */}
      <div className="flex items-center justify-between sm:hidden">
        <div className="flex flex-col gap-0.5">
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: '22px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NikhOS
          </h1>
          {session?.user?.email && (
            <p className="text-xs truncate" style={{
              color: 'rgba(255,255,255,0.25)',
              maxWidth: '140px',
            }}>
              {session.user.email}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span
            className="font-bold tabular-nums"
            style={{
              fontSize: '18px',
              background: 'linear-gradient(135deg, #ffffff, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {formatTime(time)}
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {formatDateShort(time)}
          </span>
        </div>
      </div>

      {/* ── TABLET + DESKTOP layout ── */}
      <div className="hidden sm:flex items-center justify-between gap-4">

        {/* Left — Branding + user email */}
        <motion.div
          className="flex flex-col gap-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: '28px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NikhOS
          </h1>
          {session?.user?.email ? (
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {session.user.email}
            </p>
          ) : (
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Your personal student dashboard
            </p>
          )}
        </motion.div>

        {/* Center — Live clock */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span
            className="font-bold tracking-widest tabular-nums"
            style={{
              fontSize: '26px',
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {formatTime(time)}
          </span>
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {formatDate(time)}
          </span>
        </motion.div>

        {/* Right — UNASAT logo + sign out */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Sign out button */}
          {onSignOut && (
            <motion.button
              onClick={onSignOut}
              className="px-3 py-2 rounded-2xl text-xs font-semibold"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
              whileHover={{
                scale: 1.05,
                background: 'rgba(239,68,68,0.15)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              🚪 Sign Out
            </motion.button>
          )}

          {/* UNASAT logo */}
          <motion.div
            className="flex flex-col items-center gap-1"
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
              <img
                src="/UnasatLogo.png"
                alt="UNASAT"
                className="w-8 h-8 object.contain"
              />
            </div>
            <span
              className="text-xs font-semibold tracking-wider"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              UNASAT
            </span>
          </motion.div>
        </motion.div>

      </div>
    </motion.header>
  )
}