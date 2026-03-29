import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim()) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (!error) setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#000000' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-10 flex flex-col items-center gap-4 text-center"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            maxWidth: '400px',
            width: '90%',
          }}
        >
          <span style={{ fontSize: '48px' }}>📬</span>
          <h2 className="text-xl font-bold text-white">Check your email</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            We sent a magic link to <strong style={{ color: '#a855f7' }}>{email}</strong>.
            Click it to sign in to NikhOS.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#000000' }}>

      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 10% 0%, rgba(168,85,247,0.10) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 90%, rgba(236,72,153,0.07) 0%, transparent 60%)
        `
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-10 flex flex-col gap-6"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span style={{ fontSize: '48px' }}>🎓</span>
          <h1
            className="text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #ffffff, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NikhOS
          </h1>
          <p className="text-sm text-center"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Your personal student dashboard
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}
          />
          <motion.button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: '#ffffff',
              opacity: loading ? 0.7 : 1,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {loading ? 'Sending...' : '✉️ Send Magic Link'}
          </motion.button>
        </div>

        <p className="text-xs text-center"
          style={{ color: 'rgba(255,255,255,0.2)' }}>
          No password needed. We'll email you a sign-in link.
        </p>
      </motion.div>
    </div>
  )
}