import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, Briefcase, FileText, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Counts {
  projects: number
  experience: number
  blogPosts: number
  unreadMessages: number
}

export default function DashboardHome() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, experience: 0, blogPosts: 0, unreadMessages: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('experience').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ]).then(([p, e, b, m]) => {
      setCounts({
        projects: p.count ?? 0,
        experience: e.count ?? 0,
        blogPosts: b.count ?? 0,
        unreadMessages: m.count ?? 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Projects', count: counts.projects, icon: FolderKanban, to: '/admin/projects', color: 'text-blue-600' },
    { label: 'Experience', count: counts.experience, icon: Briefcase, to: '/admin/experience', color: 'text-green-600' },
    { label: 'Blog Posts', count: counts.blogPosts, icon: FileText, to: '/admin/blog', color: 'text-purple-600' },
    { label: 'Unread Messages', count: counts.unreadMessages, icon: MessageSquare, to: '/admin/messages', color: 'text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-surface border border-border rounded-[--radius-lg] p-6 hover:border-accent transition-colors no-underline"
          >
            <div className="flex items-center gap-3 mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-sm font-medium text-muted">{card.label}</span>
            </div>
            <div className="text-3xl font-heading">{card.count}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
