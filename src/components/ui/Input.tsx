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
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-muted uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-3.5 py-2.5 border border-border/80 rounded-[--radius-md] bg-surface text-text text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-sm focus:shadow-accent/10 placeholder:text-muted/50 ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
