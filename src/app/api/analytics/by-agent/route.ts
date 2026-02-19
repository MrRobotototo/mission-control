import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent_id')

  let query = supabase
    .from('token_usage')
    .select('agent_id, task_id, input_tokens, output_tokens, cost_usd')

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data: usage, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If requesting specific agent, return aggregated stats
  if (agentId) {
    const taskIds = new Set<string>()
    let totalTokens = 0
    let totalCost = 0

    for (const r of usage || []) {
      if (r.task_id) taskIds.add(r.task_id)
      totalTokens += (r.input_tokens || 0) + (r.output_tokens || 0)
      totalCost += r.cost_usd || 0
    }

    return NextResponse.json({
      agent_id: agentId,
      total_tokens: totalTokens,
      total_cost: totalCost,
      task_count: taskIds.size,
    })
  }

  // Otherwise return all agents grouped
  const byAgent: Record<string, { agent_id: string; total_tokens: number; total_cost: number }> = {}

  for (const r of usage || []) {
    if (!byAgent[r.agent_id]) {
      byAgent[r.agent_id] = { agent_id: r.agent_id, total_tokens: 0, total_cost: 0 }
    }
    byAgent[r.agent_id].total_tokens += (r.input_tokens || 0) + (r.output_tokens || 0)
    byAgent[r.agent_id].total_cost += r.cost_usd || 0
  }

  return NextResponse.json(Object.values(byAgent))
}
