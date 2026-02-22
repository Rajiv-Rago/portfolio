import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { ContactMessage } from '../../lib/types'
import toast from 'react-hot-toast'

export function useAdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const markAsRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id)
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Message deleted')
    await fetch()
  }

  return { messages, loading, markAsRead, remove, refetch: fetch }
}
