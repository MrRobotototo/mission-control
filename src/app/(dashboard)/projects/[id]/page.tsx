'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import TaskCard from '@/components/TaskCard'
import { Project, Task, Agent } from '@/types'

interface ProjectTokens {
  total_tokens: number
  total_cost: number
  by_model: Record<string, number>
  record_count: number
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [tokens, setTokens] = useState<ProjectTokens | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as string,
    agent_id: 'claw',
    assigned_to: '',
    status: 'todo' as string,
    blocked_by: '',
    blocker_reason: '',
  })

  useEffect(() => {
    fetchData()
  }, [id, filterAgent])

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, agentsRes, tokensRes] = await Promise.all([
        fetch(`/api/projects/${id}`),
        fetch(`/api/tasks?project_id=${id}${filterAgent !== 'all' ? `&agent_id=${filterAgent}` : ''}`),
        fetch('/api/agents'),
        fetch(`/api/projects/${id}/tokens`),
      ])

      const [projectData, tasksData, agentsData, tokensData] = await Promise.all([
        projectRes.json(),
        tasksRes.json(),
        agentsRes.json(),
        tokensRes.json(),
      ])

      setProject(projectData)
      setTasks(tasksData)
      setAgents(agentsData)
      setTokens(tokensData?.error ? null : tokensData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body: Record<string, unknown> = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        agent_id: newTask.agent_id,
        assigned_to: newTask.assigned_to || null,
        project_id: id,
        status: newTask.status,
      }
      if (newTask.status === 'blocked' && newTask.blocked_by) {
        body.blocked_by = newTask.blocked_by
        body.blocker_reason = newTask.blocker_reason || null
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setTasks([data, ...tasks])
      setShowCreateModal(false)
      setNewTask({
        title: '', description: '', priority: 'medium', agent_id: 'claw',
        assigned_to: '', status: 'todo' as string, blocked_by: '', blocker_reason: '',
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
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-[#6B6B6B]">Loading project...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-center">
          <div className="emoji text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-white mb-2">Project not found</h2>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8] transition-all"
          >
            Back to Projects
          </button>
        </div>
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
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="px-8 py-6 max-w-[1400px]">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-[#A1A1A1] hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Projects
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-[#A1A1A1]">{project.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#6366F1] text-white rounded-full text-sm font-medium hover:bg-[#818CF8] hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-[1400px] space-y-6">
          {/* Token Usage Card */}
          {tokens && tokens.total_tokens > 0 && (
            <div className="p-6 bg-[#111111] border border-[#222222] rounded-2xl">
              <h3 className="text-sm font-semibold text-white mb-4">
                <span className="emoji mr-1">📊</span> Token Usage for this Project
              </h3>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span className="text-xs text-[#A1A1A1] block mb-1">Total Tokens</span>
                  <span className="text-lg font-semibold text-white">{tokens.total_tokens.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-[#A1A1A1] block mb-1">Cost</span>
                  <span className="text-lg font-semibold text-[#10B981]">${tokens.total_cost.toFixed(2)}</span>
                </div>
                {Object.entries(tokens.by_model || {}).map(([model, cost]) => (
                  <div key={model}>
                    <span className="text-xs text-[#A1A1A1] block mb-1">{model}</span>
                    <span className="text-sm text-white">${(cost as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#A1A1A1]">Filter by agent:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterAgent('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterAgent === 'all'
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-[#1A1A1A] text-[#A1A1A1] hover:bg-[#222222] hover:text-white'
                }`}
              >
                All
              </button>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setFilterAgent(agent.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterAgent === agent.id
                      ? 'bg-[#6366F1] text-white'
                      : 'bg-[#1A1A1A] text-[#A1A1A1] hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <span className="emoji mr-1">{agent.emoji || '🤖'}</span>
                  {agent.name}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-1 capitalize">
                    {status.replace('-', ' ')}
                  </h3>
                  <span className="text-xs text-[#6B6B6B]">{statusTasks.length} tasks</span>
                </div>
                <div className="space-y-3 flex-1">
                  {statusTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-[#111111] border border-[#222222] rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-white mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                  placeholder="What needs to be done?"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-white mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors min-h-[80px] resize-none"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-white mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-white mb-2">Agent</label>
                  <select
                    value={newTask.agent_id}
                    onChange={(e) => setNewTask({ ...newTask, agent_id: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.emoji} {agent.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-white mb-2">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-white mb-2">Assign To</label>
                  <input
                    type="text"
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                    placeholder="oscar, etc."
                  />
                </div>
              </div>

              {/* Blocker fields */}
              {newTask.status === 'blocked' && (
                <div className="space-y-4 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl">
                  <div>
                    <label className="block text-[13px] font-medium text-[#EF4444] mb-2">Blocked By</label>
                    <select
                      value={newTask.blocked_by}
                      onChange={(e) => setNewTask({ ...newTask, blocked_by: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#EF4444] transition-colors"
                    >
                      <option value="">Select a task...</option>
                      {tasks.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#EF4444] mb-2">Blocker Reason</label>
                    <input
                      type="text"
                      value={newTask.blocker_reason}
                      onChange={(e) => setNewTask({ ...newTask, blocker_reason: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#222222] rounded-xl text-white text-sm focus:outline-none focus:border-[#EF4444] transition-colors"
                      placeholder="Why is this blocked?"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-sm font-medium hover:bg-[#222222] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#6366F1] text-white rounded-xl text-sm font-medium hover:bg-[#818CF8] transition-colors"
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
