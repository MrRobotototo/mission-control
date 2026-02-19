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
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="name" tick={{ fill: '#a0a0a0', fontSize: 11 }} />
        <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }} formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} />
        <Bar dataKey="cost" fill="#5e6ad2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
