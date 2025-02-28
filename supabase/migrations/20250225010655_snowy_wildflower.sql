/*
  # Knowledge Base Schema for Craving Coach

  1. New Tables
    - `experts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `credentials` (text)
      - `specialty` (text)
      - `created_at` (timestamp)

    - `wisdom_quotes`
      - `id` (uuid, primary key)
      - `expert_id` (uuid, foreign key)
      - `quote` (text)
      - `craving_type` (text)
      - `context` (text)
      - `created_at` (timestamp)

    - `techniques`
      - `id` (uuid, primary key)
      - `expert_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `duration_seconds` (integer)
      - `difficulty_level` (text)
      - `craving_type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Restrict write access to authenticated admins only
*/

-- Create experts table
CREATE TABLE IF NOT EXISTS experts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  credentials text NOT NULL,
  specialty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create wisdom_quotes table
CREATE TABLE IF NOT EXISTS wisdom_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES experts(id) ON DELETE CASCADE,
  quote text NOT NULL,
  craving_type text NOT NULL,
  context text,
  created_at timestamptz DEFAULT now()
);

-- Create techniques table
CREATE TABLE IF NOT EXISTS techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES experts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  duration_seconds integer,
  difficulty_level text NOT NULL,
  craving_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE techniques ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on experts"
  ON experts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on wisdom_quotes"
  ON wisdom_quotes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on techniques"
  ON techniques
  FOR SELECT
  TO public
  USING (true);

-- Create policies for admin write access
CREATE POLICY "Allow admin write access on experts"
  ON experts
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Allow admin write access on wisdom_quotes"
  ON wisdom_quotes
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Allow admin write access on techniques"
  ON techniques
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Insert initial expert data
INSERT INTO experts (name, credentials, specialty) VALUES
  ('Dr. Sarah Thompson', 'Ph.D. in Clinical Psychology, Mindfulness Practitioner', 'Food and Emotional Eating'),
  ('Dr. Michael Chen', 'M.D., Addiction Specialist', 'Substance Dependencies'),
  ('Prof. Emma Williams', 'Clinical Research Director, Behavioral Science Expert', 'Shopping and Behavioral Addictions'),
  ('Dr. James Carter', 'Neuroscience Ph.D., Meditation Teacher', 'General Craving Management');

-- Insert initial wisdom quotes
INSERT INTO wisdom_quotes (expert_id, quote, craving_type, context) 
SELECT 
  id,
  'Remember, a craving is like a wave - it will rise, peak, and eventually fall. Your job is not to stop the wave, but to surf it.',
  'general',
  'When experiencing intense cravings'
FROM experts WHERE name = 'Dr. James Carter'
UNION ALL
SELECT 
  id,
  'The space between stimulus and response is your power. In that space lies your freedom to choose.',
  'general',
  'Immediate craving response'
FROM experts WHERE name = 'Dr. Sarah Thompson'
UNION ALL
SELECT 
  id,
  'Your craving is not your enemy - it''s a signal from your body or mind that needs attention. Listen to it with curiosity rather than judgment.',
  'food',
  'Food craving management'
FROM experts WHERE name = 'Dr. Sarah Thompson';

-- Insert initial techniques
INSERT INTO techniques (expert_id, title, description, duration_seconds, difficulty_level, craving_type)
SELECT
  id,
  '5-4-3-2-1 Grounding Exercise',
  'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This technique helps bring your attention to the present moment.',
  300,
  'beginner',
  'general'
FROM experts WHERE name = 'Dr. James Carter'
UNION ALL
SELECT
  id,
  'STOP Technique',
  'Stop what you''re doing, Take a step back, Observe your thoughts and feelings, Proceed mindfully. This technique helps create space between the craving and your response.',
  180,
  'beginner',
  'general'
FROM experts WHERE name = 'Dr. Sarah Thompson';