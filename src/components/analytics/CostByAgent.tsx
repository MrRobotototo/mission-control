'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

interface Props {
  data: Array<{ agent_id: string; total_cost: number }>
}

export default function CostByAgentChart({ data }: Props) {
  const chartData = data.map(d => ({ name: d.agent_id, value: Math.round(d.total_cost * 100) / 100 }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          label={({ name, value }) => `${name}: $${value}`}
          labelLine={{ stroke: '#6B6B6B' }}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#111111',
            border: '1px solid #222222',
            borderRadius: 12,
            fontSize: 12,
            color: '#FFFFFF',
          }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
