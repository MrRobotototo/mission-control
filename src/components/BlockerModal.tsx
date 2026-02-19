'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'

interface BlockerModalProps {
  task: Task
  onClose: () => void
  onUnblock: (taskId: string) => void
  onNavigate: (taskId: string) => void
}

export default function BlockerModal({ task, onClose, onUnblock, onNavigate }: BlockerModalProps) {
  const [blockerTask, setBlockerTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (task.blocked_by) {
      fetch(`/api/tasks/${task.blocked_by}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setBlockerTask(data)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [task.blocked_by])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#ef4444] flex items-center gap-2">
            🚫 This task is blocked
          </h2>
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-[#e5e5e5] text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Blocker task info */}
          <div className="p-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg">
            <span className="text-xs text-[#a0a0a0] block mb-1">Blocked by</span>
            {loading ? (
              <span className="text-sm text-[#666]">Loading...</span>
            ) : blockerTask ? (
              <span className="text-sm font-medium text-[#e5e5e5]">{blockerTask.title}</span>
            ) : (
              <span className="text-sm text-[#666]">Unknown task (may have been deleted)</span>
            )}
          </div>

          {/* Reason */}
          {task.blocker_reason && (
            <div className="p-3 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg">
              <span className="text-xs text-[#a0a0a0] block mb-1">Reason</span>
              <p className="text-sm text-[#e5e5e5]">{task.blocker_reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {blockerTask && (
              <button
                onClick={() => onNavigate(blockerTask.id)}
                className="flex-1 px-4 py-2 bg-[#2a2a2a] text-[#e5e5e5] rounded-lg text-sm font-medium hover:bg-[#3a3a3a] transition-all"
              >
                View blocker task →
              </button>
            )}
            <button
              onClick={() => onUnblock(task.id)}
              className="flex-1 px-4 py-2 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-lg text-sm font-medium hover:bg-[#22c55e]/20 transition-all"
            >
              Mark as unblocked
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
