-- Add needs_input tracking to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS needs_input BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS needs_input_reason TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS has_unread_agent_message BOOLEAN DEFAULT false;

-- Add is_question flag to task_messages
ALTER TABLE task_messages ADD COLUMN IF NOT EXISTS is_question BOOLEAN DEFAULT false;
