import { PokemonInstance } from '../types/pokemon';

export function calculateXpGain(wildPokemonLevel: number, playerLevel: number): number {
  // Base ~80 XP, slight variation based on level difference
  const baseXp = 80;
  const levelDifference = wildPokemonLevel - playerLevel;
  const multiplier = 1 + (levelDifference * 0.1); // +/-10% per level difference

  return Math.max(40, Math.floor(baseXp * multiplier));
}

export function getXpForNextLevel(currentLevel: number): number {
  // Start at ~100 XP for level 6, increase by ~25% each level
  const baseXp = 100;
  return Math.floor(baseXp * Math.pow(1.25, currentLevel - 5));
}

export function checkLevelUp(pokemon: PokemonInstance): boolean {
  return pokemon.level < 15 && pokemon.experience >= pokemon.experienceToNextLevel;
}

export function levelUpPokemon(pokemon: PokemonInstance): PokemonInstance {
  const newLevel = pokemon.level + 1;

  // Increase stats on level up
  const hpIncrease = Math.floor(Math.random() * 3) + 3; // 3-5 HP per level
  const statIncrease = Math.floor(Math.random() * 2) + 1; // 1-2 per stat

  const newMaxHp = pokemon.maxHp + hpIncrease;
  const newStats = {
    hp: pokemon.stats.hp + hpIncrease,
    attack: pokemon.stats.attack + statIncrease,
    defense: pokemon.stats.defense + statIncrease,
    speed: pokemon.stats.speed + statIncrease,
  };

  return {
    ...pokemon,
    level: newLevel,
    maxHp: newMaxHp,
    currentHp: newMaxHp, // Restore to full HP on level up
    stats: newStats,
    experience: pokemon.experience - pokemon.experienceToNextLevel,
    experienceToNextLevel: getXpForNextLevel(newLevel),
  };
}

export function addExperience(
  pokemon: PokemonInstance,
  xpGain: number
): PokemonInstance {
  let updated = {
    ...pokemon,
    experience: pokemon.experience + xpGain,
  };

  // Check for level ups (can level up multiple times)
  while (checkLevelUp(updated)) {
    updated = levelUpPokemon(updated);
  }

  return updated;
}
