import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdminProjects } from './hooks/useAdminProjects'
import type { Project } from '../lib/types'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProjectForm from './ProjectForm'

export default function ProjectsAdmin() {
  const { projects, loading, create, update, remove } = useAdminProjects()
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSubmit = async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (editing) {
      await update(editing.id, data)
    } else {
      await create(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    await remove(deleting.id)
    setDeleteLoading(false)
    setDeleting(null)
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (showForm || editing) {
    return (
      <div>
        <h1 className="text-2xl font-normal mb-6">{editing ? 'Edit' : 'Add'} Project</h1>
        <ProjectForm
          project={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal">Projects</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-[--radius-lg] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium max-md:hidden">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-border/30">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-muted max-md:hidden">{format(new Date(p.created_at), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(p)} className="text-muted hover:text-accent p-1" aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleting(p)} className="text-muted hover:text-danger p-1" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.title}?`}
        message="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
