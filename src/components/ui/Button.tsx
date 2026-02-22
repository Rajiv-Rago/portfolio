import { forwardRef, type ButtonHTMLAttributes } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, children, disabled, className = '', ...props }, ref) => {
    const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-md] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

    const variants: Record<string, string> = {
      primary: 'bg-accent text-white hover:bg-accent-dark',
      secondary: 'bg-surface text-text border border-border hover:border-accent',
      danger: 'bg-danger text-white hover:bg-red-700',
      ghost: 'text-muted hover:text-text hover:bg-gray-100',
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
