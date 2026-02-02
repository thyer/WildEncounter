import { Move } from '../types/move';

export const MOVES: Record<string, Move> = {
  // Normal type moves
  'tackle': {
    id: 'tackle',
    name: 'Tackle',
    type: 'normal',
    category: 'physical',
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  'pound': {
    id: 'pound',
    name: 'Pound',
    type: 'normal',
    category: 'physical',
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  'quick-attack': {
    id: 'quick-attack',
    name: 'Quick Attack',
    type: 'normal',
    category: 'physical',
    power: 40,
    accuracy: 100,
    pp: 30,
  },
  'sing': {
    id: 'sing',
    name: 'Sing',
    type: 'normal',
    category: 'status',
    power: 0,
    accuracy: 90,
    pp: 15,
    effect: {
      type: 'status',
      statusCondition: 'asleep',
      chance: 100,
    },
  },
  'body-slam': {
    id: 'body-slam',
    name: 'Body Slam',
    type: 'normal',
    category: 'physical',
    power: 85,
    accuracy: 100,
    pp: 15,
  },
  'harden': {
    id: 'harden',
    name: 'Harden',
    type: 'normal',
    category: 'status',
    power: 0,
    accuracy: 100,
    pp: 30,
    effect: {
      type: 'stat-change',
      statChange: {
        stat: 'defense',
        amount: 1,
      },
    },
  },

  // Electric type moves
  'thunder-shock': {
    id: 'thunder-shock',
    name: 'Thunder Shock',
    type: 'electric',
    category: 'special',
    power: 40,
    accuracy: 100,
    pp: 30,
  },
  'thunderbolt': {
    id: 'thunderbolt',
    name: 'Thunderbolt',
    type: 'electric',
    category: 'special',
    power: 90,
    accuracy: 100,
    pp: 15,
  },
  'thunder-wave': {
    id: 'thunder-wave',
    name: 'Thunder Wave',
    type: 'electric',
    category: 'status',
    power: 0,
    accuracy: 90,
    pp: 20,
    effect: { type: 'status', statusCondition: 'paralyzed', chance: 100 },
  },

  // Water type moves
  'water-gun': {
    id: 'water-gun',
    name: 'Water Gun',
    type: 'water',
    category: 'special',
    power: 40,
    accuracy: 100,
    pp: 25,
  },
  'bubble': {
    id: 'bubble',
    name: 'Bubble',
    type: 'water',
    category: 'special',
    power: 40,
    accuracy: 100,
    pp: 30,
  },
  'hydro-pump': {
    id: 'hydro-pump',
    name: 'Hydro Pump',
    type: 'water',
    category: 'special',
    power: 110,
    accuracy: 80,
    pp: 5,
  },
  'surf': {
    id: 'surf',
    name: 'Surf',
    type: 'water',
    category: 'special',
    power: 90,
    accuracy: 100,
    pp: 15,
  },

  // Fire type moves
  'ember': {
    id: 'ember',
    name: 'Ember',
    type: 'fire',
    category: 'special',
    power: 40,
    accuracy: 100,
    pp: 25,
  },
  'flamethrower': {
    id: 'flamethrower',
    name: 'Flamethrower',
    type: 'fire',
    category: 'special',
    power: 90,
    accuracy: 100,
    pp: 15,
  },
  'fire-blast': {
    id: 'fire-blast',
    name: 'Fire Blast',
    type: 'fire',
    category: 'special',
    power: 110,
    accuracy: 85,
    pp: 5,
  },

  // Grass type moves
  'vine-whip': {
    id: 'vine-whip',
    name: 'Vine Whip',
    type: 'grass',
    category: 'physical',
    power: 45,
    accuracy: 100,
    pp: 25,
  },
  'razor-leaf': {
    id: 'razor-leaf',
    name: 'Razor Leaf',
    type: 'grass',
    category: 'physical',
    power: 55,
    accuracy: 95,
    pp: 25,
  },
  'solar-beam': {
    id: 'solar-beam',
    name: 'Solar Beam',
    type: 'grass',
    category: 'special',
    power: 120,
    accuracy: 100,
    pp: 10,
  },
  'sleep-powder': {
    id: 'sleep-powder',
    name: 'Sleep Powder',
    type: 'grass',
    category: 'status',
    power: 0,
    accuracy: 75,
    pp: 15,
    effect: {
      type: 'status',
      statusCondition: 'asleep',
      chance: 100,
    },
  },

  // Psychic type moves
  'confusion': {
    id: 'confusion',
    name: 'Confusion',
    type: 'psychic',
    category: 'special',
    power: 50,
    accuracy: 100,
    pp: 25,
  },
  'psychic': {
    id: 'psychic',
    name: 'Psychic',
    type: 'psychic',
    category: 'special',
    power: 90,
    accuracy: 100,
    pp: 10,
  },

  // Bug type moves
  'string-shot': {
    id: 'string-shot',
    name: 'String Shot',
    type: 'bug',
    category: 'status',
    power: 0,
    accuracy: 95,
    pp: 40,
  },

  // Poison type moves
  'poison-sting': {
    id: 'poison-sting',
    name: 'Poison Sting',
    type: 'poison',
    category: 'physical',
    power: 10,
    accuracy: 100,
    pp: 35,
    effect: {
      type: 'status',
      statusCondition: 'poisoned',
      chance: 30,
    },
  },

  // Flying type moves
  'peck': {
    id: 'peck',
    name: 'Peck',
    type: 'flying',
    category: 'physical',
    power: 35,
    accuracy: 100,
    pp: 35,
  },
};

export function getMoveById(id: string): Move | undefined {
  return MOVES[id];
}

export function getMoveName(id: string): string {
  return MOVES[id]?.name || 'Unknown Move';
}
