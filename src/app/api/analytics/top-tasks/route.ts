import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [{ data: usage, error: usageErr }, { data: tasks, error: taskErr }, { data: projects }] = await Promise.all([
    supabase.from('token_usage').select('task_id, project_id, agent_id, input_tokens, output_tokens, cost_usd'),
    supabase.from('tasks').select('id, title, project_id'),
    supabase.from('projects').select('id, name'),
  ])

  if (usageErr || taskErr) {
    return NextResponse.json({ error: (usageErr || taskErr)?.message }, { status: 500 })
  }

  const taskMap = new Map((tasks || []).map(t => [t.id, t]))
  const projMap = new Map((projects || []).map(p => [p.id, p.name]))

  const byTask: Record<string, { task_id: string; title: string; project_name: string; project_id: string; agent_id: string; total_tokens: number; total_cost: number }> = {}

  for (const r of usage || []) {
    if (!r.task_id) continue
    if (!byTask[r.task_id]) {
      const task = taskMap.get(r.task_id)
      byTask[r.task_id] = {
        task_id: r.task_id,
        title: task?.title || 'Unknown Task',
        project_name: projMap.get(r.project_id) || 'Unknown',
        project_id: r.project_id,
        agent_id: r.agent_id,
        total_tokens: 0,
        total_cost: 0,
      }
    }
    byTask[r.task_id].total_tokens += (r.input_tokens || 0) + (r.output_tokens || 0)
    byTask[r.task_id].total_cost += r.cost_usd || 0
  }

  const result = Object.values(byTask).sort((a, b) => b.total_cost - a.total_cost).slice(0, 20)

  return NextResponse.json(result)
}
