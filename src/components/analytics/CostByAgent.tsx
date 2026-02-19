'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#5e6ad2', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

interface Props {
  data: Array<{ agent_id: string; total_cost: number }>
}

export default function CostByAgentChart({ data }: Props) {
  const chartData = data.map(d => ({ name: d.agent_id, value: Math.round(d.total_cost * 100) / 100 }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: $${value}`} labelLine={{ stroke: '#666' }}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }} formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
