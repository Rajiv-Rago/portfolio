export default function Footer({ name }: { name: string }) {
  return (
    <footer className="text-center py-8 border-t border-border text-muted text-sm">
      <p>&copy; {new Date().getFullYear()} {name}</p>
    </footer>
  )
}
