import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data: project, error } = await supabase
    .from('projects')
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log activity
  await supabase.from('activity_log').insert([
    {
      project_id: project.id,
      action: 'created',
      description: `Project "${project.name}" was created`,
    },
  ])

  return NextResponse.json(project)
}
