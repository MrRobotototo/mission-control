export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  avatar: string;
  status: "aktiv" | "vilar" | "upptagen";
  description: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  agents: string[]; // agent ids
  status: "att-göra" | "pågår" | "granskning" | "klart";
  priority: "hög" | "medium" | "låg";
  deadline: string;
  project: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  agentId: string;
  event: string;
}

export const agents: Agent[] = [
  { id: "petra", name: "Petra", role: "Projektledning", emoji: "🎯", avatar: "👩‍💼", status: "aktiv", description: "Koordinerar alla agenter och projekt" },
  { id: "koda", name: "Koda", role: "Kodning", emoji: "💻", avatar: "👨‍💻", status: "aktiv", description: "Bygger och underhåller kodbaser" },
  { id: "rex", name: "Rex", role: "Research", emoji: "🔍", avatar: "🧐", status: "vilar", description: "Omvärldsbevakning och analys" },
  { id: "mika", name: "Mika", role: "Marknad", emoji: "📣", avatar: "🎨", status: "upptagen", description: "Marknadsföring och kommunikation" },
  { id: "sal", name: "Sal", role: "Sälj", emoji: "💰", avatar: "🤝", status: "aktiv", description: "Pipeline och kundkontakter" },
  { id: "liv", name: "Liv", role: "Privat", emoji: "🏠", avatar: "🏡", status: "vilar", description: "Personliga ärenden och planering" },
];

export const projects = [
  "Alla projekt",
  "MiningVisuals Sälj Outreach",
  "Mission Control Utveckling",
  "Quokka Research",
];

export const tasks: Task[] = [
  // MiningVisuals Sälj Outreach
  { id: 1, title: "Identifiera 50 prospekt i gruvbranschen", description: "Bygg en lista med beslutsfattare på nordiska gruvbolag för outreach-kampanj.", agents: ["sal", "rex"], status: "klart", priority: "hög", deadline: "2026-02-15", project: "MiningVisuals Sälj Outreach" },
  { id: 2, title: "Skriva outreach-mail sekvens", description: "3-stegs mailsekvens med personalisering. A/B-testa ämnesrader.", agents: ["mika", "sal"], status: "pågår", priority: "hög", deadline: "2026-02-19", project: "MiningVisuals Sälj Outreach" },
  { id: 3, title: "Förbereda demo-presentation", description: "Pitch deck + live-demo av MiningVisuals plattform för prospektmöten.", agents: ["sal"], status: "att-göra", priority: "hög", deadline: "2026-02-22", project: "MiningVisuals Sälj Outreach" },
  { id: 4, title: "Boka 10 kundmöten", description: "Ringa och följa upp mailkampanj. Mål: 10 demo-bokningar.", agents: ["sal"], status: "att-göra", priority: "medium", deadline: "2026-02-28", project: "MiningVisuals Sälj Outreach" },
  { id: 5, title: "Analysera konkurrenters prissättning", description: "Kartlägg vad liknande lösningar kostar i branschen.", agents: ["rex"], status: "granskning", priority: "medium", deadline: "2026-02-20", project: "MiningVisuals Sälj Outreach" },

  // Mission Control Utveckling
  { id: 6, title: "Implementera Kanban board", description: "Bygg drag-and-drop Kanban med kolumner: Att göra, Pågår, Granskning, Klart.", agents: ["koda"], status: "pågår", priority: "hög", deadline: "2026-02-18", project: "Mission Control Utveckling" },
  { id: 7, title: "Agentprofiler med avatarer", description: "Varje agent får namn, emoji-avatar och rollbeskrivning som visas på kort.", agents: ["koda", "petra"], status: "granskning", priority: "hög", deadline: "2026-02-18", project: "Mission Control Utveckling" },
  { id: 8, title: "Projektfiltrering", description: "Implementera filter/tabs för att visa tasks per projekt.", agents: ["koda"], status: "pågår", priority: "medium", deadline: "2026-02-19", project: "Mission Control Utveckling" },
  { id: 9, title: "Deploy till Vercel", description: "Konfigurera Vercel-projekt och sätt upp automatisk deploy från main.", agents: ["koda"], status: "att-göra", priority: "medium", deadline: "2026-02-19", project: "Mission Control Utveckling" },
  { id: 10, title: "Designa mörkt tema", description: "Clean dark UI med indigo-accenter och god läsbarhet.", agents: ["koda"], status: "klart", priority: "medium", deadline: "2026-02-17", project: "Mission Control Utveckling" },
  { id: 11, title: "Skriva projektdokumentation", description: "README och intern dokumentation för Mission Control-plattformen.", agents: ["petra"], status: "att-göra", priority: "låg", deadline: "2026-02-25", project: "Mission Control Utveckling" },

  // Quokka Research
  { id: 12, title: "Litteraturstudie quokka-habitat", description: "Samla akademiska papers om quokka-populationer och habitatförändringar.", agents: ["rex"], status: "pågår", priority: "hög", deadline: "2026-02-21", project: "Quokka Research" },
  { id: 13, title: "Kontakta forskare i Perth", description: "Maila 5 forskare vid UWA för potentiella samarbeten.", agents: ["rex", "sal"], status: "att-göra", priority: "medium", deadline: "2026-02-24", project: "Quokka Research" },
  { id: 14, title: "Bygga datainsamlings-scraper", description: "Python-script för att hämta populationsdata från offentliga databaser.", agents: ["koda"], status: "att-göra", priority: "medium", deadline: "2026-02-26", project: "Quokka Research" },
  { id: 15, title: "Skapa visuell rapport", description: "Infografik och sammanfattning av forskningsläget för presentation.", agents: ["mika", "rex"], status: "att-göra", priority: "låg", deadline: "2026-03-01", project: "Quokka Research" },
  { id: 16, title: "Sammanfatta Rottnest Island-data", description: "Analys av senaste 5 årens populationsdata från Rottnest Island.", agents: ["rex"], status: "granskning", priority: "hög", deadline: "2026-02-20", project: "Quokka Research" },
];

export const activityLog: LogEntry[] = [
  { id: 1, timestamp: "2026-02-18 01:10", agentId: "koda", event: "Kanban board implementation påbörjad" },
  { id: 2, timestamp: "2026-02-18 00:45", agentId: "petra", event: "Agentprofiler granskade och godkända" },
  { id: 3, timestamp: "2026-02-17 23:30", agentId: "sal", event: "Outreach-mail utkast skickat till Mika för review" },
  { id: 4, timestamp: "2026-02-17 22:15", agentId: "rex", event: "Konkurrentanalys prissättning klar — väntar granskning" },
  { id: 5, timestamp: "2026-02-17 21:00", agentId: "mika", event: "A/B-test ämnesrader: 2 varianter klara" },
  { id: 6, timestamp: "2026-02-17 19:30", agentId: "koda", event: "Mörkt tema implementerat ✓" },
  { id: 7, timestamp: "2026-02-17 18:00", agentId: "rex", event: "3 nya papers hittade om quokka-habitat" },
  { id: 8, timestamp: "2026-02-17 16:00", agentId: "petra", event: "Veckoplanering och prioritering genomförd" },
  { id: 9, timestamp: "2026-02-17 14:00", agentId: "sal", event: "Prospektlista: 50 kontakter identifierade ✓" },
];
