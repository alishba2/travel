import {
	CreateBoardPayload,
	GetBatchListPayload,
	GetBoardListPayload,
	GetMyEstimateOneWayPayload,
	PostMyEstimateDetailPayload,
	UpdateBoardPayload,
} from '@typings/payload';
import {
	BatchList,
	BoardDetailSchema,
	BoardList,
	EstimateDetailSchema,
	EstimateOneWayList,
	EstimateSchema,
} from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postFormRequest, postRequest, putFormRequest } from './apiActions';

const PATH_ESTIMATE_ONE_WAY = '/estimate/one-way';
const PATH_ESTIMATE_TWO_WAY = '/estimate/two-way';

// Get
export const getEstimateOneWayList = (payload?: GetMyEstimateOneWayPayload): Promise<EstimateOneWayList> =>
	getRequest(`${PATH_ESTIMATE_ONE_WAY}/list`, payload);

// Get
export const getEstimateTwoWayList = (payload?: GetBatchListPayload): Promise<BatchList> =>
	getRequest(`${PATH_ESTIMATE_TWO_WAY}/list`, payload);

// export const getBoardDetail = (boardId: number | string): Promise<BoardDetailSchema> =>
// 	getRequest(`${PATH_ESTIMATE}/detail/${boardId}`);

// Post
export const postEstimateDetailBulk = (payload: PostMyEstimateDetailPayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_ESTIMATE_ONE_WAY}/bulk`, payload);

// // Update
// export const updateBoard = (payload: UpdateBoardPayload): Promise<AxiosResponse> => putFormRequest(PATH_ESTIMATE, payload);

// // Delete
// export const deleteBoard = (boardId: number | string): Promise<AxiosResponse> =>
// 	deleteRequest(`${PATH_ESTIMATE}/${boardId}`);
