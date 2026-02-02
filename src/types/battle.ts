import { PokemonInstance } from './pokemon';

export type BattlePhase =
  | 'intro'           // Wild Pokemon appeared!
  | 'player-turn'     // Player selecting action
  | 'executing'       // Moves being executed
  | 'victory'         // Player won
  | 'defeat'          // Player lost
  | 'fled';           // Player fled (not used in current implementation)

export interface BattleState {
  phase: BattlePhase;
  playerPokemon: PokemonInstance;
  wildPokemon: PokemonInstance;
  turn: number;
  battleLog: string[];
  isPlayerTurn: boolean;
}

export interface BattleAction {
  type: 'move' | 'item';
  moveId?: string;
  itemId?: string;
}

export interface BattleResult {
  victory: boolean;
  xpGained: number;
  leveledUp: boolean;
  newLevel?: number;
  learnedMove?: string;
}
