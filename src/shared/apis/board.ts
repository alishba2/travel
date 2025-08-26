import { CreateBoardPayload, GetBoardListPayload, UpdateBoardPayload } from '@typings/payload';
import { BoardDetailSchema, BoardList } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postFormRequest, putFormRequest } from './apiActions';

const PATH_BOARD = '/board';

// Get
export const getBoardList = (payload?: GetBoardListPayload): Promise<BoardList> =>
	getRequest(`${PATH_BOARD}/admin/list`, payload);

export const getBoardDetail = (boardId: number | string): Promise<BoardDetailSchema> =>
	getRequest(`${PATH_BOARD}/detail/${boardId}`);

// Post
export const createBoard = (payload: CreateBoardPayload): Promise<AxiosResponse> =>
	postFormRequest(PATH_BOARD, payload);

// Update
export const updateBoard = (payload: UpdateBoardPayload): Promise<AxiosResponse> => putFormRequest(PATH_BOARD, payload);

// Delete
export const deleteBoard = (boardId: number | string): Promise<AxiosResponse> =>
	deleteRequest(`${PATH_BOARD}/${boardId}`);
