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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-[#6B6B6B]">Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between max-w-[1400px]">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Projects</h1>
              <p className="text-[13px] text-[#A1A1A1]">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#6366F1] text-white hover:bg-[#818CF8] hover:scale-105 transition-all flex items-center gap-2"
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
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="emoji text-6xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
              <p className="text-[#A1A1A1] mb-6">
                Create your first project to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-full text-sm font-medium bg-[#6366F1] text-white hover:bg-[#818CF8] hover:scale-105 transition-all"
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
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl p-8 shadow-2xl bg-[#111111] border border-[#222222] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-white mb-2">
                  Project Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#222222] text-white text-sm focus:border-[#6366F1] focus:outline-none transition-colors"
                  placeholder="My AI Project"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[#222222] text-white text-sm resize-none focus:border-[#6366F1] focus:outline-none transition-colors"
                  placeholder="What is this project about?"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-[#1A1A1A] text-white hover:bg-[#222222] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-[#6366F1] text-white hover:bg-[#818CF8] transition-colors"
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
