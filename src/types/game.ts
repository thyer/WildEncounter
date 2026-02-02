import { PokemonInstance, StatusCondition } from './pokemon';
import { BattleState } from './battle';

export type GameScreen = 'selection' | 'battle' | 'victory';

export interface ItemEffect {
  type: 'heal' | 'cure-status';
  amount?: number; // HP restored
  curesStatus?: StatusCondition;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  effect: ItemEffect;
}

export type Inventory = Record<string, number>;

export interface PlayerState {
  selectedPokemon: PokemonInstance | null;
  inventory: Inventory;
  battlesWon: number;
  totalBattles: number;
}

export interface GameState {
  screen: GameScreen;
  player: PlayerState;
  battle: BattleState | null;
}
