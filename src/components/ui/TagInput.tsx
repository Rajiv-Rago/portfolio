import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  error?: string
  placeholder?: string
}

export default function TagInput({ label, value, onChange, error, placeholder = 'Type and press Enter' }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className={`flex flex-wrap gap-1.5 p-2 border rounded-[--radius-md] bg-surface ${error ? 'border-danger' : 'border-border'} focus-within:border-accent transition-colors`}>
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-accent-light text-accent rounded-[--radius-sm]"
          >
            {tag}
            <button type="button" onClick={() => removeTag(i)} className="hover:text-accent-dark">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[100px] text-sm outline-none bg-transparent"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
