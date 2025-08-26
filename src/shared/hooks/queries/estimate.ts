import { getEstimateOneWayList, postEstimateDetailBulk } from '@shared/apis/estimate';
import { GetMyEstimateOneWayPayload, PostMyEstimateDetailPayload } from '@typings/payload';
import { EstimateOneWayList, EstimateSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const ESTIMATE_KEYS = {
	getEstimateOneWayList: (payload?: GetMyEstimateOneWayPayload): [string, GetMyEstimateOneWayPayload | undefined] => [
		'getEstimateOneWayList',
		payload,
	],
	// getBoardDetail: (boardId: number | string): [string, number | string] => ['getBoardDetail', boardId],
};

// Get List
export const useGetEstimateOneWayList = (payload?: GetMyEstimateOneWayPayload): UseQueryResult<EstimateOneWayList> =>
	useQuery(ESTIMATE_KEYS.getEstimateOneWayList(payload), () => getEstimateOneWayList(payload), {
		enabled: !!payload,
	});

// // Get Detail
// export const useGetBoardDetail = (boardId: number | string): UseQueryResult<BoardDetailSchema> =>
// 	useQuery(ESTIMATE_KEYS.getBoardDetail(boardId), () => getBoardDetail(boardId));

// Post
export const usePostEstimateDetailBulk = (): UseMutationResult<
	AxiosResponse,
	unknown,
	PostMyEstimateDetailPayload,
	unknown
> => useMutation((payload: PostMyEstimateDetailPayload) => postEstimateDetailBulk(payload));

// // Update
// export const useUpdateBoardFORM = (): UseMutationResult<AxiosResponse, unknown, UpdateBoardPayload, unknown> =>
// 	useMutation((payload: UpdateBoardPayload) => updateBoard(payload));

// // Delete
// export const useDeleteBoard = (): UseMutationResult<AxiosResponse, unknown, number | string, unknown> =>
// 	useMutation((boardId: number | string) => deleteBoard(boardId));
