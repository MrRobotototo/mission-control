import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [{ data: usage, error: usageErr }, { data: projects, error: projErr }] = await Promise.all([
    supabase.from('token_usage').select('project_id, task_id, input_tokens, output_tokens, cost_usd'),
    supabase.from('projects').select('id, name'),
  ])

  if (usageErr || projErr) {
    return NextResponse.json({ error: (usageErr || projErr)?.message }, { status: 500 })
  }

  const projMap = new Map((projects || []).map(p => [p.id, p.name]))

  const byProject: Record<string, { project_id: string; name: string; total_tokens: number; total_cost: number; task_ids: Set<string> }> = {}

  for (const r of usage || []) {
    if (!byProject[r.project_id]) {
      byProject[r.project_id] = {
        project_id: r.project_id,
        name: projMap.get(r.project_id) || 'Unknown',
        total_tokens: 0,
        total_cost: 0,
        task_ids: new Set(),
      }
    }
    byProject[r.project_id].total_tokens += (r.input_tokens || 0) + (r.output_tokens || 0)
    byProject[r.project_id].total_cost += r.cost_usd || 0
    if (r.task_id) byProject[r.project_id].task_ids.add(r.task_id)
  }

  const result = Object.values(byProject)
    .map(p => ({ project_id: p.project_id, name: p.name, total_tokens: p.total_tokens, total_cost: p.total_cost, tasks_count: p.task_ids.size }))
    .sort((a, b) => b.total_cost - a.total_cost)

  return NextResponse.json(result)
}
