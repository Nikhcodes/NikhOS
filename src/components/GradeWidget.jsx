import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSubjects } from '../hooks/useSubjects'

function AnimatedNumber({ value, decimals = 1 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(parseFloat(v.toFixed(decimals))),
    })
    return () => controls.stop()
  }, [value, decimals])

  return <span>{display.toFixed(decimals)}</span>
}

export default function GradeWidget() {
  const [subjects] = useSubjects()

  const average =
    subjects.length > 0
      ? subjects.reduce((sum, s) => sum + Number(s.grade), 0) / subjects.length
      : 0

  const passing = average >= 5.5
  const percentage = (average / 10) * 100

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
      {/* Top row */}
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
            <span style={{ fontSize: '18px' }}>📊</span>
          </div>
          <div>
            <p
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Average Grade
            </p>
            <p
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Pass / Fail badge */}
        <motion.div
          key={passing ? 'pass' : 'fail'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase"
          style={{
            background: passing
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(239,68,68,0.15)',
            border: `1px solid ${passing ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
            color: passing ? '#4ade80' : '#f87171',
          }}
        >
          {passing ? '✓ Passing' : '✗ Failing'}
        </motion.div>
      </div>

      {/* Big grade number */}
      <div className="flex items-end gap-2">
        <span
          className="font-bold leading-none"
          style={{
            fontSize: '64px',
            background: passing
              ? 'linear-gradient(135deg, #ffffff, #a855f7, #ec4899)'
              : 'linear-gradient(135deg, #ffffff, #f87171)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <AnimatedNumber value={average} decimals={1} />
        </span>
        <span
          className="font-medium mb-3"
          style={{ fontSize: '22px', color: 'rgba(255,255,255,0.2)' }}
        >
          / 10
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: '6px',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: passing
                ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                : 'linear-gradient(90deg, #ef4444, #f97316)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>

        {/* Pass threshold marker label */}
        <div className="flex justify-between">
          <span
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            0
          </span>
          <span
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            Pass ≥ 5.5
          </span>
          <span
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            10
          </span>
        </div>
      </div>

      {/* Subject grade pills */}
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${subject.color}18`,
              border: `1px solid ${subject.color}40`,
              color: subject.color,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {subject.name}: {Number(subject.grade).toFixed(1)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}