import { createPackage, deletePackage, getPackageList, updatePackage } from '@shared/apis/package';
import { PostPackagePayload, GetPackageListPayload, PutPackagePayload } from '@typings/payload';
import { GetPackageListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const PACKAGE_KEYS = {
	getPackageList: (payload?: GetPackageListPayload): [string, GetPackageListPayload | undefined] => [
		'getPackageList',
		payload,
	],
};

// Get List
export const useGetPackageList = (payload?: GetPackageListPayload): UseQueryResult<GetPackageListSchema> =>
	useQuery(PACKAGE_KEYS.getPackageList(payload), () => getPackageList(payload), {
		enabled: !!payload,
	});

// Post
export const usePostPackageFORM = (): UseMutationResult<AxiosResponse, unknown, PostPackagePayload | any, unknown> =>
	useMutation((payload: PostPackagePayload) => createPackage(payload));

// Update
export const usePutPackageFORM = (): UseMutationResult<AxiosResponse, unknown, PutPackagePayload | any, unknown> =>
	useMutation((payload: PutPackagePayload) => updatePackage(payload));

// Delete
export const useDeletePackage = (): UseMutationResult<AxiosResponse, unknown, number, unknown> =>
	useMutation((id: number) => deletePackage(id));
