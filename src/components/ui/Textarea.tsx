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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-medium text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-3.5 py-2.5 border border-border/80 rounded-[--radius-md] bg-surface text-text text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-sm focus:shadow-accent/10 resize-y min-h-[110px] placeholder:text-muted/50 ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
