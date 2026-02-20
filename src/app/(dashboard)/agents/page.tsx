'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Agent, Task } from '@/types'

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [agentsRes, tasksRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/tasks'),
      ])

      const [agentsData, tasksData] = await Promise.all([
        agentsRes.json(),
        tasksRes.json(),
      ])

      setAgents(agentsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAgentStats = (agentId: string) => {
    const agentTasks = tasks.filter((t) => t.agent_id === agentId)
    return {
      total: agentTasks.length,
      inProgress: agentTasks.filter((t) => t.status === 'in-progress').length,
      done: agentTasks.filter((t) => t.status === 'done').length,
      blocked: agentTasks.filter((t) => t.status === 'blocked').length,
    }
  }

  const statusConfig: Record<string, { color: string; label: string }> = {
    online: { color: '#10B981', label: 'Online' },
    offline: { color: '#6B6B6B', label: 'Offline' },
    busy: { color: '#F59E0B', label: 'Busy' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-[#6B6B6B]">Loading agents...</div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="px-8 py-6">
          <div className="max-w-[1400px]">
            <h1 className="text-2xl font-semibold text-white mb-1">Agents</h1>
            <p className="text-[13px] text-[#A1A1A1]">
              {agents.length} AI {agents.length === 1 ? 'agent' : 'agents'} managing your projects
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {agents.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center">
              <div className="emoji text-6xl mb-4">🤖</div>
              <h2 className="text-xl font-semibold text-white mb-2">No agents yet</h2>
              <p className="text-[#A1A1A1]">Agents will appear here once configured</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px]">
            {agents.map((agent) => {
              const stats = getAgentStats(agent.id)
              const status = statusConfig[agent.status]
              return (
                <Link key={agent.id} href={`/agents/${agent.id}`}>
                  <div className="rounded-2xl p-6 cursor-pointer transition-all duration-200 bg-[#111111] border border-[#222222] hover:border-[#6366F1] hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="emoji text-5xl" role="img">{agent.emoji || '🤖'}</span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                          {agent.description && (
                            <p className="text-[13px] text-[#A1A1A1] mt-1">{agent.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A]">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-xs" style={{ color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {agent.default_model && (
                      <div className="mb-4 px-3 py-2 rounded-lg inline-block bg-[#1A1A1A]">
                        <span className="text-xs text-[#6B6B6B]">Model: </span>
                        <span className="text-xs text-white font-medium">{agent.default_model}</span>
                      </div>
                    )}

                    <div className="border-t border-[#222222] pt-4">
                      <h4 className="text-[13px] font-semibold text-white mb-3">Task Statistics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-2xl font-semibold text-white">{stats.total}</div>
                          <div className="text-xs text-[#6B6B6B]">Total Tasks</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-[#6366F1]">{stats.inProgress}</div>
                          <div className="text-xs text-[#6B6B6B]">In Progress</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-[#10B981]">{stats.done}</div>
                          <div className="text-xs text-[#6B6B6B]">Completed</div>
                        </div>
                      </div>
                      
                      {stats.blocked > 0 && (
                        <div className="mt-3 p-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
                          <span className="text-[13px] text-[#EF4444] font-medium">
                            {stats.blocked} blocked task{stats.blocked !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
