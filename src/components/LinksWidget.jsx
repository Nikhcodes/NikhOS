import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS, DEFAULT_LINKS } from '../utils/storage'

function generateId() {
  return Date.now().toString()
}

const EMOJI_OPTIONS = [
  '📓', '📁', '☁️', '🔗', '📌', '🌐',
  '📊', '📝', '🎯', '💡', '🚀', '🎓',
]

export default function LinksWidget() {
  const [links, setLinks] = useLocalStorage(STORAGE_KEYS.LINKS, DEFAULT_LINKS)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newIcon, setNewIcon] = useState('🔗')

  const handleAdd = () => {
    if (!newLabel.trim() || !newUrl.trim()) return
    let url = newUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    setLinks([
      ...links,
      { id: generateId(), label: newLabel.trim(), url, icon: newIcon },
    ])
    setNewLabel('')
    setNewUrl('')
    setNewIcon('🔗')
    setAdding(false)
  }

  const handleDelete = (id) => {
    setLinks(links.filter((l) => l.id !== id))
  }

  const handleOpen = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
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
            <span style={{ fontSize: '18px' }}>🔗</span>
          </div>
          <div>
            <p
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              Quick Links
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {links.length} saved
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
              {/* Emoji picker */}
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    onClick={() => setNewIcon(emoji)}
                    className="rounded-xl flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      fontSize: '18px',
                      background: newIcon === emoji
                        ? 'rgba(168,85,247,0.2)'
                        : 'rgba(255,255,255,0.03)',
                      border: newIcon === emoji
                        ? '1px solid rgba(168,85,247,0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Label (e.g. Notion)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <input
                type="text"
                placeholder="URL (e.g. notion.so)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />

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
                Save Link
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links grid */}
      <motion.div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
      >
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative group"
            >
              {/* Link card */}
              <motion.button
                onClick={() => handleOpen(link.url)}
                className="w-full rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                whileHover={{
                  scale: 1.05,
                  background: 'rgba(168,85,247,0.1)',
                  borderColor: 'rgba(168,85,247,0.3)',
                  boxShadow: '0 0 20px rgba(168,85,247,0.15)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span style={{ fontSize: '26px' }}>{link.icon}</span>
                <span
                  className="text-xs font-semibold truncate w-full"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {link.label}
                </span>
              </motion.button>

              {/* Delete button — appears on hover */}
              <motion.button
                onClick={() => handleDelete(link.id)}
                className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center"
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba(239,68,68,0.8)',
                  color: '#fff',
                  fontSize: '10px',
                  opacity: 0,
                }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                animate={{ opacity: 0 }}
                whileFocus={{ opacity: 1 }}
              >
                ✕
              </motion.button>

              {/* CSS hover trick for delete button */}
              <style>{`
                .group:hover button:last-child {
                  opacity: 1 !important;
                }
              `}</style>
            </motion.div>
          ))}
        </AnimatePresence>

        {links.length === 0 && (
          <p
            className="col-span-full text-center py-6 text-sm"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            No links yet. Add your first one above.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}