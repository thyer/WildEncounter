import { PokemonType, StatusCondition } from './pokemon';

export type MoveCategory = 'physical' | 'special' | 'status';

export interface MoveEffect {
  type: 'damage' | 'status' | 'stat-change';
  statusCondition?: StatusCondition;
  chance?: number; // Probability of secondary effect (0-100)
  statChange?: {
    stat: 'attack' | 'defense' | 'speed';
    amount: number; // Positive for boost, negative for reduction
  };
}

// Move definition (template)
export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  category: MoveCategory;
  power: number; // 0 for status moves
  accuracy: number; // 100 = always hits
  pp: number; // Power points
  effect?: MoveEffect;
}

// Move instance (move with current PP)
export interface MoveInstance {
  moveId: string;
  currentPp: number;
  maxPp: number;
}
