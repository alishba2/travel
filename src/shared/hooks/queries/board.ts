import { createBoard, deleteBoard, getBoardDetail, getBoardList, updateBoard } from '@shared/apis/board';
import { CreateBoardPayload, GetBoardListPayload, UpdateBoardPayload } from '@typings/payload';
import { BoardDetailSchema, BoardList } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const BOARD_KEYS = {
	getBoardList: (payload?: GetBoardListPayload): [string, GetBoardListPayload | undefined] => ['getBoardList', payload],
	getBoardDetail: (boardId: number | string): [string, number | string] => ['getBoardDetail', boardId],
};

// Get List
export const useGetBoardList = (payload?: GetBoardListPayload): UseQueryResult<BoardList> =>
	useQuery(BOARD_KEYS.getBoardList(payload), () => getBoardList(payload), {
		enabled: !!payload,
	});

// Get Detail
export const useGetBoardDetail = (boardId: number | string): UseQueryResult<BoardDetailSchema> =>
	useQuery(BOARD_KEYS.getBoardDetail(boardId), () => getBoardDetail(boardId));

// Post
export const useCreateBoardFORM = (): UseMutationResult<AxiosResponse, unknown, CreateBoardPayload, unknown> =>
	useMutation((payload: CreateBoardPayload) => createBoard(payload));

// Update
export const useUpdateBoardFORM = (): UseMutationResult<AxiosResponse, unknown, UpdateBoardPayload, unknown> =>
	useMutation((payload: UpdateBoardPayload) => updateBoard(payload));

// Delete
export const useDeleteBoard = (): UseMutationResult<AxiosResponse, unknown, number | string, unknown> =>
	useMutation((boardId: number | string) => deleteBoard(boardId));
