import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export function useFileUpload(bucket: string) {
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File, path?: string): Promise<string | null> => {
    setUploading(true)
    const filePath = path || `${Date.now()}-${file.name}`

    const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true })

    if (error) {
      toast.error('Upload failed. Please try again.')
      setUploading(false)
      return null
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    setUploading(false)
    return data.publicUrl
  }

  const remove = async (filePath: string) => {
    await supabase.storage.from(bucket).remove([filePath])
  }

  return { upload, remove, uploading }
}
