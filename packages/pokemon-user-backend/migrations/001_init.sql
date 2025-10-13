-- Enable UUID generation using pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pokemon master table (normalized list)
-- Use Pokédex number as id for simplicity; can be extended later.
CREATE TABLE IF NOT EXISTS pokemon (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Teams table (many teams per user)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Join table: a team has up to 6 distinct pokemon
CREATE TABLE IF NOT EXISTS team_pokemon (
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  pokemon_id INTEGER NOT NULL REFERENCES pokemon(id) ON DELETE RESTRICT,
  PRIMARY KEY (team_id, pokemon_id)
);

-- Enforce max 6 pokemon per team via trigger
CREATE OR REPLACE FUNCTION enforce_team_pokemon_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF (SELECT COUNT(*) FROM team_pokemon WHERE team_id = NEW.team_id) >= 6 THEN
      RAISE EXCEPTION 'A team cannot have more than 6 pokemon';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_team_pokemon_limit ON team_pokemon;
CREATE TRIGGER trg_team_pokemon_limit
BEFORE INSERT ON team_pokemon
FOR EACH ROW
EXECUTE FUNCTION enforce_team_pokemon_limit();
