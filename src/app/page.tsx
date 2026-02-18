"use client";

import { useState } from "react";
import { agents, tasks, activityLog, projects } from "@/data/mock";

const statusColor: Record<string, string> = {
  aktiv: "bg-green-500",
  vilar: "bg-zinc-500",
  upptagen: "bg-yellow-500",
};

const priorityConfig: Record<string, { dot: string; label: string }> = {
  hög: { dot: "bg-red-500", label: "Hög" },
  medium: { dot: "bg-yellow-500", label: "Medium" },
  låg: { dot: "bg-zinc-500", label: "Låg" },
};

const columns = [
  { key: "att-göra" as const, label: "Att göra", icon: "📋", color: "border-zinc-600" },
  { key: "pågår" as const, label: "Pågår", icon: "⚡", color: "border-blue-500" },
  { key: "granskning" as const, label: "Granskning", icon: "🔍", color: "border-yellow-500" },
  { key: "klart" as const, label: "Klart", icon: "✅", color: "border-green-500" },
];

function AgentBadge({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return null;
  return (
    <div className="flex items-center gap-1.5 bg-[#12121a] rounded-full pl-1 pr-2.5 py-0.5" title={`${agent.name} — ${agent.role}`}>
      <span className="w-6 h-6 rounded-full bg-[#27273a] flex items-center justify-center text-sm">{agent.avatar}</span>
      <span className="text-xs text-zinc-400">{agent.name}</span>
    </div>
  );
}

function TaskCard({ task }: { task: typeof tasks[0] }) {
  const isOverdue = new Date(task.deadline) < new Date("2026-02-18") && task.status !== "klart";
  return (
    <div className="bg-[#1a1a2e] border border-[#27273a] rounded-lg p-3.5 hover:border-indigo-500/40 transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <span className={`shrink-0 w-2 h-2 mt-1.5 rounded-full ${priorityConfig[task.priority].dot}`} title={priorityConfig[task.priority].label} />
      </div>
      <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.agents.map((id) => (
            <AgentBadge key={id} agentId={id} />
          ))}
        </div>
        <span className={`text-[10px] whitespace-nowrap ${isOverdue ? "text-red-400" : "text-zinc-600"}`}>
          {isOverdue ? "⚠ " : ""}{task.deadline.slice(5)}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState("Alla projekt");

  const filteredTasks = selectedProject === "Alla projekt"
    ? tasks
    : tasks.filter((t) => t.project === selectedProject);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#27273a] flex flex-col shrink-0 h-screen sticky top-0">
        <div className="px-5 py-4 border-b border-[#27273a] flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <h1 className="text-lg font-bold tracking-tight">Mission Control</h1>
        </div>

        {/* Agents */}
        <div className="px-4 py-4 border-b border-[#27273a] flex-shrink-0">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Agenter</h2>
          <div className="space-y-1.5">
            {agents.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#1a1a2e] transition-colors">
                <span className="w-8 h-8 rounded-full bg-[#27273a] flex items-center justify-center text-lg">{a.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-xs text-zinc-600">{a.emoji}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">{a.role}</span>
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor[a.status]}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Aktivitetslogg</h2>
          <div className="space-y-3">
            {activityLog.map((entry) => {
              const agent = agents.find((a) => a.id === entry.agentId);
              return (
                <div key={entry.id} className="flex gap-2.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-[#27273a] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {agent?.avatar || "?"}
                  </span>
                  <div>
                    <span className="text-indigo-400">{agent?.name}</span>
                    <span className="text-zinc-600 ml-1.5">{entry.timestamp.split(" ")[1]}</span>
                    <p className="text-zinc-500 mt-0.5">{entry.event}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System status */}
        <div className="px-5 py-3 border-t border-[#27273a] flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System online
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Project Filter Bar */}
        <div className="border-b border-[#27273a] px-6 py-3 flex items-center gap-2">
          {projects.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProject(p)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                selectedProject === p
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-[#27273a]"
              }`}
            >
              {p}
            </button>
          ))}
          <div className="ml-auto text-xs text-zinc-600">
            {filteredTasks.length} uppgifter
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="grid grid-cols-4 gap-5 min-w-[900px] h-full">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.key);
              return (
                <div key={col.key} className="flex flex-col">
                  <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${col.color}`}>
                    <span>{col.icon}</span>
                    <h3 className="text-sm font-semibold">{col.label}</h3>
                    <span className="ml-auto text-xs text-zinc-600 bg-[#1a1a2e] px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-3 flex-1">
                    {colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {colTasks.length === 0 && (
                      <div className="text-xs text-zinc-700 text-center py-8 border border-dashed border-[#27273a] rounded-lg">
                        Inga uppgifter
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
