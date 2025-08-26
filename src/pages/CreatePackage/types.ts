export interface SelectedItemType {
	id: number;
	nameKor: string;
	nameEng: string;
	price: string;
	sequence: number;
	itemSrc: string;
	day: number;
	originPrice: string;
	desc: string;
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
