import { ManagerType, BatchStatusType, BatchType, EstimateSender, UserStatus, ItemType } from './payload';

// Common
export interface TokenInfoSchema {
	expiresIn: number;
	accessToken: string;
	refreshToken: string;
	user: UserSchema;
}

// APIs

export interface UserListSchema {
	id: number;
	birth: string;
	createdAt: string;
	email: string;
	isMarketing: boolean;
	name: string;
	password: string;
	phone: string;
	username: string;

	role: 'A' | 'B' | 'C'; // A - 일반, B - 조합장, C - 추진위원장
	status: 'ready' | 'active' | 'deleted' | 'dormant';

	//

	profile: string;
	auth: 'naver' | 'kakao' | 'normal';
	reason: string;
	updatedAt: string;
	nextRole: null | string;
	failure: number;
}

export interface defaultAt {
	id: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserDetailSchema {
	birth: string;
	createdAt: string;
	email: string;
	failure: number;
	id: number;
	isMarketing: boolean;
	name: string;
	nextRole: null | string;
	password: string;
	phone: string;
	profile: string;
	reason: string;
	updatedAt: string;
	username: string;

	//

	boards: {
		areaId: number;
		content: string;
		createdAt: string;
		id: number;
		managerId: null | number;
		title: string;
		type: string;
		updatedAt: string;
		userId: number;
	}[];

	//

	role: 'A' | 'B' | 'C'; // A - 일반, B - 조합장, C - 추진위원장
	auth: 'naver' | 'kakao' | 'normal';
	status: 'ready' | 'active' | 'deleted' | 'dormant';
}
export interface UserSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	username: string;
	password: string;
	name: string;
	birth: string;
	phone: string;
	email: string;
	role: 'A' | 'B' | 'C'; // A - 일반, B - 조합장, C - 추진위원장
	status: 'ready' | 'active' | 'deleted' | 'dormant';
	auth: 'naver' | 'kakao' | 'normal';
	isMarketing?: boolean;
}

export interface ManagerSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	username: string;
	password: string;
	name: string;
	birth: string;
	phone: string;
	email: string;
	role: 'A' | 'B';
	status: 'ready' | 'active' | 'deleted' | 'dormant';
	isMarketing: boolean;
	failure: number;
}

export interface MeSchema {
	birth: string;
	createdAt: string;
	email: string;
	id: number;
	isMarketing: boolean;
	name: string;
	password: string;
	phone: string;
	role: 'A' | 'B';
	status: 'ready' | 'active' | 'deleted' | 'dormant';
	updatedAt: string;
	username: string;
}
export interface BoardFileSchema {
	boardId: number;
	createdAt: string;
	filename: string;
	id: number;
	updatedAt: string;
}

export interface BoardListSchema {
	id: number;
	boardItems: BoardFileSchema[];
	createdAt: string;
	updatedAt: string;
	title: string;
	content: string;
	type: 'A' | 'B'; // A - 공지사항, B - 재개발 이야기

	link: string;

	user: UserSchema;
	manager: ManagerSchema;
	areaId: number;

	isMain: boolean;
}

export type BoardList = [BoardListSchema[], number];

export interface BoardDetailSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	content: string;
	type: 'A' | 'B'; // A - 공지사항, B - 재개발 이야기

	user: UserSchema;
	manager: ManagerSchema;
}

export interface ParcelNumberSchema {
	pnu: string;
	coordinates: string;
}

export interface PreviewImageSchema {
	filename: string;
	imgUri: string;

	//
	id?: number;
	lastModified?: number;
}

// Item

export interface ItemSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	type: ItemType;
	nameKor: string;
	nameEng: string;
	price: number;
	address: string;
	addressEnglish: string;
	description: string;
	lat: string;
	lng: string;
	enable: boolean;
	agentPrices: [];
	sequence?: number;
	pricePolicy?: string;
	keyword: string;
	websiteLink: string | null;
	personalTag: string;
	enableContent: boolean;
	grade: string;
	files: [
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			type: string;
			itemSrc: string;
			itemSize: string;
		},
		{
			id: number;
			createdAt: string;
			updatedAt: string;
			type: string;
			itemSrc: string;
			itemSize: string;
		},
	];
}

