'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  project_id: string; name: string; total_tokens: number; total_cost: number; tasks_count: number
}

interface TopTask {
  task_id: string; title: string; project_name: string; project_id: string; agent_id: string; total_tokens: number; total_cost: number
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
    return <div className="flex items-center justify-center h-screen"><div className="text-[#a0a0a0]">Loading analytics...</div></div>
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#e5e5e5] mb-2">📊 Analytics</h1>
        <p className="text-sm text-[#a0a0a0] mb-8">Token usage and cost tracking across all projects</p>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tokens', value: (overview?.total_tokens || 0).toLocaleString(), sub: `${overview?.record_count || 0} records` },
            { label: 'Total Cost', value: `$${(overview?.total_cost || 0).toFixed(2)}`, sub: 'All time' },
            { label: 'This Month', value: (overview?.this_month_tokens || 0).toLocaleString(), sub: `$${(overview?.this_month_cost || 0).toFixed(2)}` },
            { label: 'Avg per Task', value: (overview?.avg_tokens_per_task || 0).toLocaleString(), sub: 'tokens' },
          ].map((card) => (
            <div key={card.label} className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
              <span className="text-xs text-[#a0a0a0] block mb-1">{card.label}</span>
              <span className="text-2xl font-semibold text-[#e5e5e5]">{card.value}</span>
              <span className="text-xs text-[#666] block mt-1">{card.sub}</span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="col-span-2 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Tokens Over Time (Last 30 Days)</h3>
            {byDay.length > 0 ? <TokensOverTimeChart data={byDay} /> : <p className="text-sm text-[#666] py-8 text-center">No data yet</p>}
          </div>

          <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Cost by Agent</h3>
            {byAgent.length > 0 ? <CostByAgentChart data={byAgent} /> : <p className="text-sm text-[#666] py-8 text-center">No data yet</p>}
          </div>

          <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
            <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Cost by LLM</h3>
            {byModel.length > 0 ? <CostByModelChart data={byModel} /> : <p className="text-sm text-[#666] py-8 text-center">No data yet</p>}
          </div>
        </div>

        {/* Top Projects Table */}
        <div className="mb-8 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Top Projects by Cost</h3>
          {topProjects.length === 0 ? (
            <p className="text-sm text-[#666] py-4 text-center">No data yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[#a0a0a0] border-b border-[#2a2a2a]">
                  <th className="text-left py-2">Project</th>
                  <th className="text-right py-2">Total Tokens</th>
                  <th className="text-right py-2">Cost</th>
                  <th className="text-right py-2">Tasks</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map((p) => (
                  <tr key={p.project_id} className="border-b border-[#2a2a2a]/50 hover:bg-[#2a2a2a]/30 cursor-pointer" onClick={() => router.push(`/projects/${p.project_id}`)}>
                    <td className="py-2 text-sm text-[#e5e5e5]">{p.name}</td>
                    <td className="py-2 text-sm text-[#a0a0a0] text-right">{p.total_tokens.toLocaleString()}</td>
                    <td className="py-2 text-sm text-[#22c55e] text-right">${p.total_cost.toFixed(2)}</td>
                    <td className="py-2 text-sm text-[#a0a0a0] text-right">{p.tasks_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Tasks Table */}
        <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <h3 className="text-sm font-semibold text-[#e5e5e5] mb-4">Top Tasks by Cost</h3>
          {topTasks.length === 0 ? (
            <p className="text-sm text-[#666] py-4 text-center">No data yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[#a0a0a0] border-b border-[#2a2a2a]">
                  <th className="text-left py-2">Task</th>
                  <th className="text-left py-2">Project</th>
                  <th className="text-left py-2">Agent</th>
                  <th className="text-right py-2">Tokens</th>
                  <th className="text-right py-2">Cost</th>
                </tr>
              </thead>
              <tbody>
                {topTasks.map((t) => (
                  <tr key={t.task_id} className="border-b border-[#2a2a2a]/50 hover:bg-[#2a2a2a]/30 cursor-pointer" onClick={() => router.push(`/tasks/${t.task_id}`)}>
                    <td className="py-2 text-sm text-[#e5e5e5]">{t.title}</td>
                    <td className="py-2 text-sm text-[#a0a0a0]">{t.project_name}</td>
                    <td className="py-2 text-sm text-[#a0a0a0]">{t.agent_id}</td>
                    <td className="py-2 text-sm text-[#a0a0a0] text-right">{t.total_tokens.toLocaleString()}</td>
                    <td className="py-2 text-sm text-[#22c55e] text-right">${t.total_cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
