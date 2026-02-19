import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: usage, error } = await supabase
    .from('token_usage')
    .select('input_tokens, output_tokens, cost_usd, timestamp')
    .gte('timestamp', thirtyDaysAgo.toISOString())
    .order('timestamp', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const byDay: Record<string, { date: string; input_tokens: number; output_tokens: number; cost: number }> = {}

  for (const r of usage || []) {
    const date = r.timestamp.split('T')[0]
    if (!byDay[date]) {
      byDay[date] = { date, input_tokens: 0, output_tokens: 0, cost: 0 }
    }
    byDay[date].input_tokens += r.input_tokens || 0
    byDay[date].output_tokens += r.output_tokens || 0
    byDay[date].cost += r.cost_usd || 0
  }

  return NextResponse.json(Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)))
}
