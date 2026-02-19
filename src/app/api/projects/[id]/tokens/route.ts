import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: usage, error } = await supabase
    .from('token_usage')
    .select('input_tokens, output_tokens, cost_usd, model')
    .eq('project_id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const totalInput = (usage || []).reduce((s, r) => s + (r.input_tokens || 0), 0)
  const totalOutput = (usage || []).reduce((s, r) => s + (r.output_tokens || 0), 0)
  const totalCost = (usage || []).reduce((s, r) => s + (r.cost_usd || 0), 0)

  const byModel: Record<string, number> = {}
  for (const r of usage || []) {
    const m = r.model || 'unknown'
    byModel[m] = (byModel[m] || 0) + (r.cost_usd || 0)
  }

  return NextResponse.json({
    total_tokens: totalInput + totalOutput,
    total_input: totalInput,
    total_output: totalOutput,
    total_cost: totalCost,
    by_model: byModel,
    record_count: (usage || []).length,
  })
}
