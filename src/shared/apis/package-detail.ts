import { PostPackageDetailPayload } from '@typings/payload';
import { GetPackageDetailListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { getRequest, postRequest } from './apiActions';

const PATH_PACKAGE = '/package-detail';

// Get
export const getPackageDetailList = (payload?: { packageId: number }): Promise<GetPackageDetailListSchema[]> =>
	getRequest(`${PATH_PACKAGE}/list`, payload);

// Post
export const createPackageDetail = (payload: PostPackageDetailPayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_PACKAGE}/bulk`, payload);

// Update

// Delete
