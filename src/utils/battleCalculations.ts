import { PokemonInstance } from '../types/pokemon';
import { Move } from '../types/move';
import { getTypeMultiplier } from '../data/typeChart';
import { getPokemonById } from '../data/pokemon';

export function calculateDamage(
  attacker: PokemonInstance,
  defender: PokemonInstance,
  move: Move
): number {
  if (move.power === 0) {
    return 0; // Status moves don't deal damage
  }

  // Get defender's types for effectiveness calculation
  const defenderSpecies = getPokemonById(defender.speciesId);
  if (!defenderSpecies) return 0;

  const typeMultiplier = getTypeMultiplier(move.type, defenderSpecies.types);

  // Simplified damage formula based on Pokemon Red/Blue
  // Damage = ((2 * Level / 5 + 2) * Power * Attack / Defense) * TypeMultiplier
  const levelFactor = (2 * attacker.level / 5 + 2);
  const attackStat = move.category === 'physical' ? attacker.stats.attack : attacker.stats.attack;
  const defenseStat = move.category === 'physical' ? defender.stats.defense : defender.stats.defense;

  const baseDamage = (levelFactor * move.power * attackStat / defenseStat) / 50 + 2;
  const finalDamage = Math.floor(baseDamage * typeMultiplier);

  return Math.max(1, finalDamage); // Minimum 1 damage
}

export function determineFirstAttacker(
  pokemon1: PokemonInstance,
  pokemon2: PokemonInstance
): 'pokemon1' | 'pokemon2' {
  // Faster pokemon attacks first
  if (pokemon1.stats.speed > pokemon2.stats.speed) {
    return 'pokemon1';
  } else if (pokemon2.stats.speed > pokemon1.stats.speed) {
    return 'pokemon2';
  }
  // Speed tie: random
  return Math.random() < 0.5 ? 'pokemon1' : 'pokemon2';
}

export function applyStatusDamage(pokemon: PokemonInstance): number {
  // Poison deals 1/8 max HP per turn
  if (pokemon.statusCondition === 'poisoned') {
    return Math.floor(pokemon.maxHp / 8);
  }
  return 0;
}

export function canAttack(pokemon: PokemonInstance): boolean {
  // Sleeping pokemon have 33% chance to wake up each turn
  if (pokemon.statusCondition === 'asleep') {
    return false; // Will handle wake-up in battle logic
  }
  // Paralysis has 25% chance to prevent attack
  if (pokemon.statusCondition === 'paralyzed') {
    return Math.random() >= 0.25;
  }
  return true;
}

export function tryWakeUp(pokemon: PokemonInstance): boolean {
  // 33% chance to wake up from sleep
  if (pokemon.statusCondition === 'asleep' && Math.random() < 0.33) {
    pokemon.statusCondition = 'normal';
    return true;
  }
  return false;
}

export function checkAccuracy(move: Move): boolean {
  // Simplified: accuracy check (no evasion/accuracy modifiers)
  return Math.random() * 100 < move.accuracy;
}
