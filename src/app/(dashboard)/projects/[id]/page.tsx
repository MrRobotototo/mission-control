'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import TaskCard from '@/components/TaskCard'
import { Project, Task, Agent } from '@/types'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    agent_id: 'claw',
    assigned_to: '',
  })

  useEffect(() => {
    fetchData()
  }, [id, filterAgent])

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, agentsRes] = await Promise.all([
        fetch(`/api/projects/${id}`),
        fetch(`/api/tasks?project_id=${id}${filterAgent !== 'all' ? `&agent_id=${filterAgent}` : ''}`),
        fetch('/api/agents'),
      ])

      const [projectData, tasksData, agentsData] = await Promise.all([
        projectRes.json(),
        tasksRes.json(),
        agentsRes.json(),
      ])

      setProject(projectData)
      setTasks(tasksData)
      setAgents(agentsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          project_id: id,
          status: 'todo',
        }),
      })
      const data = await res.json()
      setTasks([data, ...tasks])
      setShowCreateModal(false)
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        agent_id: 'claw',
        assigned_to: '',
      })
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const updatedTask = await res.json()
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#a0a0a0]">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#ef4444]">Project not found</div>
      </div>
    )
  }

  const tasksByStatus = {
    'todo': tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    'blocked': tasks.filter((t) => t.status === 'blocked'),
    'review': tasks.filter((t) => t.status === 'review'),
    'done': tasks.filter((t) => t.status === 'done'),
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-[#a0a0a0] hover:text-[#e5e5e5] mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#e5e5e5] mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-[#a0a0a0]">{project.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-[#5e6ad2] text-white rounded-lg font-medium hover:bg-[#4f5bc4] transition-all"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* Agent Filter */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-[#a0a0a0]">Filter by agent:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterAgent('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                filterAgent === 'all'
                  ? 'bg-[#5e6ad2] text-white'
                  : 'bg-[#2a2a2a] text-[#a0a0a0] hover:bg-[#3a3a3a]'
              }`}
            >
              All
            </button>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setFilterAgent(agent.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  filterAgent === agent.id
                    ? 'bg-[#5e6ad2] text-white'
                    : 'bg-[#2a2a2a] text-[#a0a0a0] hover:bg-[#3a3a3a]'
                }`}
              >
                {agent.emoji} {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="flex flex-col">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#e5e5e5] mb-1 capitalize">
                  {status.replace('-', ' ')}
                </h3>
                <span className="text-xs text-[#a0a0a0]">{statusTasks.length} tasks</span>
              </div>
              <div className="space-y-3 flex-1">
                {statusTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[#e5e5e5] mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2] min-h-[80px]"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Agent
                  </label>
                  <select
                    value={newTask.agent_id}
                    onChange={(e) => setNewTask({ ...newTask, agent_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.emoji} {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                  Assign To (optional)
                </label>
                <input
                  type="text"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg text-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]"
                  placeholder="oscar, agent name, or leave empty"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] text-[#e5e5e5] rounded-lg font-medium hover:bg-[#3a3a3a] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#5e6ad2] text-white rounded-lg font-medium hover:bg-[#4f5bc4] transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
