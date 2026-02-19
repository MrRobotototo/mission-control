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
    online: 'bg-[#10B981]',
    offline: 'bg-[#6B6B6B]',
    busy: 'bg-[#F59E0B]',
  }

  return (
    <aside 
      className="w-[200px] h-screen bg-[#111111] border-r border-[#222222] fixed left-0 top-0 flex flex-col"
      style={{ zIndex: 50 }}
    >
      {/* Header */}
      <div className="px-5 py-6 border-b border-[#222222]">
        <h1 className="text-lg font-semibold text-white tracking-tight">Mission Control</h1>
        <p className="text-[11px] text-[#6B6B6B] mt-1">AI Project Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-lg mb-1 
                transition-all duration-200
                ${isActive 
                  ? 'bg-[#1A1A1A] text-white border-l-2 border-[#6366F1] pl-[10px]' 
                  : 'text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-white border-l-2 border-transparent pl-[10px]'
                }
              `}
            >
              <span className="text-base">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          )
        })}

        {/* Agents Section */}
        {agents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#222222]">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                Agents
              </span>
            </div>
            {agents.map((agent) => {
              const isActive = pathname === `/agents/${agent.id}`
              return (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className={`
                    group flex items-center gap-3 px-3 py-2 rounded-lg mb-1 
                    transition-all duration-200 relative
                    ${isActive 
                      ? 'bg-[#1A1A1A] text-white border-l-2 border-[#6366F1] pl-[10px]' 
                      : 'text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-white border-l-2 border-transparent pl-[10px]'
                    }
                  `}
                >
                  <span className="text-base">{agent.emoji}</span>
                  <span className="text-sm font-medium flex-1">{agent.name}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${statusColors[agent.status]} ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}
                  />
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#222222]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#A1A1A1] hover:bg-[#1A1A1A] hover:text-white transition-all text-sm"
        >
          <span className="text-base">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
