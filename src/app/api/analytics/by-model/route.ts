import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: usage, error } = await supabase
    .from('token_usage')
    .select('model, input_tokens, output_tokens, cost_usd')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const byModel: Record<string, { model: string; total_tokens: number; total_cost: number }> = {}

  for (const r of usage || []) {
    const model = r.model || 'unknown'
    if (!byModel[model]) {
      byModel[model] = { model, total_tokens: 0, total_cost: 0 }
    }
    byModel[model].total_tokens += (r.input_tokens || 0) + (r.output_tokens || 0)
    byModel[model].total_cost += r.cost_usd || 0
  }

  return NextResponse.json(Object.values(byModel))
}
