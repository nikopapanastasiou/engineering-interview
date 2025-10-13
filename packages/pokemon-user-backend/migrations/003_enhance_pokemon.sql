-- Add enhanced Pokemon fields
ALTER TABLE pokemon
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS genus TEXT,
  ADD COLUMN IF NOT EXISTS generation TEXT,
  ADD COLUMN IF NOT EXISTS habitat TEXT,
  ADD COLUMN IF NOT EXISTS shape TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS is_legendary BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_mythical BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS evolution_chain_id INTEGER,
  ADD COLUMN IF NOT EXISTS capture_rate INTEGER,
  ADD COLUMN IF NOT EXISTS base_happiness INTEGER,
  ADD COLUMN IF NOT EXISTS growth_rate TEXT;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pokemon_is_legendary ON pokemon(is_legendary) WHERE is_legendary = TRUE;
CREATE INDEX IF NOT EXISTS idx_pokemon_is_mythical ON pokemon(is_mythical) WHERE is_mythical = TRUE;
CREATE INDEX IF NOT EXISTS idx_pokemon_generation ON pokemon(generation);
CREATE INDEX IF NOT EXISTS idx_pokemon_color ON pokemon(color);
CREATE INDEX IF NOT EXISTS idx_pokemon_habitat ON pokemon(habitat);
