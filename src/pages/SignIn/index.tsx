/* eslint-disable no-alert */
// import { MANAGE_KEYS, usePostManagerSignin } from '@shared/hooks/queries/manager';
import Button from '@components/Button';
import { TextField } from '@components/Input';
import { VALIDATION_MESSAGE } from '@shared/constants';
import { useModal } from '@shared/hooks';
// import { useCreateManagerSignIn } from '@shared/hooks/queries/manager';
import { PATHS } from '@shared/path';
import { IMG_URI, isValidRegex } from '@shared/utils/base';
import { COOKIE_KEYS, setCookie } from '@shared/utils/cookie';
import { errorToast } from '@shared/utils/toastUtils';
import React, { FC, useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as S from './styled';
import { usePostAgentSignin } from '@shared/hooks/queries/agent';

interface IFormValues {
	username: string;
	password: string;
}

const SignIn: FC = () => {
	/**
	 * States
	 */
	const { failAlert } = useModal();
	const {
		formState: { errors },
		register,
		handleSubmit,
		setValue,
	} = useForm<IFormValues>();

	const navigate = useNavigate();

	/**
	 * Queries
	 */
	const { mutate: postAgentSignin } = usePostAgentSignin();

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		// const isValid = validatePayload(data);
		// if (!isValid) {
		// 	return;
		// }
		const { username, password } = data;

		const payload = {
			username,
			password,
		};

		postAgentSignin(payload, {
			onSuccess: ({ data: { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } }) => {
				console.log(data);
				setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken, { maxAge: accessTokenExpiresIn });
				setCookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, { maxAge: refreshTokenExpiresIn });
				sessionStorage.setItem(COOKIE_KEYS.REFRESH_TOKEN, refreshToken);
				navigate(PATHS.INTRO);
			},
			onError: () => {
				failAlert('The username or password does not match.');
			},
		});
	};

	const validatePayload = (data: IFormValues) => {
		const { username, password } = data;

		if (!isValidRegex(username, 'username')) {
			errorToast('Invalid username.');
			return false;
		}

		if (!isValidRegex(password, 'password')) {
			errorToast('Invalid password.');
			return false;
		}

		return true;
	};

	const goSignUp = () => {
		navigate(PATHS.SIGN_UP);
	};

	/**
	 * Helpers
	 */

	return (
		<S.Container>
			<S.LoginBox onSubmit={handleSubmit(onSubmit)}>
				<S.Logo>
					<img src={`${IMG_URI}/korea_oneday.png`} alt="" />
				</S.Logo>

				<S.InputBox>
					<TextField
						label="Username"
						name="username"
						placeholder="Please enter the username."
						register={register}
						errors={errors}
						error={!!errors.username}
						options={{ required: VALIDATION_MESSAGE.username.required }}
					/>

					<TextField
						label="Password"
						name="password"
						type="password"
						placeholder="Please enter the password."
						register={register}
						errors={errors}
						error={!!errors.password}
						options={{ required: VALIDATION_MESSAGE.password.required }}
					/>
				</S.InputBox>

				<S.ButtonBox>
					<Button type="submit" status="primary" text="Sign In" height={42} />
					{/* <Button type="button" status="primary_outlined" text="관리자 등록" height={42} onClick={goSignUp} /> */}
				</S.ButtonBox>
			</S.LoginBox>
		</S.Container>
	);
};

export default SignIn;
