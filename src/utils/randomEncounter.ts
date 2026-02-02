import { PokemonInstance } from '../types/pokemon';
import { WILD_ENCOUNTER_POOL, createPokemonInstance } from '../data/pokemon';

export function generateWildPokemon(playerLevel: number): PokemonInstance {
  // Select random species from wild encounter pool
  const randomIndex = Math.floor(Math.random() * WILD_ENCOUNTER_POOL.length);
  const species = WILD_ENCOUNTER_POOL[randomIndex];

  // Generate random level between 3-10
  // Weight slightly towards player's level ±2
  const minLevel = 3;
  const maxLevel = 10;
  const targetLevel = Math.max(minLevel, Math.min(maxLevel, playerLevel - 1));

  // Random variation ±2 levels from target
  const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const wildLevel = Math.max(minLevel, Math.min(maxLevel, targetLevel + variation));

  return createPokemonInstance(species.id, wildLevel);
}

export function shouldLearnNewMove(battlesWon: number): boolean {
  // Learn new move after 2-3 battles
  // Every 2-3 battles means roughly 40% chance per battle
  if (battlesWon === 0) return false;

  // Deterministic: every 2nd or 3rd battle
  const cycle = battlesWon % 3;
  return cycle === 2 || (cycle === 0 && Math.random() < 0.5);
}

export function selectRandomMove(learnableMoves: string[], currentMoves: string[]): string | null {
  // Filter out already known moves
  const available = learnableMoves.filter(move => !currentMoves.includes(move));

  if (available.length === 0) {
    return null; // No new moves to learn
  }

  // Select random available move
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

export function addMoveToSet(currentMoves: string[], newMove: string): string[] {
  if (currentMoves.length < 4) {
    // Add to empty slot
    return [...currentMoves, newMove];
  } else {
    // Replace oldest move (first in array)
    return [...currentMoves.slice(1), newMove];
  }
}
