-- Seed test data: 25 tasks across projects

-- Create 3 test projects first
INSERT INTO projects (name, description, status) VALUES
  ('AI Research Platform', 'Building next-generation AI research tools', 'active'),
  ('MiningVisuals Automation', 'Automating content creation for mining sector', 'active'),
  ('Internal Tools Development', 'Building productivity tools for the team', 'paused')
ON CONFLICT DO NOTHING;

-- Get project IDs (assuming they're the first 3 projects)
DO $$
DECLARE
  proj1_id UUID;
  proj2_id UUID;
  proj3_id UUID;
BEGIN
  SELECT id INTO proj1_id FROM projects WHERE name = 'AI Research Platform' LIMIT 1;
  SELECT id INTO proj2_id FROM projects WHERE name = 'MiningVisuals Automation' LIMIT 1;
  SELECT id INTO proj3_id FROM projects WHERE name = 'Internal Tools Development' LIMIT 1;

  -- Insert 25 test tasks
  INSERT INTO tasks (project_id, title, description, status, priority, agent_id) VALUES
    (proj1_id, 'Implement semantic search', 'Add vector search capabilities to the research platform', 'in-progress', 'high', 'claw'),
    (proj1_id, 'Design new UI mockups', 'Create Figma designs for the main dashboard', 'todo', 'medium', 'dwight'),
    (proj1_id, 'Write API documentation', 'Document all REST endpoints with examples', 'done', 'medium', 'claw'),
    (proj1_id, 'Optimize database queries', 'Improve performance of analytics queries', 'in-progress', 'high', 'claw'),
    (proj1_id, 'Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing', 'todo', 'high', 'dwight'),
    (proj1_id, 'Implement user authentication', 'Add OAuth2 support for multiple providers', 'done', 'high', 'claw'),
    (proj1_id, 'Create onboarding flow', 'Design and implement user onboarding experience', 'in-progress', 'medium', 'dwight'),
    (proj1_id, 'Add real-time notifications', 'Implement WebSocket-based notifications', 'todo', 'low', 'claw'),

    (proj2_id, 'Generate mining reports', 'Auto-generate quarterly reports from data', 'in-progress', 'high', 'dwight'),
    (proj2_id, 'Analyze competitor content', 'Scrape and analyze competitor websites', 'done', 'medium', 'claw'),
    (proj2_id, 'Create social media templates', 'Design reusable templates for LinkedIn posts', 'todo', 'low', 'dwight'),
    (proj2_id, 'Implement content scheduling', 'Build calendar-based content scheduler', 'in-progress', 'high', 'claw'),
    (proj2_id, 'Write SEO optimization module', 'Add keyword analysis and suggestions', 'todo', 'medium', 'dwight'),
    (proj2_id, 'Build analytics dashboard', 'Track engagement metrics across platforms', 'in-progress', 'high', 'claw'),
    (proj2_id, 'Integrate with CRM system', 'Connect to existing Salesforce instance', 'blocked', 'high', 'dwight'),
    (proj2_id, 'Create video processing pipeline', 'Automate video editing and transcription', 'todo', 'medium', 'claw'),

    (proj3_id, 'Build task management system', 'Internal tool for project tracking', 'in-progress', 'high', 'claw'),
    (proj3_id, 'Implement time tracking', 'Track time spent on different projects', 'done', 'medium', 'dwight'),
    (proj3_id, 'Create invoice generator', 'Automated invoice creation from time logs', 'todo', 'low', 'claw'),
    (proj3_id, 'Design team calendar', 'Shared calendar with availability tracking', 'in-progress', 'medium', 'dwight'),
    (proj3_id, 'Build knowledge base', 'Internal wiki with documentation', 'todo', 'low', 'claw'),
    (proj3_id, 'Implement code review tool', 'Streamline pull request reviews', 'in-progress', 'medium', 'dwight'),
    (proj3_id, 'Create deployment dashboard', 'Monitor all production deployments', 'done', 'high', 'claw'),
    (proj3_id, 'Build metrics collector', 'Aggregate metrics from various sources', 'todo', 'high', 'dwight'),
    (proj3_id, 'Design alert system', 'Send notifications for critical events', 'todo', 'medium', 'claw');

END $$;
