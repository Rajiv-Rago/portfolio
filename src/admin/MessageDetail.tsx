import { format } from 'date-fns'
import { ArrowLeft, Trash2 } from 'lucide-react'
import type { ContactMessage } from '../lib/types'
import Button from '../components/ui/Button'

interface MessageDetailProps {
  message: ContactMessage
  onBack: () => void
  onDelete: () => void
}

export default function MessageDetail({ message, onBack, onDelete }: MessageDetailProps) {
  return (
    <div className="max-w-2xl">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-accent font-medium hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to messages
      </button>

      <div className="bg-surface border border-border rounded-[--radius-lg] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-normal">{message.subject}</h2>
            <p className="text-sm text-muted mt-1">
              From <span className="font-medium text-text">{message.sender_name}</span> ({message.sender_email})
            </p>
            <p className="text-xs text-muted mt-1">
              {format(new Date(message.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
            </p>
          </div>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>

        <div className="border-t border-border pt-4 mt-4 whitespace-pre-wrap text-sm leading-relaxed">
          {message.body}
        </div>

        <div className="mt-6">
          <a
            href={`mailto:${message.sender_email}?subject=Re: ${message.subject}`}
            className="text-sm text-accent font-medium hover:underline"
          >
            Reply to {message.sender_name} &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}
