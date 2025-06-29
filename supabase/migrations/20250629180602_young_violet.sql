/*
  # Add studying and work content types

  1. Changes
    - Add 'studying' and 'work' to the content_type_enum
    - This allows users to track educational content and work projects

  2. Security
    - No changes to existing RLS policies
    - Maintains all existing security measures
*/

-- Add new values to the content_type enum
ALTER TYPE content_type_enum ADD VALUE IF NOT EXISTS 'studying';
ALTER TYPE content_type_enum ADD VALUE IF NOT EXISTS 'work';