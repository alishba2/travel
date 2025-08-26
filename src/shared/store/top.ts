import { create } from 'zustand';
import { TopRefStore } from './types';

export const useTopRefStore = create<TopRefStore>()((set) => ({
	root: null,
	dispatchAddTopRef: (ref: HTMLDivElement) => set(() => ({ root: ref })),
	dispatchRemoveTopRef: () => set(() => ({ root: null })),
}));
