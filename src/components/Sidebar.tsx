'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/', label: 'Projects', icon: '📋' },
    { href: '/agents', label: 'Agents', icon: '🤖' },
  ]

  return (
    <div className="w-60 h-screen bg-[#1a1a1a] border-r border-[#2a2a2a] fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-[#e5e5e5]">Mission Control</h1>
        <p className="text-xs text-[#a0a0a0] mt-1">AI Project Management</p>
      </div>

      <nav className="flex-1 px-3">
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
