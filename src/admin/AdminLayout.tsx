import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  FileText,
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react'
import AdminGuard from './AdminGuard'
import { useAuth } from './hooks/useAuth'
import DashboardHome from './DashboardHome'
import ProjectsAdmin from './ProjectsAdmin'
import ExperienceAdmin from './ExperienceAdmin'
import BlogAdmin from './BlogAdmin'
import MessagesAdmin from './MessagesAdmin'
import ProfileSettings from './ProfileSettings'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Home', end: true },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { to: '/admin/blog', icon: FileText, label: 'Blog' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/profile', icon: User, label: 'Profile' },
]

function AdminContent() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-60 bg-surface border-r border-border p-4 flex flex-col shrink-0 max-md:hidden">
        <div className="font-heading text-lg mb-6 px-2">Dashboard</div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-sm font-medium transition-colors ${
                  isActive ? 'bg-accent-light text-accent' : 'text-muted hover:text-text hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-[--radius-md] text-sm font-medium text-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around py-2 z-10">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${isActive ? 'text-accent' : 'text-muted'}`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-8 max-md:p-4 max-md:pb-20 overflow-auto">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  )
}
