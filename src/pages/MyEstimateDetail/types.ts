import { ItemType } from '@typings/payload';

export interface SelectedEstimateItemType {
	id: number;
	itemId: number;
	nameKor: string;
	nameEng: string;
	price: string | null;
	sequence: number;
	itemSrc: string;
	pricePolicy: any;
	day: number;
	estimateId: number;
	quantity: number;
	originPrice: string;
	desc: string;
	itemType: ItemType;
	enableContent: boolean;
	// files: [
	// 	{
	// 		id: number;
	// 		createdAt: string;
	// 		updatedAt: string;
	// 		type: string;
	// 		itemSrc: string;
	// 		itemSize: string;
	// 	},
	// 	{
	// 		id: number;
	// 		createdAt: string;
	// 		updatedAt: string;
	// 		type: string;
	// 		itemSrc: string;
	// 		itemSize: string;
	// 	},
	// ];
}

export interface ItemGroups {
	[key: string]: number[];
}
