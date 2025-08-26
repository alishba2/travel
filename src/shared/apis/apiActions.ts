/* eslint-disable no-param-reassign */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { COOKIE_EXPIRES, COOKIE_KEYS, getCookie, removeCookie, setCookie } from '@shared/utils/cookie';
import { API_PATHS, PATHS } from '@shared/path';
import { forEach, isEmpty, isNil, isUndefined } from 'lodash-es';

const baseURL = process.env.API_URL;
const successHandler = (res: AxiosResponse): any => res.data;

//
//

// Main instance
const axiosApiInstance = axios.create({
	baseURL,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=UTF-8',
	},
});

// Refresh-token instance
const axiosApiRefreshToken = axios.create({
	baseURL,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json;charset=UTF-8',
	},
});

//

axiosApiInstance.interceptors.request.use(
	(config: AxiosRequestConfig): AxiosRequestConfig => {
		const accessTokenByCookies = getCookie(COOKIE_KEYS.ACCESS_TOKEN);
		if (accessTokenByCookies) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${accessTokenByCookies}`,
				withCredentials: true,
			};
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	},
);

axiosApiInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		if (error.response?.status === 401) {
			// 1. 세션 만료 시, API 재호출
			try {
				const originalRequest = error.config;
				const refreshTokenByCookies: string = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

				if (originalRequest && refreshTokenByCookies) {
					const getRefreshToken: AxiosResponse<{ accessToken: string; expiresIn: number }> =
						await axiosApiRefreshToken.get(API_PATHS.REFRESH_TOKEN);

					removeCookie(COOKIE_KEYS.ACCESS_TOKEN);

					const { accessToken } = getRefreshToken?.data;
					if (accessToken) {
						setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, { maxAge: COOKIE_EXPIRES.ACCESS_TOKEN });
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return axios(originalRequest);
					}

					removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
					removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
					window.location.href = PATHS.SIGN_IN;

					//
				} else {
					removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
					removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
					window.location.href = PATHS.SIGN_IN;
				}
			} catch (e) {
				// 2. 토큰 발급 실패, 로그아웃
				removeCookie(COOKIE_KEYS.ACCESS_TOKEN);
				removeCookie(COOKIE_KEYS.REFRESH_TOKEN);
				window.location.href = PATHS.SIGN_IN;
			}
		}

		return Promise.reject(error);
	},
);

axiosApiRefreshToken.interceptors.request.use(
	async (config) => {
		const refreshTokenByCookies = getCookie(COOKIE_KEYS.REFRESH_TOKEN);
		if (refreshTokenByCookies) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${refreshTokenByCookies}`,
				withCredentials: true,
			};
		}
		return config;
	},
	(error) => {
		Promise.reject(error);
	},
);

export const getRequest = (url: string, params?: any): Promise<any> => {
	return axiosApiInstance.get(`${url}`, { params }).then(successHandler);
};

export const postRequest = (url: string, payload?: any, options?: any): Promise<any> => {
	return axiosApiInstance.post(`${url}`, payload, options);
};

export const putRequest = (url: string, payload?: any, options?: any): Promise<any> => {
	return axiosApiInstance.put(`${url}`, payload, options);
};

export const deleteRequest = (url: string, params?: any): Promise<any> => {
	return axiosApiInstance.delete(`${url}`, { params });
};

//

export const postFormRequest = (url: string, payload?: any, options?: any): Promise<any> => {
	const formData = new FormData();
	const { files, ...rest } = payload;

	forEach(rest, (value, key: any) => {
		if (!isUndefined(value)) {
			formData.append(key, value.toString());
		}
	});

	if (!isEmpty(files)) {
		files.forEach((file: File) => {
			formData.append('files', file);
		});
	} else {
		formData.append('files', '');
	}

	return axiosApiInstance.post(`${url}`, formData, options);
};

export const postSingleFormRequest = (url: string, payload?: any, options?: any): Promise<any> => {
	const formData = new FormData();
	const { file, ...rest } = payload;

	forEach(rest, (value, key: any) => {
		if (!isUndefined(value)) {
			formData.append(key, value.toString());
		}
	});

	if (!isEmpty(file)) {
		file.forEach((item: File) => {
			formData.append('file', item);
		});
	} else {
		formData.append('file', '');
	}

	return axiosApiInstance.post(`${url}`, formData, options);
};

export const putFormRequest = (url: string, payload: any, options?: any): Promise<any> => {
	const formData = new FormData();
	const { files, ...rest } = payload;

	forEach(rest, (value, key: any) => {
		if (!isNil(value)) {
			// console.log(`key: ${key}, value: ${value}`);
			formData.append(key, value.toString());
		}
	});

	if (!isEmpty(files)) {
		files.forEach((file: File) => {
			formData.append('files', file);
		});
	} else {
		formData.append('files', '');
	}

	return axiosApiInstance.put(`${url}`, formData, options);
};

export const putSingleFormRequest = (url: string, payload: any, options?: any): Promise<any> => {
	const formData = new FormData();
	const { file, ...rest } = payload;

	forEach(rest, (value, key: any) => {
		if (!isUndefined(value)) {
			// console.log(`key: ${key}, value: ${value}`);
			formData.append(key, value.toString());
		}
	});

	if (!isEmpty(file)) {
		file.forEach((item: File) => {
			formData.append('file', item);
		});
	}

	return axiosApiInstance.put(`${url}`, formData, options);
};
