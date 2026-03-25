import { motion } from 'framer-motion'
import Header from './components/Header'
import GradeWidget from './components/GradeWidget'
import SubjectsWidget from './components/SubjectsWidget'
import AssignmentsWidget from './components/AssignmentsWidget'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function App() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#000000' }}>

      {/* Subtle ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 40% at 20% 10%, rgba(168,85,247,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(236,72,153,0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <Header />

        {/* Dashboard Grid */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Widgets will go here one by one */}
          <GradeWidget />
          <SubjectsWidget/>
          <AssignmentsWidget/>
          <PlaceholderCard label="Calendar Widget" />
          <PlaceholderCard label="Links Widget" />
          <PlaceholderCard label="Study Timer" />
          <PlaceholderCard label="Insights Widget" />
        </motion.div>

      </div>
    </div>
  )
}

// Temporary placeholder so we can see the grid
function PlaceholderCard({ label }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-3xl p-6 flex items-center justify-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        minHeight: '180px',
      }}
    >
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>
        {label}
      </span>
    </motion.div>
  )
}