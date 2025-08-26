import { create } from 'zustand';
import { ItemSearchStore } from './types';

export const useItemSearchStore = create<ItemSearchStore>((set) => ({
	itemId: 0,
	dispatchItemId: (itemId: number) => set(() => ({ itemId })),
}));
