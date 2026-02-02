import { STARTER_POKEMON } from '../../data/pokemon';
import { useGameStore } from '../../store/gameStore';
import Button from '../UI/Button';
import './PokemonSelection.css';

export default function PokemonSelection() {
  const selectStarter = useGameStore((state) => state.selectStarter);
  const startBattle = useGameStore((state) => state.startBattle);
  const selectedPokemon = useGameStore((state) => state.player.selectedPokemon);

  const handleSelectStarter = (speciesId: number) => {
    selectStarter(speciesId);
  };

  const handleStartGame = () => {
    if (selectedPokemon) {
      startBattle();
    }
  };

  return (
    <div className="pokemon-selection">
      <h1>Choose Your Pokemon!</h1>

      <div className="starter-grid">
        {STARTER_POKEMON.map((species) => {
          const isSelected = selectedPokemon?.speciesId === species.id;

          return (
            <div
              key={species.id}
              className={`starter-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectStarter(species.id)}
            >
              <div className="starter-name">{species.name}</div>
              <div className="starter-type">{species.types.join(' / ').toUpperCase()}</div>
              <div className="starter-stats">
                <div>HP: {species.baseStats.hp}</div>
                <div>ATK: {species.baseStats.attack}</div>
                <div>DEF: {species.baseStats.defense}</div>
                <div>SPD: {species.baseStats.speed}</div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPokemon && (
        <div className="start-button-container">
          <Button onClick={handleStartGame}>Start Battle!</Button>
        </div>
      )}
    </div>
  );
}
