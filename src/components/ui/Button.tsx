import { forwardRef, type ButtonHTMLAttributes } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, children, disabled, className = '', ...props }, ref) => {
    const base = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-[--radius-md] font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

    const variants: Record<string, string> = {
      primary: 'bg-accent text-bg hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20',
      secondary: 'bg-surface text-text border border-border/80 hover:border-accent/40 hover:shadow-sm',
      danger: 'bg-danger text-white hover:bg-red-700',
      ghost: 'text-muted hover:text-text hover:bg-border/30',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
