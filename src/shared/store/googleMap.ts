import { create } from 'zustand';
import { ItemSearchStore } from './types';

export const useGoogleMapStore = create<{
	dispatchMap: ({ isOpen, lat, lng }: { isOpen: boolean; lat: number; lng: number }) => void;
	isOpen: boolean;
	lat: number;
	lng: number;
}>((set) => ({
	isOpen: false,
	lat: 0,
	lng: 0,
	dispatchMap: ({ isOpen, lat, lng }: { isOpen: boolean; lat: number; lng: number }) =>
		set(() => ({ isOpen, lat, lng })),
}));
