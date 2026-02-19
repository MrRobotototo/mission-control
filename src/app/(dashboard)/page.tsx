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
        <div style={{ color: '#6B6B6B' }}>Loading projects...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Sticky Header */}
      <div 
        className="sticky top-0 z-40 border-b"
        style={{ 
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(12px)',
          borderColor: '#222222'
        }}
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between max-w-[1400px]">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">Projects</h1>
              <p style={{ fontSize: '13px', color: '#A1A1A1' }}>
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 hover:scale-105"
              style={{
                backgroundColor: '#6366F1',
                color: 'white',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#818CF8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
            >
              <span style={{ fontSize: '18px' }}>+</span>
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
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
              <h2 className="text-xl font-semibold text-white mb-2">No projects yet</h2>
              <p style={{ color: '#A1A1A1', marginBottom: '24px' }}>
                Create your first project to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#6366F1', color: 'white', fontSize: '14px' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#818CF8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
              >
                + Create Project
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            style={{ maxWidth: '1400px' }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowCreateModal(false)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-scale-in"
            style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label 
                  className="block font-medium text-white mb-2"
                  style={{ fontSize: '13px' }}
                >
                  Project Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid #222222',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  placeholder="My AI Project"
                  required
                  autoFocus
                  onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.target.style.borderColor = '#222222'}
                />
              </div>

              <div>
                <label 
                  className="block font-medium text-white mb-2"
                  style={{ fontSize: '13px' }}
                >
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl resize-none transition-all"
                  style={{
                    backgroundColor: '#0A0A0A',
                    border: '1px solid #222222',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  placeholder="What is this project about?"
                  rows={4}
                  onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.target.style.borderColor = '#222222'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#222222'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: '#6366F1',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#818CF8'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
