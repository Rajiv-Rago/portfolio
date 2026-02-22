import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdminExperience } from './hooks/useAdminExperience'
import type { Experience } from '../lib/types'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ExperienceForm from './ExperienceForm'

export default function ExperienceAdmin() {
  const { experience, loading, create, update, remove } = useAdminExperience()
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Experience | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSubmit = async (data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) => {
    const payload = {
      ...data,
      end_date: data.end_date || null,
    }
    if (editing) {
      await update(editing.id, payload)
    } else {
      await create(payload as Omit<Experience, 'id' | 'created_at' | 'updated_at'>)
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
        <h1 className="text-2xl font-normal mb-6">{editing ? 'Edit' : 'Add'} Experience</h1>
        <ExperienceForm
          experience={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal">Experience</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-[--radius-lg] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Job Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium max-md:hidden">Dates</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experience.map((exp) => (
              <tr key={exp.id} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{exp.job_title}</td>
                <td className="px-4 py-3 text-muted">{exp.company}</td>
                <td className="px-4 py-3 text-muted max-md:hidden">
                  {exp.start_date} — {exp.end_date ?? 'Present'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(exp)} className="text-muted hover:text-accent p-1" aria-label="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleting(exp)} className="text-muted hover:text-danger p-1" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {experience.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted">No experience entries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.job_title} at ${deleting?.company}?`}
        message="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
