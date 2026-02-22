import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return <Loader2 className="w-5 h-5 animate-spin text-accent" />
}
