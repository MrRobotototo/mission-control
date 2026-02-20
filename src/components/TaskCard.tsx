'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types'
import { formatDateTime } from '@/lib/utils'
import BlockerModal from '@/components/BlockerModal'

interface TaskCardProps {
  task: Task
  onStatusChange: (taskId: string, status: Task['status']) => void
  onClick?: () => void
}

export default function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  const router = useRouter()
  const [showBlockerModal, setShowBlockerModal] = useState(false)

  const statusColors: Record<string, string> = {
    'todo': 'bg-[#A1A1A1]/10 text-[#A1A1A1] border-[#A1A1A1]/20',
    'in-progress': 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20',
    'blocked': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    'review': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    'done': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  }

  const priorityColors: Record<string, string> = {
    'low': 'text-[#A1A1A1]',
    'medium': 'text-[#6366F1]',
    'high': 'text-[#F59E0B]',
    'urgent': 'text-[#EF4444]',
  }

  const handleUnblock = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocked_by: null, blocker_reason: null, status: 'todo' }),
    })
    onStatusChange(taskId, 'todo')
    setShowBlockerModal(false)
  }

  return (
    <>
      <div
        className="bg-[#111111] border border-[#222222] rounded-xl p-4 hover:border-[#6366F1]/50 transition-all cursor-pointer group"
        onClick={() => router.push(`/tasks/${task.id}`)}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-medium text-white group-hover:text-[#6366F1] transition-colors flex-1">
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
          <p className="text-xs text-[#A1A1A1] mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Blocker badge */}
        {task.status === 'blocked' && task.blocked_by && (
          <button
            className="mb-3 px-2 py-1 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded text-xs text-[#EF4444] font-medium hover:bg-[#EF4444]/20 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              setShowBlockerModal(true)
            }}
          >
            🚫 Blocked — Click for details
          </button>
        )}

        {task.status === 'blocked' && !task.blocked_by && task.blocker_reason && (
          <div className="mb-3 p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded text-xs text-[#EF4444]">
            🚫 {task.blocker_reason}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className={`font-medium ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
            <span className="text-[#A1A1A1]">
              {task.agent_id}
            </span>
            {task.assigned_to && (
              <span className="text-[#A1A1A1]">
                → {task.assigned_to}
              </span>
            )}
          </div>
          <span className="text-[#6B6B6B]">
            {formatDateTime(task.created_at)}
          </span>
        </div>
      </div>

      {showBlockerModal && (
        <BlockerModal
          task={task}
          onClose={() => setShowBlockerModal(false)}
          onUnblock={handleUnblock}
          onNavigate={(taskId) => router.push(`/tasks/${taskId}`)}
        />
      )}
    </>
  )
}
