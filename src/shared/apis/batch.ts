import {
	GetBatchCalendarMonthPayload,
	GetBatchListPayload,
	PostBatchCopyPayload,
	PostBatchPayload,
	PutBatchPayload,
} from '@typings/payload';
import { BatchList, GetBatchCalendarMonthSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postRequest, putRequest } from './apiActions';

const PATH_BATCH = '/batch';

// Get
export const getBatchList = (payload?: GetBatchListPayload): Promise<BatchList> =>
	getRequest(`${PATH_BATCH}/admin/list`, payload);

export const getBatchCalendarMonth = (payload?: GetBatchCalendarMonthPayload): Promise<GetBatchCalendarMonthSchema[]> =>
	getRequest(`${PATH_BATCH}/calendar/month`, payload);

// export const getBoardDetail = (boardId: number | string): Promise<BoardDetailSchema> =>
// 	getRequest(`${PATH_BATCH}/detail/${boardId}`);

// Post
export const createBatch = (payload: PostBatchPayload): Promise<AxiosResponse> => postRequest(`${PATH_BATCH}`, payload);

export const createBatchCopy = (payload: PostBatchCopyPayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_BATCH}/copy`, payload);

// // Update
export const updateBatch = (payload: PutBatchPayload): Promise<AxiosResponse> => putRequest(PATH_BATCH, payload);

// // Delete
export const deleteBatch = (batchId: number | string): Promise<AxiosResponse> =>
	deleteRequest(`${PATH_BATCH}/${batchId}`);
