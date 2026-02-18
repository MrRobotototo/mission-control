import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  const agentId = searchParams.get('agent_id')

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  const { data: tasks, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data: task, error } = await supabase
    .from('tasks')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log activity
  await supabase.from('activity_log').insert([
    {
      project_id: task.project_id,
      task_id: task.id,
      agent_id: task.agent_id,
      action: 'created',
      description: `Task "${task.title}" was created`,
    },
  ])

  return NextResponse.json(task)
}
