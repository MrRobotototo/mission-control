import { Task } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onClick?: () => void
}

export default function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  const statusColors = {
    'todo': 'bg-[#a0a0a0]/10 text-[#a0a0a0] border-[#a0a0a0]/20',
    'in-progress': 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20',
    'blocked': 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    'review': 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    'done': 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
  }

  const priorityColors = {
    'low': 'text-[#a0a0a0]',
    'medium': 'text-[#5e6ad2]',
    'high': 'text-[#f59e0b]',
    'urgent': 'text-[#ef4444]',
  }

  return (
    <div
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#5e6ad2]/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-[#e5e5e5] group-hover:text-[#5e6ad2] transition-colors flex-1">
          {task.title}
        </h3>
        <select
          value={task.status}
          onChange={(e) => {
            e.stopPropagation()
            onStatusChange(task.id, e.target.value as Task['status'])
          }}
          className={`px-2 py-1 text-xs font-medium rounded border ${
            statusColors[task.status]
          } bg-transparent cursor-pointer`}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>
      </div>

      {task.description && (
        <p className="text-xs text-[#a0a0a0] mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-medium ${priorityColors[task.priority]}`}>
            {task.priority.toUpperCase()}
          </span>
          <span className="text-[#a0a0a0]">
            {task.agent_id}
          </span>
          {task.assigned_to && (
            <span className="text-[#a0a0a0]">
              → {task.assigned_to}
            </span>
          )}
        </div>
        <span className="text-[#a0a0a0]">
          {formatDateTime(task.created_at)}
        </span>
      </div>

      {task.status === 'blocked' && task.blocker_reason && (
        <div className="mt-3 p-2 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded text-xs text-[#ef4444]">
          🚫 {task.blocker_reason}
        </div>
      )}
    </div>
  )
}
