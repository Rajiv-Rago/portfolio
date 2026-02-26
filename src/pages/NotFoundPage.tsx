import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useMetaTags } from '../hooks/useMetaTags'

export default function NotFoundPage() {
  useMetaTags({ title: 'Page Not Found \u2014 Portfolio' })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-6xl font-normal text-accent mb-4">404</h1>
      <p className="text-lg text-muted mb-8">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>
    </div>
  )
}
