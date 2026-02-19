import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: usage, error } = await supabase
    .from('token_usage')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!usage || usage.length === 0) {
    return NextResponse.json({
      total_tokens: 0,
      total_input: 0,
      total_output: 0,
      total_cost: 0,
      this_month_tokens: 0,
      this_month_cost: 0,
      avg_tokens_per_task: 0,
      record_count: 0,
    })
  }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const totalInput = usage.reduce((s, r) => s + (r.input_tokens || 0), 0)
  const totalOutput = usage.reduce((s, r) => s + (r.output_tokens || 0), 0)
  const totalCost = usage.reduce((s, r) => s + (r.cost_usd || 0), 0)

  const thisMonth = usage.filter(r => r.timestamp >= monthStart)
  const thisMonthTokens = thisMonth.reduce((s, r) => s + (r.input_tokens || 0) + (r.output_tokens || 0), 0)
  const thisMonthCost = thisMonth.reduce((s, r) => s + (r.cost_usd || 0), 0)

  const taskIds = new Set(usage.map(r => r.task_id).filter(Boolean))
  const avgTokensPerTask = taskIds.size > 0 ? Math.round((totalInput + totalOutput) / taskIds.size) : 0

  return NextResponse.json({
    total_tokens: totalInput + totalOutput,
    total_input: totalInput,
    total_output: totalOutput,
    total_cost: totalCost,
    this_month_tokens: thisMonthTokens,
    this_month_cost: thisMonthCost,
    avg_tokens_per_task: avgTokensPerTask,
    record_count: usage.length,
  })
}
