import { PokemonSpecies, PokemonInstance, BaseStats } from '../types/pokemon';

// 6 starter Pokemon
export const STARTER_POKEMON: PokemonSpecies[] = [
  {
    id: 25,
    name: 'Pikachu',
    types: ['electric'],
    baseStats: { hp: 35, attack: 55, defense: 40, speed: 90 },
    startingMoves: ['tackle', 'thunder-shock'],
    learnableMoves: ['thunderbolt', 'body-slam'],
  },
  {
    id: 133,
    name: 'Eevee',
    types: ['normal'],
    baseStats: { hp: 55, attack: 55, defense: 50, speed: 55 },
    startingMoves: ['tackle', 'quick-attack'],
    learnableMoves: ['body-slam'],
  },
  {
    id: 54,
    name: 'Psyduck',
    types: ['water'],
    baseStats: { hp: 50, attack: 52, defense: 48, speed: 55 },
    startingMoves: ['tackle', 'water-gun'],
    learnableMoves: ['surf', 'psychic'],
  },
  {
    id: 4,
    name: 'Charmander',
    types: ['fire'],
    baseStats: { hp: 39, attack: 52, defense: 43, speed: 65 },
    startingMoves: ['tackle', 'ember'],
    learnableMoves: ['flamethrower', 'body-slam'],
  },
  {
    id: 7,
    name: 'Squirtle',
    types: ['water'],
    baseStats: { hp: 44, attack: 48, defense: 65, speed: 43 },
    startingMoves: ['tackle', 'bubble'],
    learnableMoves: ['surf', 'body-slam'],
  },
  {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    baseStats: { hp: 45, attack: 49, defense: 49, speed: 45 },
    startingMoves: ['tackle', 'vine-whip'],
    learnableMoves: ['solar-beam', 'body-slam'],
  },
];

// Wild encounter pool
export const WILD_ENCOUNTER_POOL: PokemonSpecies[] = [
  {
    id: 19,
    name: 'Rattata',
    types: ['normal'],
    baseStats: { hp: 30, attack: 56, defense: 35, speed: 72 },
    startingMoves: ['tackle', 'quick-attack'],
    learnableMoves: ['body-slam'],
  },
  {
    id: 16,
    name: 'Pidgey',
    types: ['normal', 'flying'],
    baseStats: { hp: 40, attack: 45, defense: 40, speed: 56 },
    startingMoves: ['tackle', 'peck'],
    learnableMoves: ['quick-attack', 'body-slam'],
  },
  {
    id: 10,
    name: 'Caterpie',
    types: ['bug'],
    baseStats: { hp: 45, attack: 30, defense: 35, speed: 45 },
    startingMoves: ['tackle', 'sleep-powder'],
    learnableMoves: [],
  },
  {
    id: 13,
    name: 'Weedle',
    types: ['bug', 'poison'],
    baseStats: { hp: 40, attack: 35, defense: 30, speed: 50 },
    startingMoves: ['tackle', 'poison-sting'],
    learnableMoves: [],
  },
  {
    id: 21,
    name: 'Spearow',
    types: ['normal', 'flying'],
    baseStats: { hp: 40, attack: 60, defense: 30, speed: 70 },
    startingMoves: ['peck', 'quick-attack'],
    learnableMoves: [],
  },
  {
    id: 23,
    name: 'Ekans',
    types: ['poison'],
    baseStats: { hp: 35, attack: 60, defense: 44, speed: 55 },
    startingMoves: ['tackle', 'poison-sting'],
    learnableMoves: [],
  },
  {
    id: 69,
    name: 'Bellsprout',
    types: ['grass', 'poison'],
    baseStats: { hp: 50, attack: 75, defense: 35, speed: 40 },
    startingMoves: ['tackle', 'vine-whip'],
    learnableMoves: ['razor-leaf'],
  },
  {
    id: 60,
    name: 'Poliwag',
    types: ['water'],
    baseStats: { hp: 40, attack: 50, defense: 40, speed: 90 },
    startingMoves: ['tackle', 'bubble'],
    learnableMoves: ['water-gun', 'surf'],
  },
  {
    id: 74,
    name: 'Geodude',
    types: ['rock', 'ground'],
    baseStats: { hp: 40, attack: 80, defense: 100, speed: 20 },
    startingMoves: ['tackle', 'harden'],
    learnableMoves: [],
  },
  {
    id: 39,
    name: 'Jigglypuff',
    types: ['normal'],
    baseStats: { hp: 115, attack: 45, defense: 20, speed: 20 },
    startingMoves: ['pound', 'sing'],
    learnableMoves: [],
  },
];

export function getPokemonById(id: number): PokemonSpecies | undefined {
  return [...STARTER_POKEMON, ...WILD_ENCOUNTER_POOL].find(p => p.id === id);
}

export function createPokemonInstance(
  speciesId: number,
  level: number
): PokemonInstance {
  const species = getPokemonById(speciesId);
  if (!species) {
    throw new Error(`Pokemon species ${speciesId} not found`);
  }

  // Calculate stats based on level (simplified formula)
  const stats: BaseStats = {
    hp: Math.floor(species.baseStats.hp + (level * 2)),
    attack: Math.floor(species.baseStats.attack + (level * 1.5)),
    defense: Math.floor(species.baseStats.defense + (level * 1.5)),
    speed: Math.floor(species.baseStats.speed + (level * 1.5)),
  };

  // Use the species' predefined starting moves
  const startingMoves = [...species.startingMoves];

  const maxHp = stats.hp;

  return {
    speciesId,
    level,
    currentHp: maxHp,
    maxHp,
    stats,
    moves: startingMoves,
    experience: 0,
    experienceToNextLevel: calculateXpForLevel(level + 1),
    statusCondition: 'normal',
    battlesWon: 0,
  };
}

export function calculateXpForLevel(level: number): number {
  // Start at ~100 XP for level 6, increase by ~25% each level
  const baseXp = 100;
  return Math.floor(baseXp * Math.pow(1.25, level - 6));
}

export function getStarterNames(): string[] {
  return STARTER_POKEMON.map(p => p.name);
}
