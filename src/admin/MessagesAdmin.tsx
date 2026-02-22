import { useState } from 'react'
import { format } from 'date-fns'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { useAdminMessages } from './hooks/useAdminMessages'
import type { ContactMessage } from '../lib/types'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import MessageDetail from './MessageDetail'

export default function MessagesAdmin() {
  const { messages, loading, markAsRead, remove } = useAdminMessages()
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState<ContactMessage | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSelect = async (msg: ContactMessage) => {
    if (!msg.is_read) await markAsRead(msg.id)
    setSelected({ ...msg, is_read: true })
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    await remove(deleting.id)
    setDeleteLoading(false)
    setDeleting(null)
    if (selected?.id === deleting.id) setSelected(null)
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (selected) {
    return (
      <MessageDetail
        message={selected}
        onBack={() => setSelected(null)}
        onDelete={() => setDeleting(selected)}
      />
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6">Messages</h1>

      <div className="bg-surface border border-border rounded-[--radius-lg] overflow-hidden">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-gray-50 ${
              !msg.is_read ? 'bg-accent-light/30' : ''
            }`}
            onClick={() => handleSelect(msg)}
          >
            {msg.is_read
              ? <MailOpen className="w-4 h-4 text-muted shrink-0" />
              : <Mail className="w-4 h-4 text-accent shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`text-sm truncate ${!msg.is_read ? 'font-semibold' : 'font-medium'}`}>
                  {msg.sender_name}
                </span>
                <span className="text-xs text-muted">{msg.sender_email}</span>
              </div>
              <div className="text-sm text-muted truncate">{msg.subject}</div>
            </div>
            <span className="text-xs text-muted shrink-0 max-md:hidden">
              {format(new Date(msg.created_at), 'MMM d')}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setDeleting(msg) }}
              className="text-muted hover:text-danger p-1 shrink-0"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="px-4 py-8 text-center text-muted">No messages yet</div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete message from ${deleting?.sender_name}?`}
        message="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
