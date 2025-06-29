/*
  # Create celestial_bodies table

  1. New Tables
    - `celestial_bodies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, not null)
      - `content_type` (enum: movie, book, album, game, other)
      - `genre` (text, nullable)
      - `creator_id` (text, nullable)
      - `series_id` (text, nullable)
      - `external_id` (text, nullable)
      - `api_data` (jsonb, nullable)
      - `position_x` (double precision, not null)
      - `position_y` (double precision, not null)
      - `position_z` (double precision, not null)
      - `visual_attributes` (jsonb, not null)
      - `is_singularity` (boolean, default false)
      - `has_impact` (boolean, default false)
      - `created_at` (timestamp with time zone, default now)

  2. Security
    - Enable RLS on `celestial_bodies` table
    - Add policies for authenticated users to manage their own data
*/

-- Create enum type for content types
CREATE TYPE content_type_enum AS ENUM ('movie', 'book', 'album', 'game', 'other');

-- Create the celestial_bodies table
CREATE TABLE IF NOT EXISTS public.celestial_bodies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
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
  is_singularity boolean DEFAULT FALSE NOT NULL,
  has_impact boolean DEFAULT FALSE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.celestial_bodies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own celestial bodies"
  ON public.celestial_bodies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own celestial bodies"
  ON public.celestial_bodies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own celestial bodies"
  ON public.celestial_bodies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own celestial bodies"
  ON public.celestial_bodies FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_user_id ON public.celestial_bodies(user_id);
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_content_type ON public.celestial_bodies(content_type);
CREATE INDEX IF NOT EXISTS idx_celestial_bodies_created_at ON public.celestial_bodies(created_at DESC);