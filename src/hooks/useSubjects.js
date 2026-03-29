import { useState, useEffect, useRef } from 'react'
import { supabase } from '../utils/supabase'
import { DEFAULT_SUBJECTS } from '../utils/storage'

const CACHE_KEY = 'nikhos_subjects'

export function useSubjects(userId) {
  const [subjects, setSubjectsState] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      return cached ? JSON.parse(cached) : DEFAULT_SUBJECTS
    } catch {
      return DEFAULT_SUBJECTS
    }
  })
  const [loading, setLoading] = useState(true)
  const userIdRef = useRef(userId)

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

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

  const setSubjects = async (newSubjects) => {
    const currentUserId = userIdRef.current
    console.log('saving subjects with userId:', currentUserId)

    setSubjectsState(newSubjects)
    localStorage.setItem(CACHE_KEY, JSON.stringify(newSubjects))

    if (!currentUserId) {
      console.warn('No userId — skipping Supabase sync')
      return
    }

    const { error: deleteError } = await supabase
      .from('subjects')
      .delete()
      .eq('user_id', currentUserId)

    if (deleteError) {
      console.error('Delete error:', deleteError.message)
      return
    }

    if (newSubjects.length === 0) return

    const rows = newSubjects.map((s) => ({
      id: s.id,
      user_id: currentUserId,
      name: s.name,
      grade: Number(s.grade),
      color: s.color,
    }))

    const { data, error: insertError } = await supabase
      .from('subjects')
      .insert(rows)
      .select()

    if (insertError) {
      console.error('Insert error:', insertError.message, insertError.details)
    } else {
      console.log('Insert success:', data)
    }
  }

  return [subjects, setSubjects, loading]
}