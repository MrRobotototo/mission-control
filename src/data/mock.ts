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
  { 
    id: "claw", 
    name: "Claw", 
    role: "Hub & Koordinator", 
    emoji: "🐾", 
    avatar: "🐾", 
    status: "aktiv", 
    description: "Projektkoordinator — kopplar samman agenter och hanterar uppgifter" 
  },
  { 
    id: "dwight", 
    name: "Dwight", 
    role: "Sälj", 
    emoji: "💰", 
    avatar: "🤝", 
    status: "vilar", 
    description: "Säljagent för MiningVisuals — cold outreach, bokningar, CRM" 
  },
];

export const projects = [
  "Alla projekt",
  "MiningVisuals Sälj",
  "Mission Control",
];

export const tasks: Task[] = [];

export const activityLog: LogEntry[] = [];
