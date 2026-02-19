'use client'

import { useState, useEffect } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { Project } from '@/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active' as const,
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })
      const data = await res.json()
      setProjects([data, ...projects])
      setShowCreateModal(false)
      setNewProject({ name: '', description: '', status: 'active' })
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#a0a0a0]">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#0d0d0d] sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#e5e5e5]">Projects</h1>
              <p className="text-sm text-[#a0a0a0] mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#5e6ad2] text-white rounded-lg font-medium hover:bg-[#4f5bc4] transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {projects.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-[#e5e5e5] mb-2">No projects yet</h2>
              <p className="text-[#a0a0a0] mb-6">Create your first project to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-[#5e6ad2] text-white rounded-lg font-medium hover:bg-[#4f5bc4] transition-all"
              >
                + Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px]">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-semibold text-[#e5e5e5] mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] focus:border-transparent transition-all"
                  placeholder="My AI Project"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] focus:border-transparent transition-all resize-none"
                  placeholder="What is this project about?"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#2a2a2a] text-[#e5e5e5] rounded-lg font-medium hover:bg-[#3a3a3a] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#5e6ad2] text-white rounded-lg font-medium hover:bg-[#4f5bc4] transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
