'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="text-[#a0a0a0]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      <Sidebar />
      <main className="flex-1 ml-60 overflow-y-auto">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
