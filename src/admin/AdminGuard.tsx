import type { ReactNode } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginForm from './LoginForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { session, loading, login } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />
  if (!session) return <LoginForm onLogin={login} />

  return <>{children}</>
}
