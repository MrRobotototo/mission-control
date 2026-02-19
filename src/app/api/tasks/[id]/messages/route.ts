import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: messages, error } = await supabase
    .from('task_messages')
    .select('*')
    .eq('task_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(messages)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  const { data: message, error } = await supabase
    .from('task_messages')
    .insert([{
      task_id: id,
      sender: body.sender || 'oscar',
      message: body.message,
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Mock agent response after inserting user message
  if (body.sender !== 'agent') {
    setTimeout(async () => {
      const responses = [
        "Thanks for the message! I'm reviewing this task now. Full agent integration will be added in a future update.",
        "Got it! I'll look into this. This is a placeholder response — real agent integration coming soon.",
        "Understood. I've noted your instructions. (Mock response — agent webhook integration pending.)",
        "Acknowledged! Working on it. This is a simulated agent response for now.",
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      
      await supabase
        .from('task_messages')
        .insert([{
          task_id: id,
          sender: 'agent',
          message: response,
        }])
    }, 2000 + Math.random() * 1000)
  }

  return NextResponse.json(message)
}
