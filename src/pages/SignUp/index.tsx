import Button from '@components/Button';
import { TextField } from '@components/Input';
import Select from '@components/Select';
import { VALIDATION_MESSAGE } from '@shared/constants';
// import {
// 	useCreateManagerSendAuthCode,
// 	useCreateManagerSignUp,
// 	useCreateManagerValidateUserName,
// } from '@shared/hooks/queries/manager';
import { useTimer } from '@shared/hooks/useTimer';
import { PATHS } from '@shared/path';
import { IMG_URI, isValidRegex } from '@shared/utils/base';
import { converToTimerFormat } from '@shared/utils/dayUtils';
import { safeJsonParse } from '@shared/utils/json';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import React, { FC, useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { duplicateLabel, phoneButtonStyle } from './constants';
import * as S from './styled';

interface IFormValues {
	username: string;
	password: string;
	passwordCheck: string;
	name: string;
	phone: string;
	verifyCode: string;
}

const SignUp: FC = () => {
	/**
	 * States
	 */
	const {
		formState: { errors },
		register,
		handleSubmit,
		watch,
		setValue,
	} = useForm<IFormValues>();

	const navigate = useNavigate();

	const [count, startTimer] = useTimer();
	const [duplicateStatus, setDuplicateStatus] = useState<'체크불가' | '체크가능' | '사용가능' | '사용불가'>('체크불가');
	const [phoneStatus, setPhoneStatus] = useState<'인증불가' | '인증가능' | '인증진행중' | '인증만료'>('인증불가');

	const usernameWatch = watch('username') ?? '';
	const phoneWatch = watch('phone') ?? '';
	/**
	 * Queries
	 */

	// const { mutate: createManagerSendAuthCode } = useCreateManagerSendAuthCode();
	// const { mutate: createManagerValidateUserName } = useCreateManagerValidateUserName();
	// const { mutate: createManagerSignUp } = useCreateManagerSignUp();

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (isValidRegex(usernameWatch, 'username')) {
			setDuplicateStatus('체크가능');
		} else {
			setDuplicateStatus('체크불가');
		}
	}, [usernameWatch]);

	useEffect(() => {
		if (phoneWatch.length >= 10) {
			setPhoneStatus('인증가능');
		} else {
			setPhoneStatus('인증불가');
		}
	}, [phoneWatch]);

	useEffect(() => {
		if (count === 0) {
			setPhoneStatus('인증만료');
			setValue('verifyCode', '');
		}
	}, [count]);

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const isValid = validatePayload(data);
		if (!isValid) {
			return;
		}
		const { username, password, name, phone, verifyCode } = data;

		const payload = {
			username,
			password,
			name,
			phone,
			verifyCode,
		};

		// createManagerSignUp(payload, {
		// 	onSuccess: () => {
		// 		successToast('관리자 등록이 완료되었습니다.');
		// 		navigate(PATHS.SIGN_IN, { replace: true });
		// 	},
		// 	onError: (error) => {
		// 		console.log('ERROR createManagerSignUp', error);
		// 	},
		// });
	};

	const validatePayload = (data: IFormValues) => {
		const { password, passwordCheck, name, verifyCode } = data;
		if (duplicateStatus !== '사용가능') {
			errorToast('이메일 중복확인을 해주세요.');
			return false;
		}

		if (!isValidRegex(password, 'password')) {
			errorToast('유효하지 않은 비밀번호입니다.');
			return false;
		}

		if (password !== passwordCheck) {
			errorToast('비밀번호가 일치하지 않습니다.');
			return false;
		}

		if (!isValidRegex(name, 'name')) {
			errorToast('유효하지 않은 Name입니다.');
			return false;
		}

		if (!isValidRegex(verifyCode, 'verifyCode') || phoneStatus !== '인증진행중') {
			errorToast('인증번호를 확인해주세요.');
			return false;
		}

		return true;
	};

	/**
	 * Helpers
	 */
	const checkDuplicateEmail = () => {
		if (duplicateStatus === '체크불가') {
			errorToast('유효하지 않은 이메일 Address입니다.');
			return;
		}
		const payload = {
			username: usernameWatch,
		};

		// createManagerValidateUserName(payload, {
		// 	onSuccess: ({ data }) => {
		// 		if (data) {
		// 			errorToast('이미 존재하는 이메일 Address입니다.');
		// 			setDuplicateStatus('사용불가');
		// 		} else {
		// 			setDuplicateStatus('사용가능');
		// 		}
		// 	},
		// 	onError: (e) => {
		// 		console.log('error', e);
		// 	},
		// });
	};

	const sendSMS = () => {
		if (phoneStatus === '인증불가') {
			errorToast('유효하지 않은 전화번호입니다.');
		}

		// createManagerSendAuthCode(
		// 	{ receiver: phoneWatch },
		// 	{
		// 		onSuccess: () => {
		// 			setPhoneStatus('인증진행중');
		// 			setValue('verifyCode', '');
		// 			startTimer(180);
		// 		},
		// 		onError: (error) => {
		// 			console.log('ERROR createManagerSendAuthCode', error);
		// 		},
		// 	},
		// );
	};

	const isActiveDuplicateBtn = duplicateStatus === '체크가능';
	const isSendedPhone = phoneStatus === '인증진행중';

	return (
		<S.Container>
			<S.LoginBox onSubmit={handleSubmit(onSubmit)}>
				<S.Logo>
					<img src={`${IMG_URI}/korea_oneday.png`} alt="" />
				</S.Logo>

				<S.InputBox>
					<S.FlexRow>
						<TextField
							label="아이디"
							name="username"
							placeholder="English, 숫자 조합 3~20자"
							maxLength={20}
							register={register}
							errors={errors}
							error={!!errors.username}
							options={{ required: VALIDATION_MESSAGE.username.required }}
						/>

						<Button
							type="button"
							status={isActiveDuplicateBtn ? 'primary_outlined' : 'disabled'}
							text={duplicateLabel[duplicateStatus]}
							width={120}
							height={45}
							onClick={checkDuplicateEmail}
						/>
					</S.FlexRow>

					<TextField
						label="비밀번호"
						name="password"
						type="password"
						placeholder="*특수문자 ( ! _ @ # ^ )을 포함한 숫자,English 조합 8-20자리"
						maxLength={20}
						register={register}
						errors={errors}
						error={!!errors.password}
						options={{ required: VALIDATION_MESSAGE.password.required }}
					/>

					<TextField
						label="비밀번호 확인"
						name="passwordCheck"
						type="password"
						placeholder="비밀번호를 확인해주세요."
						maxLength={20}
						register={register}
						errors={errors}
						error={!!errors.passwordCheck}
						options={{ required: VALIDATION_MESSAGE.passwordCheck.required }}
					/>

					<TextField
						label="Name"
						name="name"
						type="name"
						placeholder="Korean Name을 입력해주세요."
						maxLength={5}
						register={register}
						errors={errors}
						error={!!errors.name}
						options={{ required: VALIDATION_MESSAGE.name.required }}
					/>

					<S.FlexRow>
						<S.RelativeView>
							<TextField
								label="휴대폰 번호"
								name="phone"
								type="phone"
								placeholder="- 없이 입력해주세요."
								maxLength={11}
								register={register}
								errors={errors}
								error={!!errors.phone}
								options={{ required: VALIDATION_MESSAGE.phone.required }}
							/>
							{count > 0 && <S.TimeText>{converToTimerFormat(count)}</S.TimeText>}
						</S.RelativeView>

						<Button
							type="button"
							status={phoneButtonStyle[phoneStatus].status}
							text={phoneButtonStyle[phoneStatus].label}
							width={120}
							height={45}
							onClick={sendSMS}
						/>
					</S.FlexRow>

					{isSendedPhone && (
						<TextField
							label="인증번호"
							name="verifyCode"
							type="verifyCode"
							placeholder="인증번호를 입력해주세요."
							register={register}
							maxLength={6}
							errors={errors}
							error={!!errors.verifyCode}
							options={{ required: VALIDATION_MESSAGE.verifyCode.required }}
						/>
					)}
				</S.InputBox>

				<S.ButtonBox>
					<Button type="submit" status="primary" text="관리자 등록" height={42} />
				</S.ButtonBox>
			</S.LoginBox>
		</S.Container>
	);
};

export default SignUp;
