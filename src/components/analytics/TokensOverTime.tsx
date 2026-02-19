'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: Array<{ date: string; input_tokens: number; output_tokens: number }>
}

export default function TokensOverTimeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="date" tick={{ fill: '#a0a0a0', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#e5e5e5' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="input_tokens" name="Input" stackId="1" stroke="#5e6ad2" fill="#5e6ad2" fillOpacity={0.3} />
        <Area type="monotone" dataKey="output_tokens" name="Output" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
