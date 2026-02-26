import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const generatedId = useId()
    const textareaId = props.id || generatedId
    const errorId = `${textareaId}-error`

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-3 py-2 border border-border rounded-[--radius-md] bg-surface text-text text-sm outline-none transition-colors focus:border-accent resize-y min-h-[110px] ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
