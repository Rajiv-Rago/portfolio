interface StatusBadgeProps {
  status: 'draft' | 'published'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles =
    status === 'published'
      ? 'bg-success-light text-success'
      : 'bg-gray-100 text-muted'

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${styles}`}>
      {status}
    </span>
  )
}
