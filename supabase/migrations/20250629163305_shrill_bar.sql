/*
  # Add studying and work content types

  1. Schema Changes
    - Add 'studying' and 'work' to the content_type_enum
    - This allows users to categorize educational materials and work-related content

  2. Content Types
    - studying: Educational content, courses, tutorials, research papers
    - work: Professional content, projects, tools, documentation
*/

-- Add new values to the content_type_enum
ALTER TYPE content_type_enum ADD VALUE IF NOT EXISTS 'studying';
ALTER TYPE content_type_enum ADD VALUE IF NOT EXISTS 'work';