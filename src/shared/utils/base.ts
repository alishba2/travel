import { StringKeyAndAny, StringKeyAndVal } from '@typings/base';
import { aesEncrypt } from './crypto';
import { errorToast, successToast } from './toastUtils';

const { ASSET_URL } = process.env;

const mobileFullWidth = 360;

// const defaultFontPixel = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
const defaultFontPixel = 16;

export const IMG_URI = '/assets/images';
export const MEDIA_URI = '/assets/media';
export const FONT_URI = '/assets/fonts';

export const CART_KEY = '0';

export const getItemImg = (imgName?: string) => {
	if (!imgName) return '';
	return `${ASSET_URL}/items/${imgName}`;
};

export const getPackageImg = (imgName?: string) => {
	if (!imgName) return '';
	return `${ASSET_URL}/packages/${imgName}`;
};

export const unit = (size: number, float = 2): string => {
	const pxToRem = size / defaultFontPixel;
	return `${pxToRem}rem`;
	// const ratio = ((size / fullWidth) * 100).toFixed(float);
	// return `${ratio}vw`;
};

export const munit = (size: number, float = 2): string => {
	const ratio = ((size / mobileFullWidth) * 100).toFixed(float);
	return `${ratio}vw`;
};

export const REGEX = {
	username: /^(?![0-9]+$)[A-Za-z][A-Za-z0-9]{2,}$/,
	password: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!_@#^])[a-zA-Z0-9!_@#^]{8,16}$/,
	name: /^[\uAC00-\uD7A3]+$/,
	phone: /^\d{10,11}$/,
	verifyCode: /^\d{6}$/,
	birthday: /^(|\d{8})$/,
	datetime: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
};

export const isValidRegex = (text: string, regexType: keyof typeof REGEX): boolean => {
	return REGEX[regexType].test(text);
};

export const forceEnterNumber = (str: string): string => {
	return str.replace(/[^0-9]/g, '');
};

export const yieldFor = (ms: number): Promise<string> => {
	return new Promise((resolve) => setTimeout(() => resolve('ok'), ms));
};

// condition 이 true이면 작업을 멈춤 (sync함수 여야함)
export const waitFor = (tryCount: number, condition: () => boolean, sleepMs = 100): Promise<number | 'timeout'> => {
	return new Promise((resolve) => {
		function doRetry(innerRetry: number) {
			// console.log('innerRetry', innerRetry, condition());
			if (condition()) resolve(innerRetry);
			else if (innerRetry > 0) setTimeout(() => doRetry(innerRetry - 1), sleepMs);
			else resolve('timeout');
		}
		doRetry(tryCount);
	});
};

export const isEmptyFrog = (target: any) => {
	const type = Object.prototype.toString.call(target).slice(8, -1);
	if (type === 'Object' && Object.keys(target).length === 0) return true;
	if (type === 'Number' && target === 0) return true;
	try {
		const { length } = target;
		if (length === 0) return true;
		return false;
	} catch {
		return true;
	}
};

export const comma = (num: number | string | undefined): string => {
	if (num === undefined) return '';
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const autoHypenPhone = (text: string): string => {
	const str = text.replace(/[^0-9]/g, '');
	return str ? `${str.substring(0, 3)}-${str.substring(3, 7)}-${str.substring(7)}` : '-';
};

export const autoHypenTel = (text: string): string => {
	const str = text.replace(/[^0-9]/g, '');
	if (!str || str.length < 9) return '-';
	if (str.substring(0, 2) === '02') {
		return str.length === 9
			? `${str.substring(0, 2)}-${str.substring(2, 5)}-${str.substring(5)}`
			: `${str.substring(0, 2)}-${str.substring(2, 6)}-${str.substring(6)}`;
	}
	return str.length === 10
		? `${str.substring(0, 3)}-${str.substring(3, 6)}-${str.substring(6)}`
		: `${str.substring(0, 3)}-${str.substring(3, 7)}-${str.substring(7)}`;
};

export const goExternalLinkByPopup = (url: string, type = 'blank'): boolean => {
	const isPopup = type !== 'blank';

	if (isPopup) window.open(url, '_blank', 'width=1000, height=700');
	else window.open(url, '_blank');

	return false;
};

export const TIMELINE_JOIN_KEY = '#@#';

export const whatTheBest = (obj: StringKeyAndAny, quantity: number): number => {
	if (!obj) return 0;

	const keys = Object.keys(obj).map(Number);

	if (keys.includes(quantity)) {
		return Number(obj[quantity]);
	}

	const maxKey = Math.max(...keys);
	return Number(obj[maxKey]);
};

export const StatusEng: any = {
	정상: 'Normal',
	삭제: 'Deleted',
	대기: 'Pending',
	요청: 'Requested',
	답변완료: 'Answered',
	최종완료: 'Completed',
	취소: 'Cancelled',
};

export const createLinkAndCopy = async (id: number) => {
	try {
		const hash = aesEncrypt(id.toString());
		const encoding = encodeURIComponent(hash);
		const link = `https://travel-2-chi.vercel.app/quotation/${encoding}`;

		window.open(link);

		await navigator.clipboard.writeText(link);
		successToast('Copied to clipboard');
	} catch {
		errorToast('Failed to copy');
	}
};
