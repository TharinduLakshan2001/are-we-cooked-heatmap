-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  message TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  tempC DOUBLE PRECISION,
  tiktoklink TEXT
);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous select all
CREATE POLICY "Allow anonymous select" ON submissions
  FOR SELECT TO anon
  USING (true);

-- Seed initial demo entries
INSERT INTO submissions (name, city, score, message, lat, lng) VALUES
  ('Alex', 'Paris', 10, 'No AC since Monday. Send help.', 48.8566, 2.3522),
  ('Maria', 'Madrid', 9, 'I''m melting. Literally.', 40.4168, -3.7038),
  ('Luca', 'Rome', 8, 'Too hot to think.', 41.9028, 12.4964),
  ('Sophie', 'London', 8, 'Night sweats 2.0', 51.5074, -0.1278),
  ('Jonas', 'Berlin', 7, 'Working in an oven.', 52.52, 13.405);
