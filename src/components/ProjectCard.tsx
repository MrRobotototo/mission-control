import Link from 'next/link'
import { Project } from '@/types'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20',
    paused: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20',
    completed: 'bg-[#5e6ad2]/10 text-[#5e6ad2] border-[#5e6ad2]/20',
    archived: 'bg-[#a0a0a0]/10 text-[#a0a0a0] border-[#a0a0a0]/20',
  }

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#5e6ad2]/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-[#e5e5e5] group-hover:text-[#5e6ad2] transition-colors">
            {project.name}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded border ${
              statusColors[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>
        
        {project.description && (
          <p className="text-sm text-[#a0a0a0] mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="text-xs text-[#a0a0a0]">
          Created {formatDate(project.created_at)}
        </div>
      </div>
    </Link>
  )
}
