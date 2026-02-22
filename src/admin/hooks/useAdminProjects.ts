import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../lib/types'
import toast from 'react-hot-toast'

export function useAdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('projects').insert(project)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Project added')
    await fetch()
  }

  const update = async (id: string, project: Partial<Project>) => {
    const { error } = await supabase.from('projects').update(project).eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Project updated')
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Project deleted')
    await fetch()
  }

  return { projects, loading, create, update, remove, refetch: fetch }
}
