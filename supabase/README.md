# Database Setup

## Running Migrations

1. Go to your Supabase project: https://kiaoxycasarrogxtdpbba.supabase.co
2. Navigate to SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Run the query

This will create:
- All tables (projects, tasks, task_messages, token_usage, agents, activity_log)
- Indexes for performance
- Row Level Security policies
- Seed data for agents (Claw and Dwight)
- Triggers for auto-updating timestamps

## Manual Testing

After running the migration, you can test with:

```sql
-- Check that tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check agents were seeded
SELECT * FROM agents;

-- Create a test project
INSERT INTO projects (name, description, status) 
VALUES ('Test Project', 'Testing the database', 'active');
```
