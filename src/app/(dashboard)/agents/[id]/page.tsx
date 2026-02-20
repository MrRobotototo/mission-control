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

  const statusConfig: Record<string, { dotClass: string; label: string; textClass: string }> = {
    online: { dotClass: 'bg-[#10B981]', label: 'Online', textClass: 'text-[#10B981]' },
    offline: { dotClass: 'bg-[#6B6B6B]', label: 'Offline', textClass: 'text-[#6B6B6B]' },
    busy: { dotClass: 'bg-[#F59E0B]', label: 'Busy', textClass: 'text-[#F59E0B]' },
  }

  const taskStatusConfig: Record<string, { label: string; color: string }> = {
    todo: { label: 'To Do', color: 'bg-[#A1A1A1]/10 text-[#A1A1A1] border-[#A1A1A1]/20' },
    'in-progress': { label: 'In Progress', color: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20' },
    blocked: { label: 'Blocked', color: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' },
    review: { label: 'Review', color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
    done: { label: 'Done', color: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-[#6B6B6B]">Loading agent...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-center">
          <div className="emoji text-6xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold text-white mb-2">Agent not found</h2>
          <button
            onClick={() => router.push('/agents')}
            className="mt-4 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8] transition-all"
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
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="px-8 py-6 max-w-[1400px]">
          <button
            onClick={() => router.push('/agents')}
            className="text-sm text-[#A1A1A1] hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back to Agents
          </button>
          
          <div className="flex items-start gap-6">
            <span className="emoji text-6xl" role="img">{agent.emoji || '🤖'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold text-white">{agent.name}</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] rounded-lg border border-[#222222]">
                  <div className={`w-2 h-2 rounded-full ${status.dotClass}`} />
                  <span className={`text-sm font-medium ${status.textClass}`}>{status.label}</span>
                </div>
              </div>
              {agent.description && (
                <p className="text-[#A1A1A1] mb-3">{agent.description}</p>
              )}
              {agent.default_model && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] rounded-lg border border-[#222222]">
                  <span className="text-xs text-[#6B6B6B]">Model:</span>
                  <span className="text-sm text-white font-medium">{agent.default_model}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-8 border-b border-[#222222]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[1400px]">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
            <div className="text-4xl font-bold text-white mb-2">{stats.total}</div>
            <div className="text-sm text-[#A1A1A1]">Total Tasks</div>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
            <div className="text-4xl font-bold text-[#6366F1] mb-2">{stats.inProgress}</div>
            <div className="text-sm text-[#A1A1A1]">In Progress</div>
          </div>
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-6">
            <div className="text-4xl font-bold text-[#10B981] mb-2">{stats.done}</div>
            <div className="text-sm text-[#A1A1A1]">Completed</div>
          </div>
        </div>

        {tokenStats && (
          <div className="mt-6 bg-[#111111] border border-[#222222] rounded-2xl p-6 max-w-[1400px]">
            <h3 className="text-sm font-semibold text-white mb-4">Token Usage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-semibold text-white">
                  {tokenStats.total_tokens.toLocaleString()}
                </div>
                <div className="text-xs text-[#A1A1A1]">Total Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#10B981]">
                  ${tokenStats.total_cost.toFixed(2)}
                </div>
                <div className="text-xs text-[#A1A1A1]">Total Cost</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="px-8 py-6 border-b border-[#222222]">
          <h2 className="text-lg font-semibold text-white mb-4">Currently Working On</h2>
          <Link href={`/tasks/${currentTask.id}`}>
            <div className="bg-[#111111] border border-[#6366F1]/50 rounded-2xl p-6 hover:border-[#6366F1] transition-all cursor-pointer group max-w-[1400px]">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-white group-hover:text-[#6366F1] transition-colors flex-1">
                  {currentTask.title}
                </h3>
                <span className="text-xs text-[#6366F1] font-medium">View →</span>
              </div>
              {currentTask.description && (
                <p className="text-sm text-[#A1A1A1] mb-3">{currentTask.description}</p>
              )}
              <div className="text-xs text-[#6B6B6B]">
                Started {formatDateTime(currentTask.updated_at)}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* All Tasks */}
      <div className="p-8">
        <h2 className="text-lg font-semibold text-white mb-4">All Tasks ({tasks.length})</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="emoji text-6xl mb-4">📋</div>
            <p className="text-[#A1A1A1]">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-[1400px]">
            {tasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="bg-[#111111] border border-[#222222] rounded-xl p-4 hover:border-[#6366F1]/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white group-hover:text-[#6366F1] transition-colors flex-1">
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${
                        taskStatusConfig[task.status]?.color || ''
                      } ml-3`}
                    >
                      {taskStatusConfig[task.status]?.label || task.status}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-[#A1A1A1] line-clamp-2 mb-2">{task.description}</p>
                  )}
                  <div className="text-xs text-[#6B6B6B]">
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
