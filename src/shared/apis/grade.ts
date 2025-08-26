import { PostGradePayload, PutGradePayload } from '@typings/payload';
import { GradeSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postRequest, putRequest } from './apiActions';

const PATH_GRADE = '/grade';

// Get
export const getGradeList = (): Promise<GradeSchema[]> => getRequest(`${PATH_GRADE}/list`);

// Post
export const createGradeAdd = (payload: PostGradePayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_GRADE}/add`, payload);

// Update
export const updateGradeEdit = (payload: PutGradePayload): Promise<AxiosResponse> =>
	putRequest(`${PATH_GRADE}/edit`, payload);

// Delete
export const deleteGrade = (payload: { id: string }): Promise<AxiosResponse> => deleteRequest(`${PATH_GRADE}`, payload);
