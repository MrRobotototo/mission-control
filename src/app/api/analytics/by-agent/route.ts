import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: usage, error } = await supabase
    .from('token_usage')
    .select('agent_id, input_tokens, output_tokens, cost_usd')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

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
