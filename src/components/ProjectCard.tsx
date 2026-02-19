import Link from 'next/link'
import { Project } from '@/types'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = {
    active: {
      className: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
      label: 'Active',
      icon: '🟢'
    },
    paused: {
      className: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
      label: 'Paused',
      icon: '⏸️'
    },
    completed: {
      className: 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20',
      label: 'Completed',
      icon: '✅'
    },
    archived: {
      className: 'bg-[#a0a0a0]/10 text-[#a0a0a0] border-[#a0a0a0]/20',
      label: 'Archived',
      icon: '📦'
    },
  }

  const status = statusConfig[project.status]

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#5e6ad2]/50 hover:shadow-lg hover:shadow-[#5e6ad2]/5 transition-all cursor-pointer group h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#e5e5e5] group-hover:text-[#5e6ad2] transition-colors flex-1 pr-3">
            {project.name}
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-md border flex items-center gap-1.5 shrink-0 ${status.className}`}
          >
            <span className="text-[10px]">{status.icon}</span>
            {status.label}
          </span>
        </div>
        
        {project.description ? (
          <p className="text-sm text-[#a0a0a0] mb-4 line-clamp-3 flex-1">
            {project.description}
          </p>
        ) : (
          <p className="text-sm text-[#6a6a6a] italic mb-4 flex-1">
            No description
          </p>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a] mt-auto">
          <div className="text-xs text-[#6a6a6a]">
            Created {formatDate(project.created_at)}
          </div>
          <div className="text-xs text-[#5e6ad2] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </div>
        </div>
      </div>
    </Link>
  )
}
