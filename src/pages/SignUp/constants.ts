import { StringKeyAndAny, StringKeyAndVal } from '@typings/base';

export const duplicateLabel: StringKeyAndVal = {
	체크불가: '중복확인',
	체크가능: '중복확인',
	사용불가: '사용 불가',
	사용가능: '사용 가능',
};

export const phoneButtonStyle: StringKeyAndAny = {
	인증불가: {
		label: '인증번호 받기',
		status: 'primary_outlined',
	},
	인증가능: {
		label: '인증번호 받기',
		status: 'primary',
	},
	인증진행중: {
		label: '다시 받기',
		status: 'primary_outlined',
	},
	인증만료: {
		label: '인증 만료',
		status: 'disabled',
	},
};
