import {
	DeleteItemPayload,
	GetItemFileSearchPayload,
	GetItemListPayload,
	GetItemSearchPayload,
	PostItemPayload,
	PutItemPayload,
} from '@typings/payload';
import { GetItemFileListSchema, GetItemListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postRequest, putRequest } from './apiActions';

const PATH_ITEM = '/item';

// Get
export const getItemList = (payload?: GetItemListPayload): Promise<GetItemListSchema> =>
	getRequest(`${PATH_ITEM}/list`, payload);

export const getItemDetail = (payload?: { id: number }): Promise<GetItemListSchema> =>
	getRequest(`${PATH_ITEM}/detail`, payload);

export const getItemSearch = (payload?: GetItemSearchPayload): Promise<GetItemListSchema> =>
	getRequest(`${PATH_ITEM}/admin/search`, payload);

export const getItemFileSearch = (payload?: GetItemFileSearchPayload): Promise<GetItemFileListSchema> =>
	getRequest(`${PATH_ITEM}/file/search`, payload);

// Post
export const createItem = (payload: PostItemPayload | any): Promise<AxiosResponse> => postRequest(PATH_ITEM, payload);

export const createItemCopy = (payload: { itemId: number }): Promise<AxiosResponse> =>
	postRequest(`${PATH_ITEM}/copy`, payload);

// Update
export const updateItem = (payload: PutItemPayload | any): Promise<AxiosResponse> => putRequest(PATH_ITEM, payload);

// Delete
export const deleteItem = (payload: DeleteItemPayload): Promise<AxiosResponse> =>
	deleteRequest(`${PATH_ITEM}`, payload);
