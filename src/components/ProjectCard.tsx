import Link from 'next/link'
import { Project } from '@/types'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = {
    active: {
      className: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      label: 'Active',
      icon: '●'
    },
    paused: {
      className: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      label: 'Paused',
      icon: '⏸'
    },
    completed: {
      className: 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20',
      label: 'Completed',
      icon: '✓'
    },
    archived: {
      className: 'bg-[#6B6B6B]/10 text-[#6B6B6B] border-[#6B6B6B]/20',
      label: 'Archived',
      icon: '📦'
    },
  }

  const status = statusConfig[project.status]

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="h-full flex flex-col rounded-2xl p-6 cursor-pointer group transition-all duration-200 bg-[#111111] border border-[#222222] hover:border-[#6366F1] hover:shadow-[0_10px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white leading-snug flex-1 pr-3 transition-colors duration-200 group-hover:text-[#6366F1]">
            {project.name}
          </h3>
          <span
            className={`px-3 py-1.5 text-xs font-medium rounded-full border flex items-center gap-1.5 shrink-0 ${status.className}`}
          >
            <span className="text-[8px]">{status.icon}</span>
            {status.label}
          </span>
        </div>
        
        {project.description ? (
          <p className="text-[13px] text-[#A1A1A1] leading-relaxed mb-4 flex-1 line-clamp-3">
            {project.description}
          </p>
        ) : (
          <p className="text-[13px] text-[#6B6B6B] italic mb-4 flex-1">
            No description
          </p>
        )}
        
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#222222]">
          <div className="text-xs text-[#6B6B6B]">
            Created {formatDate(project.created_at)}
          </div>
          <div className="text-xs text-[#6366F1] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            View →
          </div>
        </div>
      </div>
    </Link>
  )
}
