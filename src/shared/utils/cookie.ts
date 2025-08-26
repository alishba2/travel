import { Cookies } from 'react-cookie';

const baseURL = process.env.API_URL;
const prefix = process.env.COOKIE_PREFIX;

const secure = baseURL?.includes('https');
const cookies = new Cookies();

export const COOKIE_KEYS = {
	ACCESS_TOKEN: `${prefix}_ACCESS_TOKEN`,
	REFRESH_TOKEN: `${prefix}_REFRESH_TOKEN`,
	SAVED_ID: `${prefix}_CHED_SAVED_ID`,
};

export const COOKIE_EXPIRES = {
	ACCESS_TOKEN: 60 * 60 * 1,
	REFRESH_TOKEN: 60 * 60 * 24 * 7,
	// ACCESS_TOKEN: 3,
	// REFRESH_TOKEN: 6,
};

export const cookieOptions = secure
	? {
			path: '/',
			secure,
	  }
	: {
			path: '/',
	  };

export const getCookie = (name: string): string => {
	return cookies.get(name);
};

export const setCookie = (name: string, value: string, options?: any): void => {
	return cookies.set(name, value, { ...cookieOptions, ...options });
};

export const removeCookie = (name: string, options?: any): void => {
	return cookies.remove(name, { ...cookieOptions, ...options });
};
