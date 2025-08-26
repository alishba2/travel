import {
	DeleteItemPayload,
	GetAgentListPayload,
	GetItemSearchPayload,
	PostAgentAddPayload,
	PostAgentSigninPayload,
	PostAgentValidateUsernamePayload,
	PutAgentDeletePayload,
	PutAgentEditPayload,
	PutAgentNewPasswordPayload,
	PutItemPayload,
} from '@typings/payload';
import { GetAgentListSchema, GetItemListSchema, ManagerMeSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { deleteRequest, getRequest, postRequest, putRequest } from './apiActions';

const PATH_AGENT = '/agent';

// Get
export const getAgentList = (payload?: GetAgentListPayload): Promise<GetAgentListSchema> =>
	getRequest(`${PATH_AGENT}/list`, payload);

export const getAgentMe = (): Promise<ManagerMeSchema> => getRequest(`${PATH_AGENT}/me`);

export const getItemSearch = (payload?: GetItemSearchPayload): Promise<GetItemListSchema> =>
	getRequest(`${PATH_AGENT}/admin/search`, payload);

// Post
export const createAgentSignin = (payload: PostAgentSigninPayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_AGENT}/signin`, payload);

export const createAgentAdd = (payload: PostAgentAddPayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_AGENT}/add`, payload);

export const createAgentValidateUsername = (payload: PostAgentValidateUsernamePayload): Promise<AxiosResponse> =>
	postRequest(`${PATH_AGENT}/validate/username`, payload);

export const createAgentLogout = (): Promise<AxiosResponse> => postRequest(`${PATH_AGENT}/logout`);

// Update
export const updateAgentEdit = (payload: PutAgentEditPayload): Promise<AxiosResponse> =>
	putRequest(`${PATH_AGENT}/edit`, payload);

export const updateAgentDelete = (payload: PutAgentDeletePayload): Promise<AxiosResponse> =>
	putRequest(`${PATH_AGENT}/delete`, payload);

export const updateAgentNewPassword = (payload: PutAgentNewPasswordPayload): Promise<AxiosResponse> =>
	putRequest(`${PATH_AGENT}/new/password`, payload);

// Delete
export const deleteAgent = (payload: DeleteItemPayload): Promise<AxiosResponse> =>
	deleteRequest(`${PATH_AGENT}`, payload);
