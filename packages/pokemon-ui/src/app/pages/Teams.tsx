import { FormEvent, useState } from 'react';

// State and API
import { useTeams } from '../state/teams';
import { Pokemon } from '../types/pokemon';
import { PokemonService } from '../services/PokemonService';

// UI Components
import { Button, Card, Container, Grid, Heading, Input, Text } from '../components/ui';
import { PokemonDetail } from '../components/PokemonDetail';
import { TeamCard } from '../components/TeamCard';
import { AddPokemonModal } from '../components/AddPokemonModal';


function TeamsPageContent() {
  // State
  const { teams, createTeam, deleteTeam, addMember, removeMember } = useTeams();
  const [newName, setNewName] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingToTeamId, setAddingToTeamId] = useState<string | null>(null);

  // Event Handlers
  const handleCreateTeam = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createTeam(newName.trim());
    setNewName('');
  };

  const openAddModal = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    if (team.members.length >= 6) {
      alert('This team is full (6/6 Pokémon)');
      return;
    }
    setAddingToTeamId(teamId);
    setShowAddModal(true);
  };

  const handleAddPokemon = (pokemon: Pokemon) => {
    if (!addingToTeamId) return;
    addMember(addingToTeamId, { id: pokemon.id, name: pokemon.name });
  };

  const handleMemberClick = async (memberId: number) => {
    try {
      const pokemon = await PokemonService.fetchPokemonById(memberId);
      setSelectedPokemon(pokemon);
    } catch (err) {
      console.error('Failed to load pokemon details', err);
    }
  };

  const getTeamsContaining = (pokemonId: number): string[] => {
    return teams.filter((t) => t.members.some((m) => m.id === pokemonId)).map((t) => t.name);
  };

  const addingToTeam = teams.find((t) => t.id === addingToTeamId);

  // Render
  return (
    <Container>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Heading>Your Teams</Heading>
        <form onSubmit={handleCreateTeam} style={{ display: 'flex', gap: 8 }}>
          <Input 
            placeholder="New team name" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            style={{ minWidth: 200 }} 
          />
          <Button type="submit">Create Team</Button>
        </form>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <Text>No teams yet. Create your first team above!</Text>
        </Card>
      ) : (
        <Grid cols={300}>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onMemberClick={handleMemberClick}
              onRemoveMember={removeMember}
              onAddPokemon={openAddModal}
              onDeleteTeam={deleteTeam}
            />
          ))}
        </Grid>
      )}

      {/* Add Pokemon Modal */}
      {showAddModal && addingToTeam && (
        <AddPokemonModal
          team={addingToTeam}
          onClose={() => setShowAddModal(false)}
          onAddPokemon={handleAddPokemon}
          onRemoveMember={removeMember}
        />
      )}

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          teamsContaining={getTeamsContaining(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </Container>
  );
}

export function TeamsPage() {
  return <TeamsPageContent />;
}
