import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

export type TeamPokemon = { id: number; name: string };

export type Team = {
  id: string;
  name: string;
  members: TeamPokemon[]; // up to 6
};

type TeamsContextType = {
  teams: Team[];
  currentTeamId: string | null;
  setCurrentTeamId: (id: string | null) => void;
  createTeam: (name: string) => Team;
  renameTeam: (id: string, name: string) => void;
  deleteTeam: (id: string) => void;
  addMember: (teamId: string, mon: TeamPokemon) => void;
  removeMember: (teamId: string, id: number) => void;
};

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

const STORAGE_KEY = 'pokemon_teams_state_v1';

type Persisted = { teams: Team[]; currentTeamId: string | null };

type BackendTeam = {
  id: string;
  name: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
};

type BackendTeamMember = {
  teamId: string;
  pokemonId: number;
  pokemon: {
    id: number;
    name: string;
  };
};

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load teams from backend on mount
  useEffect(() => {
    let mounted = true;
    async function loadTeams() {
      try {
        const backendTeams = await api<BackendTeam[]>('/teams');
        if (!mounted) return;
        
        // Fetch roster for each team
        const teamsWithMembers = await Promise.all(
          backendTeams.map(async (bt) => {
            try {
              const roster = await api<BackendTeamMember[]>(`/teams/${bt.id}/roster`);
              const members: TeamPokemon[] = roster.map((r) => ({
                id: r.pokemonId,
                name: r.pokemon?.name || '',
              }));
              return { id: bt.id, name: bt.name, members };
            } catch {
              return { id: bt.id, name: bt.name, members: [] };
            }
          })
        );
        
        setTeams(teamsWithMembers);
        
        // Restore currentTeamId from localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as Persisted;
            setCurrentTeamId(parsed.currentTeamId || null);
          }
        } catch {}
      } catch (err) {
        console.error('Failed to load teams:', err);
        // Fall back to localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as Persisted;
            setTeams(parsed.teams || []);
            setCurrentTeamId(parsed.currentTeamId || null);
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
    return () => { mounted = false; };
  }, []);

  // Save currentTeamId to localStorage
  useEffect(() => {
    const payload: Persisted = { teams, currentTeamId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [currentTeamId]);

  const createTeam = useCallback((name: string) => {
    const team: Team = { id: crypto.randomUUID(), name, members: [] };
    setTeams((t) => [...t, team]);
    setCurrentTeamId(team.id);
    
    // Sync to backend
    api<BackendTeam>('/teams', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }).then((created) => {
      // Update with backend ID if different
      if (created.id !== team.id) {
        setTeams((ts) => ts.map((t) => (t.id === team.id ? { ...t, id: created.id } : t)));
        setCurrentTeamId(created.id);
      }
    }).catch((err) => console.error('Failed to create team on backend:', err));
    
    return team;
  }, []);

  const renameTeam = useCallback((id: string, name: string) => {
    setTeams((ts) => ts.map((t) => (t.id === id ? { ...t, name } : t)));
    
    // Sync to backend
    api(`/teams/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    }).catch((err) => console.error('Failed to rename team on backend:', err));
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams((ts) => ts.filter((t) => t.id !== id));
    setCurrentTeamId((cid) => (cid === id ? null : cid));
    
    // Sync to backend
    api(`/teams/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete team on backend:', err));
  }, []);

  const addMember = useCallback((teamId: string, mon: TeamPokemon) => {
    setTeams((ts) =>
      ts.map((t) =>
        t.id === teamId
          ? t.members.find((m) => m.id === mon.id) || t.members.length >= 6
            ? t
            : { ...t, members: [...t.members, mon] }
          : t,
      ),
    );
    
    // Sync to backend
    api(`/teams/${teamId}/pokemon`, {
      method: 'POST',
      body: JSON.stringify({ pokemonId: mon.id }),
    }).catch((err) => console.error('Failed to add pokemon to team on backend:', err));
  }, []);

  const removeMember = useCallback((teamId: string, id: number) => {
    setTeams((ts) => ts.map((t) => (t.id === teamId ? { ...t, members: t.members.filter((m) => m.id !== id) } : t)));
    
    // Sync to backend
    api(`/teams/${teamId}/pokemon/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to remove pokemon from team on backend:', err));
  }, []);

  const contextValue: TeamsContextType = {
    teams,
    currentTeamId,
    setCurrentTeamId,
    createTeam,
    renameTeam,
    deleteTeam,
    addMember,
    removeMember,
  };

  return <TeamsContext.Provider value={contextValue}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error('useTeams must be used within TeamProvider');
  return ctx;
}
