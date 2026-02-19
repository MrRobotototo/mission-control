'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types'
import { formatDateTime } from '@/lib/utils'
import ChatPanel from '@/components/chat/ChatPanel'
import BlockerModal from '@/components/BlockerModal'

interface TokenData {
  total_tokens: number
  total_input: number
  total_output: number
  total_cost: number
  history: Array<{
    id: string
    model: string
    input_tokens: number
    output_tokens: number
    cost_usd: number
    timestamp: string
  }>
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [tokens, setTokens] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBlockerModal, setShowBlockerModal] = useState(false)
  const [showChat, setShowChat] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/tasks/${id}`).then(r => r.json()),
      fetch(`/api/tasks/${id}/tokens`).then(r => r.json()),
    ]).then(([taskData, tokenData]) => {
      setTask(taskData?.error ? null : taskData)
      setTokens(tokenData?.error ? null : tokenData)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id])

  const handleUnblock = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked_by: null, blocker_reason: null, status: 'todo' }),
      })
      const updated = await res.json()
      setTask(updated)
      setShowBlockerModal(false)
    } catch (error) {
      console.error('Error unblocking task:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="text-[#a0a0a0]">Loading task...</div></div>
  }

  if (!task) {
    return <div className="flex items-center justify-center h-screen"><div className="text-[#ef4444]">Task not found</div></div>
  }

  const statusColors: Record<string, string> = {
    'todo': 'bg-[#a0a0a0]/10 text-[#a0a0a0] border-[#a0a0a0]/20',
    'in-progress': 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20',
    'blocked': 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20',
    'review': 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    'done': 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#a0a0a0] hover:text-[#e5e5e5] mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#e5e5e5] mb-2">{task.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[task.status]}`}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-[#a0a0a0]">Agent: {task.agent_id}</span>
                <span className="text-xs text-[#a0a0a0]">Created: {formatDateTime(task.created_at)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showChat ? 'bg-[#5e6ad2] text-white' : 'bg-[#2a2a2a] text-[#a0a0a0] hover:bg-[#3a3a3a]'
              }`}
            >
              💬 Chat
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Left: Task details */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Description */}
            {task.description && (
              <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <h3 className="text-sm font-semibold text-[#e5e5e5] mb-2">Description</h3>
                <p className="text-sm text-[#a0a0a0] whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Blocker info */}
            {task.status === 'blocked' && task.blocked_by && (
              <div
                className="p-4 bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-lg cursor-pointer hover:bg-[#ef4444]/10 transition-all"
                onClick={() => setShowBlockerModal(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#ef4444]">🚫 Blocked</span>
                  {task.blocker_reason && (
                    <span className="text-xs text-[#ef4444]/70">— {task.blocker_reason}</span>
                  )}
                  <span className="text-xs text-[#ef4444]/50 ml-auto">Click for details</span>
                </div>
              </div>
            )}

            {/* Token Usage */}
            {tokens && tokens.total_tokens > 0 && (
              <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3">📊 Token Usage</h3>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="p-2 bg-[#0d0d0d] rounded">
                    <span className="text-xs text-[#a0a0a0] block">Total Tokens</span>
                    <span className="text-sm font-semibold text-[#e5e5e5]">{tokens.total_tokens.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#0d0d0d] rounded">
                    <span className="text-xs text-[#a0a0a0] block">Input / Output</span>
                    <span className="text-sm font-semibold text-[#e5e5e5]">{tokens.total_input.toLocaleString()} / {tokens.total_output.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-[#0d0d0d] rounded">
                    <span className="text-xs text-[#a0a0a0] block">Cost</span>
                    <span className="text-sm font-semibold text-[#22c55e]">${tokens.total_cost.toFixed(4)}</span>
                  </div>
                </div>

                {/* History */}
                {tokens.history.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-[#a0a0a0]">History</span>
                    {tokens.history.slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-center justify-between text-xs py-1 border-t border-[#2a2a2a]">
                        <span className="text-[#a0a0a0]">{h.model}</span>
                        <span className="text-[#e5e5e5]">{(h.input_tokens + h.output_tokens).toLocaleString()} tokens</span>
                        <span className="text-[#22c55e]">${h.cost_usd.toFixed(4)}</span>
                        <span className="text-[#666]">{formatDateTime(h.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Chat panel */}
          {showChat && (
            <div className="w-96 flex-shrink-0">
              <ChatPanel taskId={id} />
            </div>
          )}
        </div>
      </div>

      {/* Blocker Modal */}
      {showBlockerModal && (
        <BlockerModal
          task={task}
          onClose={() => setShowBlockerModal(false)}
          onUnblock={handleUnblock}
          onNavigate={(taskId) => router.push(`/tasks/${taskId}`)}
        />
      )}
    </div>
  )
}
