import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      const isDev = import.meta.env.DEV

      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <AlertTriangle className="w-12 h-12 text-warning mb-4" />
          <h1 className="text-2xl font-normal mb-2">Something went wrong</h1>
          <p className="text-muted mb-6">An unexpected error occurred. Please try again.</p>
          {isDev && this.state.error && (
            <pre className="text-left text-xs text-danger bg-danger-light p-4 rounded-[--radius-md] mb-6 max-w-lg overflow-auto max-h-48">
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 bg-accent text-white rounded-[--radius-md] text-sm font-semibold hover:bg-accent-dark transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={this.handleGoHome}
              className="px-5 py-2 bg-surface text-text border border-border rounded-[--radius-md] text-sm font-semibold hover:border-accent transition-colors cursor-pointer"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
