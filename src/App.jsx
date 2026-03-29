import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './utils/supabase'
import Auth from './components/Auth'
import Header from './components/Header'
import GradeWidget from './components/GradeWidget'
import SubjectsWidget from './components/SubjectsWidget'
import AssignmentsWidget from './components/AssignmentsWidget'
import CalendarWidget from './components/CalendarWidget'
import LinksWidget from './components/LinksWidget'
import StudyTimer from './components/StudyTimer'
import InsightsWidget from './components/InsightsWidget'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const NAV_ITEMS = [
  { label: '📊 Grades',      href: '#grades'      },
  { label: '📚 Subjects',    href: '#subjects'     },
  { label: '✅ Assignments', href: '#assignments'  },
  { label: '📅 Calendar',    href: '#calendar'     },
  { label: '🔗 Links',       href: '#links'        },
  { label: '⏱️ Timer',       href: '#timer'        },
  { label: '🧠 Insights',    href: '#insights'     },
]

function HamburgerMenu({ onSignOut }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed top-5 right-5 z-50 flex flex-col justify-center items-center gap-1.5 rounded-2xl lg:hidden"
        style={{
          width: '44px',
          height: '44px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="block rounded-full"
          style={{ width: '18px', height: '2px', background: '#ffffff' }}
          animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block rounded-full"
          style={{ width: '18px', height: '2px', background: '#ffffff' }}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="block rounded-full"
          style={{ width: '18px', height: '2px', background: '#ffffff' }}
          animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full z-40 lg:hidden flex flex-col gap-3 py-20 px-6"
              style={{
                width: '260px',
                background: 'rgba(10,10,10,0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(30px)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                Navigate
              </p>

              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl text-sm font-medium"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    textDecoration: 'none',
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    background: 'rgba(168,85,247,0.15)',
                    borderColor: 'rgba(168,85,247,0.3)',
                    color: '#ffffff',
                    x: -4,
                  }}
                >
                  {item.label}
                </motion.a>
              ))}

              <div className="mt-auto flex flex-col gap-3">
                {/* Sign out button */}
                <motion.button
                  onClick={() => {
                    onSignOut()
                    setOpen(false)
                  }}
                  className="w-full px-4 py-3 rounded-2xl text-sm font-medium text-left"
                  style={{
                    color: '#f87171',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                  whileHover={{
                    background: 'rgba(239,68,68,0.15)',
                    x: -4,
                  }}
                >
                  🚪 Sign Out
                </motion.button>

                <p className="text-xs text-center"
                  style={{ color: 'rgba(255,255,255,0.15)' }}>
                  NikhOS · Student Dashboard
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Widget({ children, id }) {
  return (
    <motion.div id={id} variants={itemVariants} style={{ minWidth: 0 }}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
console.log('session:', session, 'loading:', authLoading)
  useEffect(() => {
   
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    // Listen for auth changes (magic link click, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setAuthLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  // Loading state
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#000000' }}
      >
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}
        >
          Loading NikhOS...
        </motion.div>
      </div>
    )
  }

  // Not signed in — show auth screen
  if (!session) return <Auth />

  // Signed in — show dashboard
  return (
    <div className="min-h-screen w-full" style={{ background: '#000000' }}>

      {/* Ambient glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% 0%,  rgba(168,85,247,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 90%, rgba(236,72,153,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Mobile hamburger — passes sign out down */}
      <HamburgerMenu onSignOut={handleSignOut} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <Header session={session} onSignOut={handleSignOut} />

        <motion.div
          className="mt-6 sm:mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── MOBILE & TABLET ── */}
          <div className="flex flex-col gap-6 lg:hidden">
            <Widget id="grades">      <GradeWidget />       </Widget>
            <Widget id="assignments"> <AssignmentsWidget /> </Widget>
            <Widget id="timer">       <StudyTimer />        </Widget>
            <Widget id="subjects">    <SubjectsWidget />    </Widget>
            <Widget id="calendar">    <CalendarWidget />    </Widget>
            <Widget id="links">       <LinksWidget />       </Widget>
            <Widget id="insights">    <InsightsWidget />    </Widget>
          </div>

          {/* ── DESKTOP ── */}
          <div className="hidden lg:flex lg:flex-col gap-6">
            <div className="grid gap-6"
              style={{ gridTemplateColumns: '1fr 1.6fr 1fr' }}>
              <Widget id="grades">      <GradeWidget />       </Widget>
              <Widget id="assignments"> <AssignmentsWidget /> </Widget>
              <Widget id="timer">       <StudyTimer />        </Widget>
            </div>

            <div className="grid gap-6"
              style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
              <Widget id="subjects"> <SubjectsWidget /> </Widget>
              <Widget id="calendar"> <CalendarWidget /> </Widget>
              <Widget id="links">    <LinksWidget />    </Widget>
            </div>

            <div className="grid gap-6"
              style={{ gridTemplateColumns: '1fr' }}>
              <Widget id="insights"> <InsightsWidget /> </Widget>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-10 pb-8 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '13px' }}>
            NikhOS — Built for focus. Designed for excellence.
          </span>
        </motion.div>

      </div>
    </div>
  )
}