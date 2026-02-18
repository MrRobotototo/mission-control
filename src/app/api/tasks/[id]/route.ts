import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: task, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(task)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  // If status is being changed to 'done', set completed_at
  if (body.status === 'done' && !body.completed_at) {
    body.completed_at = new Date().toISOString()
  }

  const { data: task, error } = await supabase
    .from('tasks')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log activity
  let action = 'updated'
  let description = `Task "${task.title}" was updated`

  if (body.status === 'done') {
    action = 'completed'
    description = `Task "${task.title}" was completed`
  } else if (body.status) {
    action = 'status_changed'
    description = `Task "${task.title}" status changed to ${body.status}`
  }

  await supabase.from('activity_log').insert([
    {
      project_id: task.project_id,
      task_id: task.id,
      agent_id: task.agent_id,
      action,
      description,
      metadata: body,
    },
  ])

  return NextResponse.json(task)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
