// Run: npx tsx src/scripts/seed-tokens.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kiaoxycsarrogxtdpbba.supabase.co',
  'sb_publishable_EcK238SsKixRpk5xXJFEoA_75ESff6T'
)

async function seed() {
  // Get existing projects and tasks
  const { data: projects } = await supabase.from('projects').select('id')
  const { data: tasks } = await supabase.from('tasks').select('id, project_id, agent_id')

  if (!projects?.length || !tasks?.length) {
    console.log('No projects/tasks found. Create some first.')
    return
  }

  const models = ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'kimi-k2', 'gpt-4o', 'gemini-2.5-pro']
  const agents = ['claw', 'dwight']

  const records = []
  const now = Date.now()

  for (let i = 0; i < 80; i++) {
    const task = tasks[Math.floor(Math.random() * tasks.length)]
    const daysAgo = Math.floor(Math.random() * 30)
    const timestamp = new Date(now - daysAgo * 86400000 - Math.random() * 86400000).toISOString()
    const inputTokens = Math.floor(1000 + Math.random() * 49000)
    const outputTokens = Math.floor(500 + Math.random() * 20000)
    const model = models[Math.floor(Math.random() * models.length)]

    // Rough cost calculation
    const inputCost = model.includes('opus') ? inputTokens * 0.000015 : inputTokens * 0.000003
    const outputCost = model.includes('opus') ? outputTokens * 0.000075 : outputTokens * 0.000015

    records.push({
      project_id: task.project_id,
      task_id: task.id,
      agent_id: task.agent_id || agents[Math.floor(Math.random() * agents.length)],
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost_usd: Math.round((inputCost + outputCost) * 10000) / 10000,
      timestamp,
    })
  }

  const { error } = await supabase.from('token_usage').insert(records)
  if (error) {
    console.error('Error seeding:', error.message)
  } else {
    console.log(`Seeded ${records.length} token_usage records`)
  }
}

seed()
