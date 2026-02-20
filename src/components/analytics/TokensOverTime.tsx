'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: Array<{ date: string; input_tokens: number; output_tokens: number }>
}

export default function TokensOverTimeChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
        <XAxis dataKey="date" tick={{ fill: '#A1A1A1', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis tick={{ fill: '#A1A1A1', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#111111',
            border: '1px solid #222222',
            borderRadius: 12,
            fontSize: 12,
            color: '#FFFFFF',
          }}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="input_tokens" name="Input" stackId="1" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
        <Area type="monotone" dataKey="output_tokens" name="Output" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
