'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Agent, Task } from '@/types'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface TokenStats {
  total_tokens: number
  total_cost: number
  task_count: number
}

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [agentRes, tasksRes, tokensRes] = await Promise.all([
        fetch(`/api/agents/${id}`),
        fetch(`/api/tasks?agent_id=${id}`),
        fetch(`/api/analytics/by-agent?agent_id=${id}`),
      ])

      const [agentData, tasksData, tokensData] = await Promise.all([
        agentRes.json(),
        tasksRes.json(),
        tokensRes.json(),
      ])

      setAgent(agentData.error ? null : agentData)
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setTokenStats(tokensData.error ? null : tokensData)
    } catch (error) {
      console.error('Error fetching agent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      blocked: tasks.filter((t) => t.status === 'blocked').length,
      review: tasks.filter((t) => t.status === 'review').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }
  }

  const statusConfig = {
    online: { color: 'bg-[#22c55e]', label: 'Online', textColor: 'text-[#22c55e]' },
    offline: { color: 'bg-[#a0a0a0]', label: 'Offline', textColor: 'text-[#a0a0a0]' },
    busy: { color: 'bg-[#f59e0b]', label: 'Busy', textColor: 'text-[#f59e0b]' },
  }

  const taskStatusConfig = {
    todo: { label: 'To Do', color: 'bg-[#a0a0a0]/10 text-[#a0a0a0] border-[#a0a0a0]/20' },
    'in-progress': { label: 'In Progress', color: 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20' },
    blocked: { label: 'Blocked', color: 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20' },
    review: { label: 'Review', color: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20' },
    done: { label: 'Done', color: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#a0a0a0]">Loading agent...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold text-[#e5e5e5] mb-2">Agent not found</h2>
          <button
            onClick={() => router.push('/agents')}
            className="mt-4 px-4 py-2 bg-[#5e6ad2] text-white rounded-lg hover:bg-[#4f5bc4] transition-all"
          >
            Back to Agents
          </button>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const status = statusConfig[agent.status]
  const currentTask = tasks.find((t) => t.status === 'in-progress')

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] bg-[#0d0d0d]">
        <div className="px-8 py-6">
          <button
            onClick={() => router.push('/agents')}
            className="text-sm text-[#a0a0a0] hover:text-[#e5e5e5] mb-4 flex items-center gap-2"
          >
            ← Back to Agents
          </button>
          
          <div className="flex items-start gap-6">
            <div className="text-6xl">{agent.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold text-[#e5e5e5]">{agent.name}</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  <span className={`text-sm font-medium ${status.textColor}`}>{status.label}</span>
                </div>
              </div>
              {agent.description && (
                <p className="text-[#a0a0a0] mb-3">{agent.description}</p>
              )}
              {agent.default_model && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] rounded-lg">
                  <span className="text-xs text-[#a0a0a0]">Model:</span>
                  <span className="text-sm text-[#e5e5e5] font-medium">{agent.default_model}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-8 border-b border-[#2a2a2a]">
        <div className="grid grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="text-4xl font-bold text-[#e5e5e5] mb-2">{stats.total}</div>
            <div className="text-sm text-[#a0a0a0]">Total Tasks</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="text-4xl font-bold text-[#5e6ad2] mb-2">{stats.inProgress}</div>
            <div className="text-sm text-[#a0a0a0]">In Progress</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
            <div className="text-4xl font-bold text-[#22c55e] mb-2">{stats.done}</div>
            <div className="text-sm text-[#a0a0a0]">Completed</div>
          </div>
        </div>

        {tokenStats && (
          <div className="mt-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 max-w-4xl">
            <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Token Usage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-semibold text-[#e5e5e5]">
                  {tokenStats.total_tokens.toLocaleString()}
                </div>
                <div className="text-xs text-[#a0a0a0]">Total Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#22c55e]">
                  ${tokenStats.total_cost.toFixed(2)}
                </div>
                <div className="text-xs text-[#a0a0a0]">Total Cost</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="px-8 py-6 border-b border-[#2a2a2a]">
          <h2 className="text-lg font-semibold text-[#e5e5e5] mb-4">Currently Working On</h2>
          <Link href={`/tasks/${currentTask.id}`}>
            <div className="bg-[#1a1a1a] border border-[#5e6ad2]/50 rounded-xl p-6 hover:border-[#5e6ad2] transition-all cursor-pointer group max-w-4xl">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-[#e5e5e5] group-hover:text-[#5e6ad2] transition-colors flex-1">
                  {currentTask.name}
                </h3>
                <span className="text-xs text-[#5e6ad2] font-medium">View →</span>
              </div>
              {currentTask.description && (
                <p className="text-sm text-[#a0a0a0] mb-3">{currentTask.description}</p>
              )}
              <div className="text-xs text-[#6a6a6a]">
                Started {formatDateTime(currentTask.updated_at)}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* All Tasks */}
      <div className="p-8">
        <h2 className="text-lg font-semibold text-[#e5e5e5] mb-4">All Tasks ({tasks.length})</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-[#a0a0a0]">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl">
            {tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#5e6ad2]/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-[#e5e5e5] group-hover:text-[#5e6ad2] transition-colors flex-1">
                      {task.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${
                        taskStatusConfig[task.status].color
                      } ml-3`}
                    >
                      {taskStatusConfig[task.status].label}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-[#a0a0a0] line-clamp-2 mb-2">{task.description}</p>
                  )}
                  <div className="text-xs text-[#6a6a6a]">
                    Updated {formatDateTime(task.updated_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
