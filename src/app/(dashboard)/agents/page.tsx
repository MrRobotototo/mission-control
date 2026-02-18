'use client'

import { useState, useEffect } from 'react'
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
      todo: agentTasks.filter((t) => t.status === 'todo').length,
      inProgress: agentTasks.filter((t) => t.status === 'in-progress').length,
      blocked: agentTasks.filter((t) => t.status === 'blocked').length,
      review: agentTasks.filter((t) => t.status === 'review').length,
      done: agentTasks.filter((t) => t.status === 'done').length,
    }
  }

  const statusColors = {
    online: 'bg-[#22c55e]',
    offline: 'bg-[#a0a0a0]',
    busy: 'bg-[#f59e0b]',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[#a0a0a0]">Loading agents...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#e5e5e5] mb-2">Agents</h1>
          <p className="text-sm text-[#a0a0a0]">AI agents and their task statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => {
            const stats = getAgentStats(agent.id)
            return (
              <div
                key={agent.id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{agent.emoji}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-[#e5e5e5]">{agent.name}</h3>
                      {agent.description && (
                        <p className="text-sm text-[#a0a0a0] mt-1">{agent.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[agent.status]}`} />
                    <span className="text-xs text-[#a0a0a0] capitalize">{agent.status}</span>
                  </div>
                </div>

                {agent.default_model && (
                  <div className="mb-4 px-3 py-2 bg-[#2a2a2a] rounded-lg inline-block">
                    <span className="text-xs text-[#a0a0a0]">Model: </span>
                    <span className="text-xs text-[#e5e5e5] font-medium">{agent.default_model}</span>
                  </div>
                )}

                <div className="border-t border-[#2a2a2a] pt-4">
                  <h4 className="text-sm font-semibold text-[#e5e5e5] mb-3">Task Statistics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-semibold text-[#e5e5e5]">{stats.total}</div>
                      <div className="text-xs text-[#a0a0a0]">Total Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#5e6ad2]">{stats.inProgress}</div>
                      <div className="text-xs text-[#a0a0a0]">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#22c55e]">{stats.done}</div>
                      <div className="text-xs text-[#a0a0a0]">Completed</div>
                    </div>
                  </div>
                  
                  {stats.blocked > 0 && (
                    <div className="mt-3 p-2 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg">
                      <span className="text-sm text-[#ef4444] font-medium">
                        {stats.blocked} blocked task{stats.blocked !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
