import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { DEFAULT_SUBJECTS } from '../utils/storage'

const CACHE_KEY = 'nikhos_subjects'

export function useSubjects() {
  const [subjects, setSubjectsState] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : DEFAULT_SUBJECTS
    } catch {
      return DEFAULT_SUBJECTS
    }
  })
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id)
    })
  }, [])

  // Fetch from Supabase in background once we have userId
  useEffect(() => {
    if (!userId) return

    supabase
      .from('subjects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching subjects:', error)
          setLoading(false)
          return
        }
        if (data && data.length > 0) {
          const normalized = data.map((s) => ({
            id: s.id,
            name: s.name,
            grade: s.grade,
            color: s.color,
          }))
          setSubjectsState(normalized)
          localStorage.setItem(CACHE_KEY, JSON.stringify(normalized))
        }
        setLoading(false)
      })
  }, [userId])

  // Save to localStorage + Supabase
  const setSubjects = async (newSubjects) => {
    // Update state and cache instantly
    setSubjectsState(newSubjects)
    localStorage.setItem(CACHE_KEY, JSON.stringify(newSubjects))

    if (!userId) return

    // Sync to Supabase in background
    // Delete all existing subjects for this user then re-insert
    // This is the simplest approach for a personal dashboard
    const { error: deleteError } = await supabase
      .from('subjects')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting subjects:', deleteError)
      return
    }

    if (newSubjects.length === 0) return

    const rows = newSubjects.map((s) => ({
      id: s.id,
      user_id: userId,
      name: s.name,
      grade: Number(s.grade),
      color: s.color,
    }))

    const { error: insertError } = await supabase
      .from('subjects')
      .insert(rows)

    if (insertError) {
      console.error('Error inserting subjects:', insertError)
    }
  }

  return [subjects, setSubjects, loading]
}