'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TaskMessage } from '@/types'
import { formatDateTime } from '@/lib/utils'

interface ChatPanelProps {
  taskId: string
}

export default function ChatPanel({ taskId }: ChatPanelProps) {
  const [messages, setMessages] = useState<TaskMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [agentTyping, setAgentTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchMessages()

    // Subscribe to real-time messages
    const supabase = createClient()
    const channel = supabase
      .channel(`task-messages-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_messages',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          const newMessage = payload.new as TaskMessage
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev
            return [...prev, newMessage]
          })
          if (newMessage.sender === 'agent') {
            setAgentTyping(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [taskId])

  useEffect(() => {
    scrollToBottom()
  }, [messages, agentTyping])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/messages`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    const text = input.trim()
    setInput('')
    setSending(true)
    setAgentTyping(true)

    // Optimistic update
    const optimistic: TaskMessage = {
      id: `temp-${Date.now()}`,
      task_id: taskId,
      sender: 'oscar',
      message: text,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      const res = await fetch(`/api/tasks/${taskId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sender: 'oscar' }),
      })
      const saved = await res.json()
      // Replace optimistic with real
      setMessages((prev) => prev.map(m => m.id === optimistic.id ? saved : m))
    } catch (error) {
      console.error('Error sending message:', error)
      setAgentTyping(false)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center gap-2">
        <span className="text-lg">💬</span>
        <h3 className="text-sm font-semibold text-[#e5e5e5]">Agent Chat</h3>
        <span className="text-xs text-[#a0a0a0] ml-auto">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {loading ? (
          <div className="text-center text-[#a0a0a0] text-sm py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#a0a0a0] text-sm py-8">
            No messages yet. Start a conversation with the agent.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'oscar' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.sender === 'oscar'
                    ? 'bg-[#5e6ad2] text-white'
                    : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#e5e5e5]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium opacity-70">
                    {msg.sender === 'oscar' ? 'You' : '🤖 Agent'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                <span className="text-[10px] opacity-50 mt-1 block">
                  {formatDateTime(msg.created_at)}
                </span>
              </div>
            </div>
          ))
        )}

        {agentTyping && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#a0a0a0]">🤖 Agent is typing</span>
                <span className="animate-pulse text-[#a0a0a0]">...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#2a2a2a] flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message the agent..."
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#e5e5e5] placeholder-[#666] focus:outline-none focus:ring-1 focus:ring-[#5e6ad2]"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="px-4 py-2 bg-[#5e6ad2] text-white rounded-lg text-sm font-medium hover:bg-[#4f5bc4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}
