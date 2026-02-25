/**
 * Sprite utility for Pokemon battle visuals
 * Sprites should be 32x32 pixel PNG images placed in /public/sprites/
 *
 * Naming convention: [pokemon-id].png (e.g., "25.png" for Pikachu)
 */

export function getSpriteUrl(pokemonId: number): string {
  // Use Vite's base URL to handle different deployment paths
  const base = import.meta.env.BASE_URL;
  return `${base}sprites/${pokemonId}.png`;
}

export function getSpriteFallback(_pokemonId: number, pokemonName: string): string {
  // Returns the first letter as fallback if sprite doesn't load
  return pokemonName[0];
}

/**
 * Type-based colors for placeholder sprites
 * Use these if you want to generate colored placeholder sprites
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
