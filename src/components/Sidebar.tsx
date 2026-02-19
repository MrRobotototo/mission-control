'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Agent } from '@/types'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/', label: 'Projects', icon: '📋' },
    { href: '/agents', label: 'Agents', icon: '🤖' },
    { href: '/analytics', label: 'Analytics', icon: '📊' },
  ]

  const statusColors = {
    online: 'bg-[#22c55e]',
    offline: 'bg-[#a0a0a0]',
    busy: 'bg-[#f59e0b]',
  }

  return (
    <div className="w-60 h-screen bg-[#1a1a1a] border-r border-[#2a2a2a] fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-[#e5e5e5]">Mission Control</h1>
        <p className="text-xs text-[#a0a0a0] mt-1">AI Project Management</p>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-[#2a2a2a] text-[#e5e5e5]'
                  : 'text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#e5e5e5]'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          )
        })}

        {/* Agents Section */}
        {agents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <div className="px-3 mb-2">
              <span className="text-xs font-semibold text-[#6a6a6a] uppercase tracking-wider">
                Agents
              </span>
            </div>
            {agents.map((agent) => {
              const isActive = pathname === `/agents/${agent.id}`
              return (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all group ${
                    isActive
                      ? 'bg-[#2a2a2a] text-[#e5e5e5]'
                      : 'text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#e5e5e5]'
                  }`}
                >
                  <span className="text-lg">{agent.emoji}</span>
                  <span className="text-sm font-medium flex-1">{agent.name}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${statusColors[agent.status]} ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}
                  />
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-[#2a2a2a]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#a0a0a0] hover:bg-[#2a2a2a] hover:text-[#e5e5e5] transition-all text-sm"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
