import Link from 'next/link'
import { Project } from '@/types'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = {
    active: {
      className: 'bg-[rgba(16,185,129,0.1)] text-[#10B981] border-[rgba(16,185,129,0.2)]',
      label: 'Active',
      icon: '●'
    },
    paused: {
      className: 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[rgba(245,158,11,0.2)]',
      label: 'Paused',
      icon: '⏸'
    },
    completed: {
      className: 'bg-[rgba(99,102,241,0.1)] text-[#6366F1] border-[rgba(99,102,241,0.2)]',
      label: 'Completed',
      icon: '✓'
    },
    archived: {
      className: 'bg-[rgba(107,107,107,0.1)] text-[#6B6B6B] border-[rgba(107,107,107,0.2)]',
      label: 'Archived',
      icon: '📦'
    },
  }

  const status = statusConfig[project.status]

  return (
    <Link href={`/projects/${project.id}`}>
      <div 
        className="h-full flex flex-col rounded-2xl p-6 cursor-pointer group transition-all duration-200"
        style={{
          backgroundColor: '#111111',
          border: '1px solid #222222'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.borderColor = '#6366F1'
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(99, 102, 241, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = '#222222'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 
            className="font-semibold flex-1 pr-3 transition-colors duration-200 group-hover:text-[#6366F1]"
            style={{ 
              color: 'white',
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            {project.name}
          </h3>
          <span
            className={`px-3 py-1.5 text-xs font-medium rounded-full border flex items-center gap-1.5 shrink-0 ${status.className}`}
          >
            <span style={{ fontSize: '8px' }}>{status.icon}</span>
            {status.label}
          </span>
        </div>
        
        {project.description ? (
          <p 
            className="mb-4 flex-1 line-clamp-3"
            style={{ 
              fontSize: '13px',
              color: '#A1A1A1',
              lineHeight: '1.6'
            }}
          >
            {project.description}
          </p>
        ) : (
          <p 
            className="mb-4 flex-1 italic"
            style={{ 
              fontSize: '13px',
              color: '#6B6B6B'
            }}
          >
            No description
          </p>
        )}
        
        <div 
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: '1px solid #222222' }}
        >
          <div style={{ fontSize: '12px', color: '#6B6B6B' }}>
            Created {formatDate(project.created_at)}
          </div>
          <div 
            className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ fontSize: '12px', color: '#6366F1' }}
          >
            View →
          </div>
        </div>
      </div>
    </Link>
  )
}
