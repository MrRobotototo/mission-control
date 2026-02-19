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

  const statusConfig = {
    online: { color: '#10B981', label: 'Online' },
    offline: { color: '#6B6B6B', label: 'Offline' },
    busy: { color: '#F59E0B', label: 'Busy' },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div style={{ color: '#6B6B6B' }}>Loading agents...</div>
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
          <div className="max-w-[1400px]">
            <h1 className="text-2xl font-semibold text-white mb-1">Agents</h1>
            <p style={{ fontSize: '13px', color: '#A1A1A1' }}>
              {agents.length} AI {agents.length === 1 ? 'agent' : 'agents'} managing your projects
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1400px]">
          {agents.map((agent) => {
            const stats = getAgentStats(agent.id)
            const status = statusConfig[agent.status]
            return (
              <Link key={agent.id} href={`/agents/${agent.id}`}>
                <div
                  className="rounded-2xl p-6 cursor-pointer transition-all duration-200"
                  style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.borderColor = '#6366F1'
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(99, 102, 241, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = '#222222'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span style={{ fontSize: '48px' }}>{agent.emoji}</span>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{agent.name}</h3>
                        {agent.description && (
                          <p style={{ fontSize: '13px', color: '#A1A1A1', marginTop: '4px' }}>
                            {agent.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#1A1A1A' }}>
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span style={{ fontSize: '12px', color: status.color }}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {agent.default_model && (
                    <div className="mb-4 px-3 py-2 rounded-lg inline-block" style={{ backgroundColor: '#1A1A1A' }}>
                      <span style={{ fontSize: '12px', color: '#6B6B6B' }}>Model: </span>
                      <span style={{ fontSize: '12px', color: 'white', fontWeight: 500 }}>
                        {agent.default_model}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-4" style={{ borderColor: '#222222' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>
                      Task Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-semibold text-white">{stats.total}</div>
                        <div style={{ fontSize: '12px', color: '#6B6B6B' }}>Total Tasks</div>
                      </div>
                      <div>
                        <div className="text-2xl font-semibold" style={{ color: '#6366F1' }}>
                          {stats.inProgress}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B6B6B' }}>In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-semibold" style={{ color: '#10B981' }}>
                          {stats.done}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B6B6B' }}>Completed</div>
                      </div>
                    </div>
                    
                    {stats.blocked > 0 && (
                      <div 
                        className="mt-3 p-2 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 500 }}>
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
      </div>
    </div>
  )
}
