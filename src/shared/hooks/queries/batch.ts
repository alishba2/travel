import {
	createBatch,
	createBatchCopy,
	deleteBatch,
	getBatchCalendarMonth,
	getBatchList,
	updateBatch,
} from '@shared/apis/batch';
import {
	GetBatchCalendarMonthPayload,
	GetBatchListPayload,
	PostBatchCopyPayload,
	PostBatchPayload,
	PutBatchPayload,
} from '@typings/payload';
import { BatchList, GetBatchCalendarMonthSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const BATCH_KEYS = {
	getBatchList: (payload?: GetBatchListPayload): [string, GetBatchListPayload | undefined] => ['getBatchList', payload],
	getBatchCalendarMonth: (
		payload?: GetBatchCalendarMonthPayload,
	): [string, GetBatchCalendarMonthPayload | undefined] => ['getBatchCalendarMonth', payload],
	// getBoardDetail: (boardId: number | string): [string, number | string] => ['getBoardDetail', boardId],
};

// Get List
export const useGetBatchList = (payload?: GetBatchListPayload): UseQueryResult<BatchList> =>
	useQuery(BATCH_KEYS.getBatchList(payload), () => getBatchList(payload), {
		enabled: !!payload,
	});

export const useGetBatchCalendarMonth = (
	payload?: GetBatchCalendarMonthPayload,
): UseQueryResult<GetBatchCalendarMonthSchema[]> =>
	useQuery(BATCH_KEYS.getBatchCalendarMonth(payload), () => getBatchCalendarMonth(payload), {
		enabled: !!payload,
	});

// // Get Detail
// export const useGetBoardDetail = (boardId: number | string): UseQueryResult<BoardDetailSchema> =>
// 	useQuery(BATCH_KEYS.getBoardDetail(boardId), () => getBoardDetail(boardId));

// // Post
export const useCreateBatch = (): UseMutationResult<AxiosResponse, unknown, PostBatchPayload, unknown> =>
	useMutation((payload: PostBatchPayload) => createBatch(payload));

export const useCreateBatchCopy = (): UseMutationResult<AxiosResponse, unknown, PostBatchCopyPayload, unknown> =>
	useMutation((payload: PostBatchCopyPayload) => createBatchCopy(payload));

// // Update
export const useUpdateBatch = (): UseMutationResult<AxiosResponse, unknown, PutBatchPayload, unknown> =>
	useMutation((payload: PutBatchPayload) => updateBatch(payload));

// // Delete
export const useDeleteBatch = (): UseMutationResult<AxiosResponse, unknown, number | string, unknown> =>
	useMutation((batchId: number | string) => deleteBatch(batchId));
