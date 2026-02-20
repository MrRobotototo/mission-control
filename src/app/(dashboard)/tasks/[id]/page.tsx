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
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-[#6B6B6B]">Loading task...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
        <div className="text-center">
          <div className="emoji text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-white mb-2">Task not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#818CF8] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    'todo': 'bg-[#A1A1A1]/10 text-[#A1A1A1] border-[#A1A1A1]/20',
    'in-progress': 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20',
    'blocked': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    'review': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    'done': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="px-8 py-6 max-w-[1400px]">
          <button
            onClick={() => router.back()}
            className="text-sm text-[#A1A1A1] hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-white mb-2">{task.title}</h1>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded border ${statusColors[task.status]}`}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-[#A1A1A1]">Agent: {task.agent_id}</span>
                <span className="text-xs text-[#A1A1A1]">Created: {formatDateTime(task.created_at)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showChat
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-[#1A1A1A] text-[#A1A1A1] hover:bg-[#222222] hover:text-white'
              }`}
            >
              💬 Chat
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">
        <div className="flex gap-6 max-w-[1400px] min-h-[calc(100vh-200px)]">
          {/* Left: Task details */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Description */}
            {task.description && (
              <div className="p-6 bg-[#111111] border border-[#222222] rounded-2xl">
                <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
                <p className="text-sm text-[#A1A1A1] whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {/* Blocker info */}
            {task.status === 'blocked' && task.blocked_by && (
              <div
                className="p-6 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl cursor-pointer hover:bg-[#EF4444]/10 transition-all"
                onClick={() => setShowBlockerModal(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#EF4444]">🚫 Blocked</span>
                  {task.blocker_reason && (
                    <span className="text-xs text-[#EF4444]/70">— {task.blocker_reason}</span>
                  )}
                  <span className="text-xs text-[#EF4444]/50 ml-auto">Click for details</span>
                </div>
              </div>
            )}

            {/* Token Usage */}
            {tokens && tokens.total_tokens > 0 && (
              <div className="p-6 bg-[#111111] border border-[#222222] rounded-2xl">
                <h3 className="text-sm font-semibold text-white mb-4">
                  <span className="emoji mr-1">📊</span> Token Usage
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-[#0A0A0A] rounded-xl">
                    <span className="text-xs text-[#A1A1A1] block mb-1">Total Tokens</span>
                    <span className="text-sm font-semibold text-white">{tokens.total_tokens.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-xl">
                    <span className="text-xs text-[#A1A1A1] block mb-1">Input / Output</span>
                    <span className="text-sm font-semibold text-white">{tokens.total_input.toLocaleString()} / {tokens.total_output.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-xl">
                    <span className="text-xs text-[#A1A1A1] block mb-1">Cost</span>
                    <span className="text-sm font-semibold text-[#10B981]">${tokens.total_cost.toFixed(4)}</span>
                  </div>
                </div>

                {/* History */}
                {tokens.history.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-[#6B6B6B]">History</span>
                    {tokens.history.slice(0, 5).map((h) => (
                      <div key={h.id} className="flex items-center justify-between text-xs py-2 border-t border-[#222222]">
                        <span className="text-[#A1A1A1]">{h.model}</span>
                        <span className="text-white">{(h.input_tokens + h.output_tokens).toLocaleString()} tokens</span>
                        <span className="text-[#10B981]">${h.cost_usd.toFixed(4)}</span>
                        <span className="text-[#6B6B6B]">{formatDateTime(h.timestamp)}</span>
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
