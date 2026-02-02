import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, GameScreen } from '../types/game';
import { BattleAction, BattleResult } from '../types/battle';
import { createPokemonInstance, getPokemonById } from '../data/pokemon';
import { getMoveById } from '../data/moves';
import { getItemById, STARTING_INVENTORY } from '../data/items';
import { generateWildPokemon, shouldLearnNewMove, selectRandomMove, addMoveToSet } from '../utils/randomEncounter';
import { calculateDamage, applyStatusDamage, canAttack, checkAccuracy, tryWakeUp } from '../utils/battleCalculations';
import { calculateXpGain, addExperience } from '../utils/xpCalculations';
import { getTypeMultiplier, getEffectivenessText } from '../data/typeChart';

interface GameStore extends GameState {
  // Actions
  selectStarter: (speciesId: number) => void;
  startBattle: () => void;
  executePlayerAction: (action: BattleAction) => Promise<BattleResult | null>;
  endBattle: (result: BattleResult) => void;
  useItem: (itemId: string) => boolean;
  resetGame: () => void;
  setScreen: (screen: GameScreen) => void;

  // Helpers
  canUseItem: (itemId: string) => boolean;
}

const initialState: GameState = {
  screen: 'selection',
  player: {
    selectedPokemon: null,
    inventory: { ...STARTING_INVENTORY },
    battlesWon: 0,
    totalBattles: 0,
  },
  battle: null,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectStarter: (speciesId: number) => {
        const pokemon = createPokemonInstance(speciesId, 5); // Start at level 5
        set((state) => ({
          player: {
            ...state.player,
            selectedPokemon: pokemon,
          },
        }));
      },

      startBattle: () => {
        const { player } = get();
        if (!player.selectedPokemon) return;

        const wildPokemon = generateWildPokemon(player.selectedPokemon.level);

        set((state) => ({
          screen: 'battle',
          battle: {
            phase: 'intro',
            playerPokemon: { ...state.player.selectedPokemon! },
            wildPokemon,
            turn: 1,
            battleLog: [`A wild ${getPokemonById(wildPokemon.speciesId)?.name} appeared!`],
            isPlayerTurn: true,
          },
          player: {
            ...state.player,
            totalBattles: state.player.totalBattles + 1,
          },
        }));

        // Transition to player turn after intro
        setTimeout(() => {
          set((state) => ({
            battle: state.battle ? { ...state.battle, phase: 'player-turn' } : null,
          }));
        }, 1000);
      },

      executePlayerAction: async (action: BattleAction): Promise<BattleResult | null> => {
        const { battle } = get();
        if (!battle || battle.phase !== 'player-turn') return null;

        set((state) => ({
          battle: state.battle ? { ...state.battle, phase: 'executing' } : null,
        }));

        const battleLog: string[] = [...battle.battleLog];
        let playerPokemon = { ...battle.playerPokemon };
        let wildPokemon = { ...battle.wildPokemon };

        // Check if sleeping player Pokemon wakes up at start of turn
        if (playerPokemon.statusCondition === 'asleep' && tryWakeUp(playerPokemon)) {
          battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} woke up!`);
        }

        // Check if player Pokemon can attack (handles sleep and paralysis)
        if (action.type === 'move' && !canAttack(playerPokemon)) {
          if (playerPokemon.statusCondition === 'asleep') {
            battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} is fast asleep!`);
          } else if (playerPokemon.statusCondition === 'paralyzed') {
            battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} is paralyzed! It can't move!`);
          }
          // Skip to wild Pokemon's turn
        } else if (action.type === 'move' && action.moveId) {
          const move = getMoveById(action.moveId);
          if (!move) return null;

          battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} used ${move.name}!`);

          if (!checkAccuracy(move)) {
            battleLog.push('But it missed!');
          } else if (move.effect?.type === 'stat-change' && move.effect.statChange) {
            // Handle stat-boosting moves
            const { stat, amount } = move.effect.statChange;
            playerPokemon.stats[stat] += amount;
            const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
            battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name}'s ${statName} rose!`);
          } else {
            const damage = calculateDamage(playerPokemon, wildPokemon, move);
            wildPokemon.currentHp = Math.max(0, wildPokemon.currentHp - damage);

            if (damage > 0) {
              const species = getPokemonById(wildPokemon.speciesId);
              if (species) {
                const effectiveness = getTypeMultiplier(move.type, species.types);
                const effectText = getEffectivenessText(effectiveness);
                if (effectText) battleLog.push(effectText);
              }
            }

            // Apply status effects
            if (move.effect?.type === 'status' && move.effect.statusCondition && wildPokemon.statusCondition === 'normal') {
              const chance = move.effect.chance || 100;
              if (Math.random() * 100 < chance) {
                wildPokemon.statusCondition = move.effect.statusCondition;
                const statusName = move.effect.statusCondition.charAt(0).toUpperCase() + move.effect.statusCondition.slice(1);
                battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} was ${move.effect.statusCondition}!`);
              }
            }
          }
        } else if (action.type === 'item' && action.itemId) {
          const item = getItemById(action.itemId);
          if (!item || !get().canUseItem(action.itemId)) return null;

          // Use item
          get().useItem(action.itemId);
          battleLog.push(`Used ${item.name}!`);

          if (item.effect.type === 'heal' && item.effect.amount) {
            const healAmount = Math.min(item.effect.amount, playerPokemon.maxHp - playerPokemon.currentHp);
            playerPokemon.currentHp += healAmount;
            battleLog.push(`Restored ${healAmount} HP!`);
          } else if (item.effect.type === 'cure-status' && item.effect.curesStatus) {
            if (playerPokemon.statusCondition === item.effect.curesStatus) {
              playerPokemon.statusCondition = 'normal';
              battleLog.push(`Cured ${item.effect.curesStatus}!`);
            } else {
              battleLog.push(`But it had no effect!`);
            }
          }
        }

        // Check if wild Pokemon fainted
        if (wildPokemon.currentHp <= 0) {
          battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} fainted!`);

          // Calculate XP and level up
          const xpGain = calculateXpGain(wildPokemon.level, playerPokemon.level);
          battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} gained ${xpGain} XP!`);

          const oldLevel = playerPokemon.level;
          playerPokemon = addExperience(playerPokemon, xpGain);
          const leveledUp = playerPokemon.level > oldLevel;

          if (leveledUp) {
            battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} grew to level ${playerPokemon.level}!`);
          }

          // Check if should learn new move
          playerPokemon.battlesWon += 1;
          const species = getPokemonById(playerPokemon.speciesId);
          let learnedMove: string | undefined;

          if (species && shouldLearnNewMove(playerPokemon.battlesWon)) {
            const newMove = selectRandomMove(species.learnableMoves, playerPokemon.moves);
            if (newMove) {
              const moveName = getMoveById(newMove)?.name;
              if (playerPokemon.moves.length >= 4) {
                const forgotMove = getMoveById(playerPokemon.moves[0])?.name;
                battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} forgot ${forgotMove}...`);
              }
              playerPokemon.moves = addMoveToSet(playerPokemon.moves, newMove);
              battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} learned ${moveName}!`);
              learnedMove = newMove;
            }
          }

          const result: BattleResult = {
            victory: true,
            xpGained: xpGain,
            leveledUp,
            newLevel: leveledUp ? playerPokemon.level : undefined,
            learnedMove,
          };

          set((state) => ({
            battle: {
              ...battle,
              phase: 'victory',
              playerPokemon,
              wildPokemon,
              battleLog,
            },
            player: {
              ...state.player,
              selectedPokemon: playerPokemon,
              battlesWon: state.player.battlesWon + 1,
            },
          }));

          return result;
        }

        // Wild Pokemon's turn (if it didn't faint)
        // Check if sleeping Pokemon wakes up
        if (wildPokemon.statusCondition === 'asleep' && tryWakeUp(wildPokemon)) {
          battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} woke up!`);
        }

        if (!canAttack(wildPokemon)) {
          if (wildPokemon.statusCondition === 'asleep') {
            battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} is fast asleep!`);
          } else if (wildPokemon.statusCondition === 'paralyzed') {
            battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} is paralyzed! It can't move!`);
          }
        } else {
          // Wild Pokemon attacks with random move
          const wildMove = getMoveById(wildPokemon.moves[Math.floor(Math.random() * wildPokemon.moves.length)]);
          if (wildMove) {
            battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name} used ${wildMove.name}!`);

            if (!checkAccuracy(wildMove)) {
              battleLog.push('But it missed!');
            } else if (wildMove.effect?.type === 'stat-change' && wildMove.effect.statChange) {
              // Handle stat-boosting moves
              const { stat, amount } = wildMove.effect.statChange;
              wildPokemon.stats[stat] += amount;
              const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
              battleLog.push(`Wild ${getPokemonById(wildPokemon.speciesId)?.name}'s ${statName} rose!`);
            } else {
              const damage = calculateDamage(wildPokemon, playerPokemon, wildMove);
              playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - damage);

              if (damage > 0) {
                const species = getPokemonById(playerPokemon.speciesId);
                if (species) {
                  const effectiveness = getTypeMultiplier(wildMove.type, species.types);
                  const effectText = getEffectivenessText(effectiveness);
                  if (effectText) battleLog.push(effectText);
                }
              }

              // Apply status effects
              if (wildMove.effect?.type === 'status' && wildMove.effect.statusCondition && playerPokemon.statusCondition === 'normal') {
                const chance = wildMove.effect.chance || 100;
                if (Math.random() * 100 < chance) {
                  playerPokemon.statusCondition = wildMove.effect.statusCondition;
                  battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} was ${wildMove.effect.statusCondition}!`);
                }
              }
            }
          }
        }

        // Apply status damage
        const poisonDamage = applyStatusDamage(playerPokemon);
        if (poisonDamage > 0) {
          playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - poisonDamage);
          battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} is hurt by poison!`);
        }

        // Check if player Pokemon fainted
        if (playerPokemon.currentHp <= 0) {
          battleLog.push(`${getPokemonById(playerPokemon.speciesId)?.name} fainted!`);

          const result: BattleResult = {
            victory: false,
            xpGained: 0,
            leveledUp: false,
          };

          set((state) => ({
            battle: {
              ...battle,
              phase: 'defeat',
              playerPokemon,
              wildPokemon,
              battleLog,
            },
            player: {
              ...state.player,
              selectedPokemon: playerPokemon,
            },
          }));

          return result;
        }

        // Continue battle
        set((state) => ({
          battle: {
            ...battle,
            phase: 'player-turn',
            playerPokemon,
            wildPokemon,
            battleLog,
            turn: battle.turn + 1,
          },
          player: {
            ...state.player,
            selectedPokemon: playerPokemon,
          },
        }));

        return null;
      },

      endBattle: () => {
        const { player } = get();

        // Restore Pokemon HP for next battle
        const pokemon = player.selectedPokemon;
        if (pokemon) {
          pokemon.currentHp = pokemon.maxHp;
          pokemon.statusCondition = 'normal';
        }

        set({
          screen: 'selection',
          battle: null,
        });
      },

      useItem: (itemId: string) => {
        const { player } = get();
        if (!player.inventory[itemId] || player.inventory[itemId] <= 0) {
          return false;
        }

        set((state) => ({
          player: {
            ...state.player,
            inventory: {
              ...state.player.inventory,
              [itemId]: state.player.inventory[itemId] - 1,
            },
          },
        }));

        return true;
      },

      canUseItem: (itemId: string) => {
        const { player } = get();
        return (player.inventory[itemId] || 0) > 0;
      },

      setScreen: (screen: GameScreen) => {
        set({ screen });
      },

      resetGame: () => {
        set(initialState);
      },
    }),
    {
      name: 'pokemon-battle-storage',
      partialize: (state) => ({
        player: state.player,
      }),
    }
  )
);
