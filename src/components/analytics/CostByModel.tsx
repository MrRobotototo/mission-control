'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ model: string; total_cost: number }>
}

export default function CostByModelChart({ data }: Props) {
  const chartData = data.map(d => ({ name: d.model, cost: Math.round(d.total_cost * 100) / 100 }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
        <XAxis dataKey="name" tick={{ fill: '#A1A1A1', fontSize: 11 }} />
        <YAxis tick={{ fill: '#A1A1A1', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
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
        <Bar dataKey="cost" fill="#6366F1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
