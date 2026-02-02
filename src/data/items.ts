import { Item } from '../types/game';

export const ITEMS: Record<string, Item> = {
  'potion': {
    id: 'potion',
    name: 'Potion',
    description: 'Restores 30 HP',
    effect: {
      type: 'heal',
      amount: 30,
    },
  },
  'super-potion': {
    id: 'super-potion',
    name: 'Super Potion',
    description: 'Restores 50 HP',
    effect: {
      type: 'heal',
      amount: 50,
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
  'super-potion': 1,
  'awakening': 2,
  'antidote': 2,
};
