"use client";

import { agents, tasks, activityLog, pipelineStages, upcomingEvents } from "@/data/mock";

const statusColor = {
  aktiv: "bg-green-500",
  vilar: "bg-zinc-500",
  upptagen: "bg-yellow-500",
};

const taskStatusLabel = {
  aktiv: { bg: "bg-indigo-500/20 text-indigo-400", label: "Aktiv" },
  väntande: { bg: "bg-yellow-500/20 text-yellow-400", label: "Väntande" },
  klar: { bg: "bg-green-500/20 text-green-400", label: "Klar" },
};

const priorityDot = {
  hög: "bg-red-500",
  medium: "bg-yellow-500",
  låg: "bg-zinc-500",
};

export default function Dashboard() {
  const activeTasks = tasks.filter((t) => t.status === "aktiv");
  const pendingTasks = tasks.filter((t) => t.status === "väntande");
  const doneTasks = tasks.filter((t) => t.status === "klar");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#27273a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h1 className="text-xl font-bold tracking-tight">Mission Control</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>System online</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Agents */}
        <section>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Agenter</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {agents.map((a) => (
              <div
                key={a.name}
                className="bg-[#1a1a2e] border border-[#27273a] rounded-xl p-4 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${statusColor[a.status]}`} />
                </div>
                <h3 className="font-medium text-sm">{a.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Uppgifter</h2>
            <div className="space-y-3">
              {[
                { label: "Aktiva", items: activeTasks },
                { label: "Väntande", items: pendingTasks },
                { label: "Klara", items: doneTasks },
              ].map((group) => (
                <div key={group.label}>
                  <h3 className="text-xs font-medium text-zinc-600 mb-2">
                    {group.label} ({group.items.length})
                  </h3>
                  <div className="space-y-1.5">
                    {group.items.map((t) => (
                      <div
                        key={t.id}
                        className="bg-[#1a1a2e] border border-[#27273a] rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${priorityDot[t.priority]}`} />
                          <span className={`text-sm ${t.status === "klar" ? "line-through text-zinc-600" : ""}`}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-600">{t.agent}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${taskStatusLabel[t.status].bg}`}>
                            {taskStatusLabel[t.status].label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Log */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Aktivitetslogg</h2>
            <div className="bg-[#1a1a2e] border border-[#27273a] rounded-xl p-4 space-y-3">
              {activityLog.map((entry) => (
                <div key={entry.id} className="flex gap-3 text-sm">
                  <span className="text-zinc-600 text-xs whitespace-nowrap mt-0.5">
                    {entry.timestamp.split(" ")[1]}
                  </span>
                  <div>
                    <span className="text-indigo-400 text-xs">{entry.agent}</span>
                    <p className="text-zinc-400 text-xs mt-0.5">{entry.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom row: Pipeline + Calendar */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Pipeline */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Säljpipeline</h2>
            <div className="bg-[#1a1a2e] border border-[#27273a] rounded-xl p-5">
              <div className="flex items-end justify-between gap-2 h-32">
                {pipelineStages.map((stage) => (
                  <div key={stage.name} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-zinc-400">{stage.value} kr</span>
                    <div
                      className="w-full bg-indigo-500/30 rounded-t-md"
                      style={{ height: `${(stage.count / 12) * 100}%`, minHeight: "16px" }}
                    >
                      <div className="w-full h-full bg-indigo-500/60 rounded-t-md flex items-center justify-center">
                        <span className="text-xs font-bold">{stage.count}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-600 text-center">{stage.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Upcoming */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Kommande möten & deadlines
            </h2>
            <div className="bg-[#1a1a2e] border border-[#27273a] rounded-xl p-4 space-y-3">
              {upcomingEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="text-center min-w-[44px]">
                    <div className="text-xs text-zinc-600">{ev.date.slice(5)}</div>
                    <div className="text-indigo-400 font-medium">{ev.time}</div>
                  </div>
                  <div className="h-8 w-px bg-[#27273a]" />
                  <span className="text-zinc-300">{ev.title}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
