ALTER TABLE projects
  ADD COLUMN thumbnail_position text NOT NULL DEFAULT 'center'
    CHECK (thumbnail_position IN ('top', 'center', 'bottom')),
  ADD COLUMN thumbnail_mode text NOT NULL DEFAULT 'image'
    CHECK (thumbnail_mode IN ('image', 'live'));
