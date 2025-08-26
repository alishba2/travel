import { GetPackageListPayload, PostPackagePayload, PutPackagePayload } from '@typings/payload';
import { GetItemListSchema, GetPackageListSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postRequest, putRequest } from './apiActions';

const PATH_PACKAGE = '/package';

// Get
export const getPackageList = (payload?: GetPackageListPayload): Promise<GetPackageListSchema> =>
	getRequest(`${PATH_PACKAGE}/list`, payload);

// Post
export const createPackage = (payload: PostPackagePayload | any): Promise<AxiosResponse> =>
	postRequest(PATH_PACKAGE, payload);

// Update
export const updatePackage = (payload: PutPackagePayload | any): Promise<AxiosResponse> =>
	putRequest(PATH_PACKAGE, payload);

// Delete
export const deletePackage = (id: number): Promise<AxiosResponse> => deleteRequest(`${PATH_PACKAGE}`, { id });
