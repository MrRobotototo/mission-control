'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const TokensOverTimeChart = dynamic(() => import('@/components/analytics/TokensOverTime'), { ssr: false })
const CostByAgentChart = dynamic(() => import('@/components/analytics/CostByAgent'), { ssr: false })
const CostByModelChart = dynamic(() => import('@/components/analytics/CostByModel'), { ssr: false })

interface Overview {
  total_tokens: number
  total_cost: number
  this_month_tokens: number
  this_month_cost: number
  avg_tokens_per_task: number
  record_count: number
}

interface TopProject {
  project_id: string
  name: string
  total_tokens: number
  total_cost: number
  tasks_count: number
}

interface TopTask {
  task_id: string
  title: string
  project_name: string
  project_id: string
  agent_id: string
  total_tokens: number
  total_cost: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [byDay, setByDay] = useState<Array<{ date: string; input_tokens: number; output_tokens: number; cost: number }>>([])
  const [byAgent, setByAgent] = useState<Array<{ agent_id: string; total_tokens: number; total_cost: number }>>([])
  const [byModel, setByModel] = useState<Array<{ model: string; total_tokens: number; total_cost: number }>>([])
  const [topProjects, setTopProjects] = useState<TopProject[]>([])
  const [topTasks, setTopTasks] = useState<TopTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/overview').then(r => r.json()),
      fetch('/api/analytics/by-day').then(r => r.json()),
      fetch('/api/analytics/by-agent').then(r => r.json()),
      fetch('/api/analytics/by-model').then(r => r.json()),
      fetch('/api/analytics/top-projects').then(r => r.json()),
      fetch('/api/analytics/top-tasks').then(r => r.json()),
    ]).then(([ov, day, agent, model, proj, task]) => {
      setOverview(ov)
      setByDay(Array.isArray(day) ? day : [])
      setByAgent(Array.isArray(agent) ? agent : [])
      setByModel(Array.isArray(model) ? model : [])
      setTopProjects(Array.isArray(proj) ? proj : [])
      setTopTasks(Array.isArray(task) ? task : [])
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div style={{ color: '#6B6B6B' }}>Loading analytics...</div>
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
            <h1 className="text-2xl font-semibold text-white mb-1">📊 Analytics</h1>
            <p style={{ fontSize: '13px', color: '#A1A1A1' }}>
              Token usage and cost tracking across all projects
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-[1400px] space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: 'Total Tokens', 
                value: (overview?.total_tokens || 0).toLocaleString(), 
                sub: `${overview?.record_count || 0} records`,
                color: '#6366F1'
              },
              { 
                label: 'Total Cost', 
                value: `$${(overview?.total_cost || 0).toFixed(2)}`, 
                sub: 'All time',
                color: '#10B981'
              },
              { 
                label: 'This Month', 
                value: (overview?.this_month_tokens || 0).toLocaleString(), 
                sub: `$${(overview?.this_month_cost || 0).toFixed(2)}`,
                color: '#F59E0B'
              },
              { 
                label: 'Avg per Task', 
                value: (overview?.avg_tokens_per_task || 0).toLocaleString(), 
                sub: 'tokens',
                color: '#3B82F6'
              },
            ].map((card) => (
              <div 
                key={card.label} 
                className="p-6 rounded-2xl"
                style={{ backgroundColor: '#111111', border: '1px solid #222222' }}
              >
                <div style={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '12px', fontWeight: 500 }}>
                  {card.label}
                </div>
                <div className="text-3xl font-semibold text-white mb-2">
                  {card.value}
                </div>
                <div style={{ fontSize: '12px', color: '#A1A1A1' }}>
                  {card.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          {byDay.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <h3 className="text-lg font-semibold text-white mb-6">Tokens Over Time</h3>
              <TokensOverTimeChart data={byDay} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {byAgent.length > 0 && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h3 className="text-lg font-semibold text-white mb-6">Cost by Agent</h3>
                <CostByAgentChart data={byAgent} />
              </div>
            )}

            {byModel.length > 0 && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
                <h3 className="text-lg font-semibold text-white mb-6">Cost by LLM Model</h3>
                <CostByModelChart data={byModel} />
              </div>
            )}
          </div>

          {/* Top Projects */}
          {topProjects.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <h3 className="text-lg font-semibold text-white mb-6">Top Projects by Cost</h3>
              <div className="space-y-3">
                {topProjects.slice(0, 5).map((proj) => (
                  <Link key={proj.project_id} href={`/projects/${proj.project_id}`}>
                    <div 
                      className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                      style={{ backgroundColor: '#0A0A0A', border: '1px solid transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6366F1'
                        e.currentTarget.style.backgroundColor = '#111111'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.backgroundColor = '#0A0A0A'
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{proj.name}</div>
                        <div style={{ fontSize: '12px', color: '#6B6B6B' }}>
                          {proj.total_tokens.toLocaleString()} tokens • {proj.tasks_count} tasks
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: '#10B981' }}>
                          ${proj.total_cost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Top Tasks */}
          {topTasks.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <h3 className="text-lg font-semibold text-white mb-6">Top Tasks by Token Usage</h3>
              <div className="space-y-3">
                {topTasks.slice(0, 5).map((task) => (
                  <Link key={task.task_id} href={`/tasks/${task.task_id}`}>
                    <div 
                      className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                      style={{ backgroundColor: '#0A0A0A', border: '1px solid transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6366F1'
                        e.currentTarget.style.backgroundColor = '#111111'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.backgroundColor = '#0A0A0A'
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white mb-1">{task.title}</div>
                        <div style={{ fontSize: '12px', color: '#6B6B6B' }}>
                          {task.project_name} • {task.agent_id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {task.total_tokens.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#10B981' }}>
                          ${task.total_cost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {byDay.length === 0 && topProjects.length === 0 && topTasks.length === 0 && (
            <div className="text-center py-16">
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
              <h2 className="text-xl font-semibold text-white mb-2">No data yet</h2>
              <p style={{ color: '#A1A1A1' }}>
                Token usage will appear here once tasks start running
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
