import { createGradeAdd, deleteGrade, getGradeList, updateGradeEdit } from '@shared/apis/grade';
import { PostGradePayload, PutGradePayload } from '@typings/payload';
import { GradeSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const GRADE_KEYS = {
	getGradeList: (): [string] => ['getGradeList'],
};

// Get List
export const useGetGradeList = (): UseQueryResult<GradeSchema[]> =>
	useQuery(GRADE_KEYS.getGradeList(), () => getGradeList());

// Post
export const usePostGradeAdd = (): UseMutationResult<AxiosResponse, unknown, PostGradePayload, unknown> =>
	useMutation((payload: PostGradePayload) => createGradeAdd(payload));

// Update
export const usePutGradeEdit = (): UseMutationResult<AxiosResponse, unknown, PutGradePayload, unknown> =>
	useMutation((payload: PutGradePayload) => updateGradeEdit(payload));

// Delete
export const useDeleteGrade = (): UseMutationResult<AxiosResponse, unknown, { id: string }, unknown> =>
	useMutation((payload: { id: string }) => deleteGrade(payload));
