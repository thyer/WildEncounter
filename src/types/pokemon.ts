// Pokemon type system
export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric'
  | 'grass' | 'ice' | 'fighting' | 'poison'
  | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark'
  | 'steel' | 'fairy';

export type StatusCondition = 'normal' | 'poisoned' | 'asleep' | 'paralyzed';

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

// Pokemon species definition (template for creating instances)
export interface PokemonSpecies {
  id: number;
  name: string;
  types: PokemonType[];
  baseStats: BaseStats;
  startingMoves: string[]; // Move IDs the Pokemon starts with
  learnableMoves: string[]; // Move IDs that this species can learn later
  spriteUrl?: string;
}

// Pokemon instance (actual pokemon in battle/player's team)
export interface PokemonInstance {
  speciesId: number;
  level: number;
  currentHp: number;
  maxHp: number;
  stats: BaseStats;
  moves: string[]; // Move IDs (2-4 moves)
  experience: number;
  experienceToNextLevel: number;
  statusCondition: StatusCondition;
  battlesWon: number; // Track battles for move learning
}
