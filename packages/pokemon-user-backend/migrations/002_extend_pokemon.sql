-- Extend pokemon table with additional metadata from PokeAPI
ALTER TABLE pokemon
  ADD COLUMN IF NOT EXISTS height INTEGER,
  ADD COLUMN IF NOT EXISTS weight INTEGER,
  ADD COLUMN IF NOT EXISTS base_experience INTEGER,
  ADD COLUMN IF NOT EXISTS types TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS abilities TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stats JSONB,
  ADD COLUMN IF NOT EXISTS sprites JSONB;

-- Optional index on name for fast lookup
CREATE INDEX IF NOT EXISTS idx_pokemon_name ON pokemon (name);
