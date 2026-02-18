# Mission Control 🚀

AI Agent Project Management Platform inspired by Linear.app

## Features (Phase 1 - ✅ Complete)

- 🔐 **Authentication** - Supabase Auth with email/password
- 📋 **Project Management** - Create, view, and manage projects
- ✅ **Task Management** - Kanban-style task board with status tracking
- 🤖 **Multi-Agent Support** - Assign tasks to Claw, Dwight, or other agents
- 🎯 **Priority Levels** - Low, Medium, High, Urgent
- 🔍 **Agent Filtering** - Filter tasks by agent
- 📊 **Agent Statistics** - View task stats per agent
- 🎨 **Linear-Inspired UI** - Clean, minimalist dark mode design

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS with custom Linear-inspired design tokens

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/MrRobotototo/mission-control.git
cd mission-control
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the query

This will create all necessary tables, indexes, and seed data (Claw and Dwight agents).

### 5. Create a test user

In Supabase dashboard, go to **Authentication** → **Users** → **Add User**

Or use the Supabase SQL Editor:

```sql
-- This will allow you to create a user via the login page
-- The user will be created automatically on first login
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 7. Login

Use the email/password you created in step 5 to log in.

## Project Structure

```
mission-control/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth routes (login)
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   ├── lib/                 # Utilities and Supabase clients
│   └── types/               # TypeScript types
├── supabase/
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## Key Features Explained

### Projects

- Create and manage multiple projects
- Each project has a name, description, and status (active, paused, completed, archived)
- View project details and associated tasks

### Tasks

- Create tasks within projects
- Assign tasks to agents (Claw, Dwight, etc.)
- Set priority (low, medium, high, urgent)
- Track status (todo, in-progress, blocked, review, done)
- Kanban-style board for visual task management
- Filter tasks by agent

### Agents

- Pre-seeded with Claw 🦅 and Dwight 🤖
- View agent statistics and task breakdown
- Agent status tracking (online, offline, busy)

## API Routes

```
GET    /api/projects          - List all projects
POST   /api/projects          - Create a project
GET    /api/projects/[id]     - Get project by ID
PATCH  /api/projects/[id]     - Update project
DELETE /api/projects/[id]     - Delete project

GET    /api/tasks             - List tasks (supports ?project_id and ?agent_id filters)
POST   /api/tasks             - Create a task
GET    /api/tasks/[id]        - Get task by ID
PATCH  /api/tasks/[id]        - Update task
DELETE /api/tasks/[id]        - Delete task

GET    /api/agents            - List all agents
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Automatic deployment
git push origin main
```

## Phase 2 Roadmap (Advanced Features)

Coming soon with Claude Opus:

- 🔗 **Dependencies & Blockers** - Task dependencies with visual indicators
- 📊 **Token Tracking** - Track LLM token usage and costs per task/project
- 💬 **In-App Chat** - Real-time chat with agents within tasks
- 📈 **Analytics Dashboard** - Charts and insights
- ⌨️ **Command Palette** - Cmd+K for quick navigation
- ⚡ **Keyboard Shortcuts** - j/k navigation and more

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## License

MIT

---

Built with ❤️ for AI agent orchestration
