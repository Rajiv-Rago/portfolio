import { forwardRef, useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const generatedId = useId()
    const inputId = props.id || generatedId
    const errorId = `${inputId}-error`

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-3 py-2 border border-border rounded-[--radius-md] bg-surface text-text text-sm outline-none transition-colors focus:border-accent ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
