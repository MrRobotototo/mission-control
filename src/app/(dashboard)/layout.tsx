import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Sidebar />
      <main className="ml-60">
        {children}
      </main>
    </div>
  )
}
