import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Experience } from '../../lib/types'
import toast from 'react-hot-toast'

export function useAdminExperience() {
  const [experience, setExperience] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false })
    setExperience(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (exp: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('experience').insert(exp)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Experience added')
    await fetch()
  }

  const update = async (id: string, exp: Partial<Experience>) => {
    const { error } = await supabase.from('experience').update(exp).eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Experience updated')
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Experience deleted')
    await fetch()
  }

  return { experience, loading, create, update, remove, refetch: fetch }
}
