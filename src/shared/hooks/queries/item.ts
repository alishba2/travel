import {
	createItem,
	createItemCopy,
	deleteItem,
	getItemDetail,
	getItemFileSearch,
	getItemList,
	getItemSearch,
	updateItem,
} from '@shared/apis/item';
import {
	PostItemPayload,
	GetItemListPayload,
	PutItemPayload,
	DeleteItemPayload,
	GetItemSearchPayload,
	GetItemFileSearchPayload,
} from '@typings/payload';
import { GetItemFileListSchema, GetItemListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const ITEM_KEYS = {
	getItemList: (payload?: GetItemListPayload): [string, GetItemListPayload | undefined] => ['getItemList', payload],
	getItemDetail: (payload?: { id: number }): [string, { id: number } | undefined] => ['getItemDetail', payload],
	getItemSearch: (payload?: GetItemSearchPayload): [string, GetItemSearchPayload | undefined] => [
		'getItemSearch',
		payload,
	],
	getItemFileSearch: (payload?: GetItemFileSearchPayload): [string, GetItemFileSearchPayload | undefined] => [
		'getItemFileSearch',
		payload,
	],
};

// Get List
export const useGetItemList = (payload?: GetItemListPayload): UseQueryResult<GetItemListSchema> =>
	useQuery(ITEM_KEYS.getItemList(payload), () => getItemList(payload), {
		enabled: !!payload,
	});

export const useGetItemDetail = (payload?: { id: number }): UseQueryResult<GetItemListSchema> =>
	useQuery(ITEM_KEYS.getItemDetail(payload), () => getItemDetail(payload), {
		enabled: !!payload,
	});

export const useGetItemSearch = (payload?: GetItemSearchPayload): UseQueryResult<GetItemListSchema> =>
	useQuery(ITEM_KEYS.getItemSearch(payload), () => getItemSearch(payload), {
		enabled: !!payload,
	});

export const useGetItemFileSearch = (payload?: GetItemFileSearchPayload): UseQueryResult<GetItemFileListSchema> =>
	useQuery(ITEM_KEYS.getItemFileSearch(payload), () => getItemFileSearch(payload), {
		enabled: !!payload,
	});

// Post
export const usePostItemFORM = (): UseMutationResult<AxiosResponse, unknown, PostItemPayload | any, unknown> =>
	useMutation((payload: PostItemPayload) => createItem(payload));

export const usePostItemCopy = (): UseMutationResult<AxiosResponse, unknown, { itemId: number }, unknown> =>
	useMutation((payload: { itemId: number }) => createItemCopy(payload));

// Update
export const usePutItemFORM = (): UseMutationResult<AxiosResponse, unknown, PutItemPayload | any, unknown> =>
	useMutation((payload: PutItemPayload) => updateItem(payload));

// Delete
export const useDeleteItem = (): UseMutationResult<AxiosResponse, unknown, DeleteItemPayload, unknown> =>
	useMutation((payload: DeleteItemPayload) => deleteItem(payload));
