/*
  # Create celestial_bodies table and related structures

  1. New Tables
    - celestial_bodies table with all required columns
    - Proper foreign key relationships
    - Default values and constraints

  2. Enums
    - content_type_enum with values: movie, book, album, game, other

  3. Security
    - Enable RLS on celestial_bodies table
    - Add policies for authenticated users to manage their own data

  4. Indexes
    - Primary key on id
    - Index on user_id for efficient user queries
    - Index on content_type for filtering
    - Index on created_at for ordering
*/

-- Create the content_type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE content_type_enum AS ENUM ('movie', 'book', 'album', 'game', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the celestial_bodies table
CREATE TABLE IF NOT EXISTS celestial_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type content_type_enum NOT NULL,
  genre text,
  creator_id text,
  series_id text,
  external_id text,
  api_data jsonb,
  position_x double precision NOT NULL,
  position_y double precision NOT NULL,
  position_z double precision NOT NULL,
  visual_attributes jsonb NOT NULL,
  is_singularity boolean DEFAULT false NOT NULL,
  has_impact boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_user_id ON celestial_bodies(user_id);
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_content_type ON celestial_bodies(content_type);
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_created_at ON celestial_bodies(created_at DESC);

-- Enable Row Level Security
ALTER TABLE celestial_bodies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own celestial bodies"
  ON celestial_bodies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own celestial bodies"
  ON celestial_bodies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own celestial bodies"
  ON celestial_bodies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own celestial bodies"
  ON celestial_bodies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);