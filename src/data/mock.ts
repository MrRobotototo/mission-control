export interface Agent {
  name: string;
  emoji: string;
  status: "aktiv" | "vilar" | "upptagen";
  description: string;
}

export interface Task {
  id: number;
  title: string;
  agent: string;
  status: "aktiv" | "väntande" | "klar";
  priority: "hög" | "medium" | "låg";
}

export interface LogEntry {
  id: number;
  timestamp: string;
  agent: string;
  event: string;
}

export const agents: Agent[] = [
  { name: "Projektledning", emoji: "🎯", status: "aktiv", description: "Koordinerar alla agenter och projekt" },
  { name: "Kodning", emoji: "💻", status: "aktiv", description: "Bygger och underhåller kodbaser" },
  { name: "Research", emoji: "🔍", status: "vilar", description: "Omvärldsbevakning och analys" },
  { name: "Marknad", emoji: "📣", status: "upptagen", description: "Marknadsföring och kommunikation" },
  { name: "Sälj", emoji: "💰", status: "aktiv", description: "Pipeline och kundkontakter" },
  { name: "Privat", emoji: "🏠", status: "vilar", description: "Personliga ärenden och planering" },
];

export const tasks: Task[] = [
  { id: 1, title: "Bygg Mission Control dashboard", agent: "Kodning", status: "aktiv", priority: "hög" },
  { id: 2, title: "Researcha konkurrenter Q1", agent: "Research", status: "väntande", priority: "medium" },
  { id: 3, title: "Skicka kampanjmail", agent: "Marknad", status: "aktiv", priority: "hög" },
  { id: 4, title: "Uppdatera säljpresentation", agent: "Sälj", status: "väntande", priority: "medium" },
  { id: 5, title: "Konfigurera CI/CD pipeline", agent: "Kodning", status: "klar", priority: "hög" },
  { id: 6, title: "Boka tandläkare", agent: "Privat", status: "klar", priority: "låg" },
  { id: 7, title: "Skriv blogginlägg om AI-agenter", agent: "Marknad", status: "aktiv", priority: "medium" },
  { id: 8, title: "Förbered pitch deck", agent: "Sälj", status: "aktiv", priority: "hög" },
];

export const activityLog: LogEntry[] = [
  { id: 1, timestamp: "2026-02-17 23:45", agent: "Kodning", event: "Mission Control-projektet initierat" },
  { id: 2, timestamp: "2026-02-17 22:30", agent: "Marknad", event: "Kampanjmail utkast klart" },
  { id: 3, timestamp: "2026-02-17 21:15", agent: "Sälj", event: "3 nya leads tillagda i pipeline" },
  { id: 4, timestamp: "2026-02-17 20:00", agent: "Research", event: "Konkurrentanalys Q1 påbörjad" },
  { id: 5, timestamp: "2026-02-17 18:30", agent: "Projektledning", event: "Veckoplanering genomförd" },
  { id: 6, timestamp: "2026-02-17 16:00", agent: "Kodning", event: "CI/CD pipeline konfigurerad ✓" },
  { id: 7, timestamp: "2026-02-17 14:00", agent: "Privat", event: "Tandläkartid bokad 3 mars" },
];

export const pipelineStages = [
  { name: "Prospekt", count: 12, value: "240k" },
  { name: "Kontakt", count: 8, value: "180k" },
  { name: "Offert", count: 4, value: "320k" },
  { name: "Förhandling", count: 2, value: "150k" },
  { name: "Vunnen", count: 3, value: "280k" },
];

export const upcomingEvents = [
  { date: "2026-02-18", time: "09:00", title: "Standup med teamet" },
  { date: "2026-02-18", time: "14:00", title: "Demo av Mission Control" },
  { date: "2026-02-19", time: "10:00", title: "Kundmöte — Acme Corp" },
  { date: "2026-02-20", time: "15:00", title: "Deadline: Kampanjlansering" },
];
