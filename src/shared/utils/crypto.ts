/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import CryptoJS from 'crypto-js';

const TEMP_SALT = 'ONE_DAY_KOREA';

export const aesEncrypt = (data: string) => {
	const key = TEMP_SALT.padEnd(32, ' ');
	const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
		iv: CryptoJS.enc.Utf8.parse(''),
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC,
	});

	return cipher.toString();
};

export const aesDecrypt = (data: string) => {
	const key = TEMP_SALT.padEnd(32, ' ');
	const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
		iv: CryptoJS.enc.Utf8.parse(''),
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC,
	});

	return cipher.toString(CryptoJS.enc.Utf8);
};
