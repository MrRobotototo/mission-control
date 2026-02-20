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
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] border border-[#222222] rounded-2xl p-6 w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#EF4444] flex items-center gap-2">
            🚫 This task is blocked
          </h2>
          <button
            onClick={onClose}
            className="text-[#A1A1A1] hover:text-white text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Blocker task info */}
          <div className="p-4 bg-[#0A0A0A] border border-[#222222] rounded-xl">
            <span className="text-xs text-[#A1A1A1] block mb-1">Blocked by</span>
            {loading ? (
              <span className="text-sm text-[#6B6B6B]">Loading...</span>
            ) : blockerTask ? (
              <span className="text-sm font-medium text-white">{blockerTask.title}</span>
            ) : (
              <span className="text-sm text-[#6B6B6B]">Unknown task (may have been deleted)</span>
            )}
          </div>

          {/* Reason */}
          {task.blocker_reason && (
            <div className="p-4 bg-[#0A0A0A] border border-[#222222] rounded-xl">
              <span className="text-xs text-[#A1A1A1] block mb-1">Reason</span>
              <p className="text-sm text-white">{task.blocker_reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {blockerTask && (
              <button
                onClick={() => onNavigate(blockerTask.id)}
                className="flex-1 px-4 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-medium hover:bg-[#222222] transition-all"
              >
                View blocker task →
              </button>
            )}
            <button
              onClick={() => onUnblock(task.id)}
              className="flex-1 px-4 py-2.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-xl text-sm font-medium hover:bg-[#10B981]/20 transition-all"
            >
              Mark as unblocked
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