export type GetItemListSchema = [ItemSchema[], number];

export interface ItemFileListSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	type: string;
	itemSrc: string;
	itemSize: string;
	itemId: number;
	item: {
		id: number;
		createdAt: string;
		updatedAt: string;
		type: string;
		nameKor: string;
		nameEng: string;
		price: string;
		address: string;
		addressEnglish: string;
		description: string;
		keyword: string;
		lat: string;
		lng: string;
		enable: boolean;
		pricePolicy: string;
	};
}

export type GetItemFileListSchema = [ItemFileListSchema[], number];

// Package

export interface PackageSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	salesStart: string;
	salesEnd: string;
	valid: boolean;
	thumbnail: string;
	totalPrice: number;
	description: string;
	packageDetails: [];
	titleEng: string;
	enable: boolean;
}

export type GetPackageListSchema = [PackageSchema[], number];

// Package-Detail
export interface GetPackageDetailListSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	title: string;
	titleEng: string;
	description: string;
	salesStart: string;
	salesEnd: string;
	valid: boolean;
	enable: boolean;
	thumbnail: string;
	autoSumAmount: number;
	totalPrice: number;
	agentId: null;
	timeline: string;
	packageDetails: {
		id: number;
		price: number;
		days: number;
		sequence: number;
		item: ItemSchema;
	}[];
}

// Agent
export interface ManagerMeSchema {
	id: number;
	createdAt: string;
	updatedAt: string;
	type: ManagerType;
	username: string;
	password: string;
	agentName: string;
	status: string;
	grade: string;
}

export interface AgentSchema {
	agentName: string;
	agentTel: string;
	createdAt: string;
	id: number;
	password: string;
	status: string;
	type: string;
	updatedAt: string;
	username: string;
	grade: string;
}

export type GetAgentListSchema = [AgentSchema[], number];
export interface UserScheme extends defaultAt {
	username: string;
	name: string;
	password: string;
	lastVisit: Date;
	status: UserStatus;
	batches: BatchSchema[];
}

export interface EstimateSchema extends defaultAt {
	receiveAt: Date;
	comment: any;
	sender: EstimateSender;
	summary: string;
	timeline: string;
	autoSumAmount: number;
	batchId: number;
	batch: BatchSchema;
	estimateDetails: EstimateDetailSchema[];
}

export interface EstimateDetailSchema extends defaultAt {
	price: number;
	days: number;
	sequence: number;
	estimateId: number;
	itemId: number;
	quantity: number;
	estimate: EstimateSchema;
	item: ItemSchema;
	enableContent: boolean;
}

export interface BatchSchema extends defaultAt {
	type: BatchType;
	status: BatchStatusType;
	title: string;
	startDate: Date;
	endDate: Date;
	autoSumAmount: number;
	adultsCount: number;
	childrenCount: number;
	infantsCount: number;
	userId: number;
	user: UserSchema;
	recipient: string;
	estimates: EstimateSchema[];
	validDate: Date;
	onlyPlace: boolean;
	hidePrice: boolean;
	quotation: string;
	preparedBy: string;
	address: string;
	email: string;
	officeHours: string;
	officeNumber: string;
	emergencyNumber: string;
}

export type BatchList = [BatchSchema[], number];

export interface EstimateOneWayList {
	batchInfo: BatchSchema;
	estimateInfo: EstimateSchema;
	estimateDetails: EstimateDetailSchema[];
}

export interface GetBatchCalendarMonthSchema {
	endDate: string;
	headcount: string;
	id: number;
	recipient: string;
	startDate: string;
	status: string;
	title: string;
	type: string;
}

export interface GradeSchema {
	id: number;
	grade: string;
}
