import { Item } from '../types/game';

export const ITEMS: Record<string, Item> = {
  'potion': {
    id: 'potion',
    name: 'Potion',
    description: 'Restores 20 HP',
    effect: {
      type: 'heal',
      amount: 20,
    },
  },
  'awakening': {
    id: 'awakening',
    name: 'Awakening',
    description: 'Cures sleep',
    effect: {
      type: 'cure-status',
      curesStatus: 'asleep',
    },
  },
  'antidote': {
    id: 'antidote',
    name: 'Antidote',
    description: 'Cures poison',
    effect: {
      type: 'cure-status',
      curesStatus: 'poisoned',
    },
  },
};

export function getItemById(id: string): Item | undefined {
  return ITEMS[id];
}

export const STARTING_INVENTORY: Record<string, number> = {
  'potion': 5,
  'awakening': 2,
  'antidote': 2,
};
