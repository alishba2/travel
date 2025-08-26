export type ItemType = '여행지' | '이동수단' | '컨텐츠' | '숙박';
export type ManagerType = '관리자' | '에이전트';
export type BatchType = 'one-way' | 'two-way';
export type BatchStatusType = '대기' | '요청' | '답변완료' | '최종완료' | '취소';
export type UserStatus = '정상' | '삭제';
export type EstimateSender = '관리자' | '유저';

export interface ExcelDownloadPayload {
	headerGap?: number;
	header?: any;
	list: any[];
	fileName?: string;
	sheetName?: string;
}

export interface PagingPayload {
	page?: number;
	countPerPage?: number;
}

export interface MustPagingPayload {
	page: number;
	countPerPage: number;
}

export interface CreateUserPayload {
	userId: string;
	name: string;
	password: string;
	passwordConfirm: string;
}
export interface GetBoardListPayload extends MustPagingPayload {
	title?: string;
	content?: string;
	username?: string; // 작성자 ID
	name?: string; // 작성자 이름

	//

	type?: string; // A - 공지사항, B - 재개발 이야기
	isMain?: boolean;
}

export interface GetAreaListSimplePayload extends MustPagingPayload {
	keyword?: string;
}

export interface CreateBoardPayload {
	title: string;
	content: string;
	link?: string;
	type: string; // A - 공지사항, B - 재개발 이야기
	userId?: number;
	managerId?: number;
	files?: FormData;
}

export interface UpdateBoardPayload extends CreateBoardPayload {
	id: number;
	savedFileNames?: string;
}

export interface GetManagerListPayload extends MustPagingPayload {
	username?: string;
	name?: string;
	birth?: string;
	phone?: string;
	email?: string;
	role?: string; // A - 관리자, B - 공인중개사
	status?: string; // ready, active, deleted, dormant
	isMarketing?: boolean;
}

export interface CreateManagerSignInPayload {
	username: string;
	password: string;
}

export interface CreateManagerSignUpPayload {
	username: string;
	password: string;
	name: string;
	phone: string;
	verifyCode: string;
	role: string; // A - 관리자, B - 공인중개사
	email?: string;
	isMarketing?: boolean;
	birth?: string;
}

export interface CreateSendAuthCodePayload {
	receiver: string;
}

// Item
export interface GetItemListPayload extends MustPagingPayload {
	type?: ItemType;
	nameEng?: string;
	nameKor?: string;
	agentId?: number;
	enable?: boolean;
}

export interface GetItemSearchPayload extends MustPagingPayload {
	type?: ItemType;
	keyword: string;
	grade: string;
}

export interface GetItemFileSearchPayload extends MustPagingPayload {
	keyword?: string;
	type?: string;
}

export interface PostItemPayload {
	type: ItemType;
	nameKor: string;
	nameEng: string;
	price: number;
	address: string;
	addressEnglish: string;
	description: string;
	lat: number;
	lng: number;
	thumbnail: any;
	details?: any[];
	pricePolicy: string;
	keyword: string;
	websiteLink?: string;
}

export interface PutItemPayload {
	id: number;
	type: ItemType;
	nameKor: string;
	nameEng: string;
	price: number;
	address: string;
	addressEnglish: string;
	description: string;
	lat: number;
	lng: number;
	deleteFileIds: string[];
	thumbnail: any;
	details?: any[];
	enable: boolean;
	pricePolicy: string;
	websiteLink?: string;
	keyword: string;
}

export interface DeleteItemPayload {
	ids: string;
}

// Package

export interface GetPackageListPayload extends MustPagingPayload {
	title?: string;
	startDate?: string;
	endDate?: string;
	valid?: boolean;
	agentId?: number;
	enable: boolean;
}

export interface PostPackagePayload {
	title: string;
	titleEng: string;
	description: string;
	salesStart: string;
	salesEnd: string;
	agentId?: number;
	totalPrice: number;
	thumbnail?: any[];
}
export interface PutPackagePayload {
	id: number;
	title: string;
	titleEng: string;
	description: string;
	salesStart: string;
	salesEnd: string;
	totalPrice: number;
	agentId: number;
	valid: boolean;
	enable: boolean;
	thumbnail: any[];
}

// Package-Detail

export interface PostPackageDetailPayload {
	items: {
		packageId: number;
		itemId: number;
		price: number | null;
		days: number;
		sequence: number;
	}[];

	description: string;
	timeline: string;
}

// Agent

export interface PostAgentSigninPayload {
	username: string;
	password: string;
}

export interface PostAgentAddPayload {
	type: ManagerType;
	agentName: string;
	username: string;
	password: string;
	agentTel: string;
	grade: string;
}

export interface PostAgentValidateUsernamePayload {
	username: string;
}

export interface GetAgentListPayload extends MustPagingPayload {
	agentName?: string;
	agentTel?: string;
	username?: string;
}

export interface PutAgentDeletePayload {
	id: number;
}

export interface PutAgentNewPasswordPayload {
	originalPassword: string;
	newPassword: string;
}

export interface PutAgentEditPayload {
	id: number;
	agentName?: string;
	agentTel?: string;
	password?: string;
	grade: string;
}

export interface GetBatchListPayload extends MustPagingPayload {
	title?: string;
	userName?: string;
	status?: BatchStatusType;
	type: BatchType;
	recipient?: string;
	startDate?: Date;
	order?: 'ASC' | 'DESC';
	orderBy?: 'Date Created' | 'Price' | 'Total Number of People' | 'Travel Start Date';
}

export interface GetBatchCalendarMonthPayload {
	monthYear: string;
}

export interface PostBatchPayload {
	status?: string;
	type: string;
	userId?: number;
	title?: string;
	recipient?: string;
	startDate: Date;
	endDate: Date;
	adultsCount: number;
	childrenCount: number;
	infantsCount: number;
	onlyPlace: boolean;
	hidePrice: boolean;
}
export interface PostBatchCopyPayload {
	batchId: number;
}

export interface PutBatchPayload {
	id: number;
	status?: BatchStatusType;
	title?: string;
	totalPrice?: number;
	startDate?: Date;
	endDate?: Date;
	userId?: number;
	adultsCount?: number;
	childrenCount?: number;
	infantsCount?: number;
	recipient?: string;
	validDate?: Date;
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

export interface GetMyEstimateOneWayPayload {
	batchId: number;
}

export interface PostMyEstimateDetailItem {
	estimateId: number;
	itemId: number;
	price: number | null;
	days: number;
	sequence: number;
	enableContent: boolean;
}

export interface PostMyEstimateDetailPayload {
	items: PostMyEstimateDetailItem[];
	batchId: number;
	estimateId: number;
	timeline: string;
	comment: string;
}

export interface PostGradePayload {
	grade: string;
}

export interface PutGradePayload {
	id: number;
	grade: string;
}
