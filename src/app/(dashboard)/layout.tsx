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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div style={{ color: '#6B6B6B' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <Sidebar />
      <main className="flex-1 ml-[200px] min-h-screen">
        {children}
      </main>
    </div>
  )
}
