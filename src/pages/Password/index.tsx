import React, { FC, useState, useEffect } from 'react';
import * as S from './styled';
import Title from '@components/Title';
import Blank from '@components/Blank';
import { SubmitHandler, useForm } from 'react-hook-form';
import Free from '@styles/FreeTable';
import { TextField } from '@components/Input';
import ButtonBox from '@components/ButtonBox';
import Button from '@components/Button';
import { VALIDATION_MESSAGE } from '@shared/constants';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { isValidRegex } from '@shared/utils/base';
import { usePutAgentNewPassword } from '@shared/hooks/queries/agent';
import useMe from '@shared/hooks/useMe';
import { useModal } from '@shared/hooks';
import Loader from '@components/Loader';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';

interface IFormValues {
	password: string;
	newPassword: string;
	passwordConfirm: string;
}

const Password: FC = () => {
	/**
	 * States
	 */
	const { managerId } = useMe();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IFormValues>();

	const { failAlert } = useModal();

	/**
	 * Queries
	 */
	const { mutate: updateAgentEdit, isLoading: isLoadingUpdate } = usePutAgentNewPassword();

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const isValid = validatePayload(data);
		if (!isValid || !managerId) {
			return;
		}

		const editPayload = {
			originalPassword: data.password,
			newPassword: data.newPassword,
		};

		updateAgentEdit(editPayload, {
			onSuccess: () => {
				successToast('Password changed successfully.');
				navigate(PATHS.INTRO);
			},
			onError: (err: any) => {
				if (err?.response?.data?.message?.length) {
					failAlert(err?.response?.data?.message?.[0]);
				} else {
					failAlert('Failed to change password.');
				}
			},
		});
	};

	const validatePayload = (data: IFormValues) => {
		const { newPassword, passwordConfirm } = data;

		if (!isValidRegex(newPassword, 'password')) {
			errorToast('Invalid password.');
			return false;
		}

		if (newPassword !== passwordConfirm) {
			errorToast('Passwords do not match.');
			return false;
		}

		return true;
	};

	/**
	 * Helpers
	 */
	return (
		<S.Container>
			<Title title="Change password" />

			<Blank size={24} />

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={40}>
						<TextField
							label="Current Password"
							name="password"
							placeholder="Please enter the current password."
							register={register}
							type="password"
							maxLength={20}
							errors={errors}
							error={!!errors.password}
							options={{ required: VALIDATION_MESSAGE.password.required }}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={40}>
						<TextField
							label="New Password"
							name="newPassword"
							type="password"
							placeholder="*A combination of numbers and English letters, 8-20 characters long, including special characters (!, _, @, #, ^)"
							maxLength={20}
							register={register}
							errors={errors}
							error={!!errors.newPassword}
							options={{ required: VALIDATION_MESSAGE.password.required }}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={40}>
						<TextField
							label="Retype Password"
							name="passwordConfirm"
							type="password"
							placeholder="Please confirm the password."
							maxLength={20}
							register={register}
							errors={errors}
							error={!!errors.passwordConfirm}
							options={{ required: VALIDATION_MESSAGE.passwordCheck.required }}
						/>
					</Free.Value>
				</Free.Row>
				<ButtonBox>
					<Button type="submit" status="primary" text="Edit" />
				</ButtonBox>
			</Free.SearchTable>

			<Loader isFetching={isLoadingUpdate} />
		</S.Container>
	);
};

export default Password;
