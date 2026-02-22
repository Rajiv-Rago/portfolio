import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Experience } from '../lib/types'

export function useExperience() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false })
      .then(({ data }) => {
        setExperience(data ?? [])
        setLoading(false)
      })
  }, [])

  return { experience, loading }
}
