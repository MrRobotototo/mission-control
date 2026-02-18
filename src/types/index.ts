export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type AgentStatus = 'online' | 'offline' | 'busy'
export type ActivityAction = 'created' | 'updated' | 'completed' | 'commented' | 'status_changed' | 'assigned'

export interface Project {
  id: string
  name: string
  description: string | null
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  agent_id: string
  assigned_to: string | null
  blocked_by: string | null
  blocker_reason: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface TaskMessage {
  id: string
  task_id: string
  sender: string
  message: string
  created_at: string
}

export interface TokenUsage {
  id: string
  project_id: string
  task_id: string | null
  agent_id: string
  model: string
  input_tokens: number
  output_tokens: number
  cost_usd: number
  timestamp: string
}

export interface Agent {
  id: string
  name: string
  emoji: string | null
  description: string | null
  default_model: string | null
  status: AgentStatus
  created_at: string
}

export interface ActivityLog {
  id: string
  project_id: string
  task_id: string | null
  agent_id: string | null
  action: ActivityAction
  description: string | null
  metadata: Record<string, any> | null
  created_at: string
}
