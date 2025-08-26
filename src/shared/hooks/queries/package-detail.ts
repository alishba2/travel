import { getPackageDetailList, createPackageDetail } from '@shared/apis/package-detail';
import { PostPackageDetailPayload } from '@typings/payload';
import { GetPackageDetailListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const PACKAGE_KEYS = {
	getPackageDetailList: (payload?: { packageId: number }): [string, { packageId: number } | undefined] => [
		'getPackageDetailList',
		payload,
	],
};

// Get List
export const useGetPackageDetailList = (payload?: {
	packageId: number;
}): UseQueryResult<GetPackageDetailListSchema[]> =>
	useQuery(PACKAGE_KEYS.getPackageDetailList(payload), () => getPackageDetailList(payload), {
		enabled: !!payload,
	});

// Post
export const usePostPackageDetailFORM = (): UseMutationResult<
	AxiosResponse,
	unknown,
	PostPackageDetailPayload,
	unknown
> => useMutation((payload: PostPackageDetailPayload) => createPackageDetail(payload));

// Update

// Delete
