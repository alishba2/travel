import {
	createAgentAdd,
	createAgentLogout,
	createAgentSignin,
	createAgentValidateUsername,
	getAgentList,
	getAgentMe,
	updateAgentDelete,
	updateAgentEdit,
	updateAgentNewPassword,
} from '@shared/apis/agent';
import { deleteItem } from '@shared/apis/item';
import {
	GetAgentListPayload,
	DeleteItemPayload,
	PostAgentSigninPayload,
	PostAgentAddPayload,
	PostAgentValidateUsernamePayload,
	PutAgentDeletePayload,
	PutAgentEditPayload,
	PutAgentNewPasswordPayload,
} from '@typings/payload';
import { GetAgentListSchema, ManagerMeSchema } from '@typings/schema';
import { AxiosResponse } from 'axios';
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from 'react-query';

export const AGENT_KEYS = {
	getAgentList: (payload?: GetAgentListPayload): [string, GetAgentListPayload | undefined] => ['getAgentList', payload],
	getAgentMe: (isLogged: boolean): [string, boolean] => ['getAgentMe', isLogged],
};

// Get List
export const useGetAgentList = (payload?: GetAgentListPayload): UseQueryResult<GetAgentListSchema> =>
	useQuery(AGENT_KEYS.getAgentList(payload), () => getAgentList(payload), {
		enabled: !!payload,
	});

export const useGetAgentMe = (isLogged: boolean): UseQueryResult<ManagerMeSchema> =>
	useQuery(AGENT_KEYS.getAgentMe(isLogged), () => getAgentMe(), {
		enabled: !!isLogged,
	});

// Post
export const usePostAgentSignin = (): UseMutationResult<AxiosResponse, unknown, PostAgentSigninPayload, unknown> =>
	useMutation((payload: PostAgentSigninPayload) => createAgentSignin(payload));

export const usePostAgentAdd = (): UseMutationResult<AxiosResponse, unknown, PostAgentAddPayload, unknown> =>
	useMutation((payload: PostAgentAddPayload) => createAgentAdd(payload));

export const usePostAgentValidateUsername = (): UseMutationResult<
	AxiosResponse,
	unknown,
	PostAgentValidateUsernamePayload,
	unknown
> => useMutation((payload: PostAgentValidateUsernamePayload) => createAgentValidateUsername(payload));

export const usePostAgentLogout = (): UseMutationResult<AxiosResponse, unknown, unknown, unknown> =>
	useMutation(() => createAgentLogout());

// Update
export const usePutAgentEdit = (): UseMutationResult<AxiosResponse, unknown, PutAgentEditPayload, unknown> =>
	useMutation((payload: PutAgentEditPayload) => updateAgentEdit(payload));

export const usePutAgentDelete = (): UseMutationResult<AxiosResponse, unknown, PutAgentDeletePayload, unknown> =>
	useMutation((payload: PutAgentDeletePayload) => updateAgentDelete(payload));

export const usePutAgentNewPassword = (): UseMutationResult<
	AxiosResponse,
	unknown,
	PutAgentNewPasswordPayload,
	unknown
> => useMutation((payload: PutAgentNewPasswordPayload) => updateAgentNewPassword(payload));

// Delete
export const useDeleteItem = (): UseMutationResult<AxiosResponse, unknown, DeleteItemPayload, unknown> =>
	useMutation((payload: DeleteItemPayload) => deleteItem(payload));
