import Title from '@components/Title';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import { TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { VALIDATION_MESSAGE } from '@shared/constants';
import Blank from '@components/Blank';
import { useModal } from '@shared/hooks';
import { successToast } from '@shared/utils/toastUtils';
import { isUndefined } from 'lodash-es';
import Loader from '@components/Loader';
import useMe from '@shared/hooks/useMe';
import * as S from '../styled';
import { ManagerType } from '@typings/payload';
import { usePostAgentAdd, usePutAgentEdit } from '@shared/hooks/queries/agent';
import { AgentSchema } from '@typings/schema';
import { Colors } from '@styles/globalStyles';
import Select from '@components/Select';
import { safeJsonParse } from '@shared/utils/json';
import { useGetGradeList } from '@shared/hooks/queries/grade';

interface Props {
	needCreateForm: boolean;
	editTarget?: AgentSchema;
	refetch: () => void;
}

interface IFormValues {
	type: ManagerType | string;
	agentName: string;
	username: string;
	agentTel: string;
	grade: string;
}

const AgentCreateForm: FC<Props> = ({ needCreateForm, editTarget, refetch }) => {
	/**
	 * States
	 */

	const { managerId } = useMe();
	const {
		formState: { errors },
		register,
		setValue,
		handleSubmit,
		watch,
	} = useForm<IFormValues>();

	const { failAlert } = useModal();

	/**
	 * Queries
	 */
	const { data: grade } = useGetGradeList();

	const { mutate: postAgentAdd, isLoading: isLoadingCreate } = usePostAgentAdd();
	const { mutate: updateAgentEdit, isLoading: isLoadingUpdate } = usePutAgentEdit();

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (isUndefined(editTarget)) return;

		const { agentName, agentTel, username, type } = editTarget;
		setValue('agentName', agentName);
		setValue('agentTel', agentTel);
		setValue('username', username);

		const convertType = JSON.stringify({ label: type === '관리자' ? 'Manager' : 'Agent', key: type });
		setValue('type', convertType);
	}, [editTarget]);

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { agentName, agentTel, username, type, grade: gradeText } = data;
		const parseType = safeJsonParse(type).value ?? '';
		const parseGrade = safeJsonParse(gradeText).value ?? '';

		const payload = {
			agentName,
			agentTel,
			username,
			password: 'tumakr1!',
			type: parseType,
			grade: parseGrade,
		};
		if (isUndefined(editTarget)) {
			postAgentAdd(payload, {
				onSuccess: () => {
					successToast('Added the agent.');
					refetch();
				},
				onError: (err: any) => {
					console.log(err.response.data.message);
					if (err?.response?.data?.message?.length) {
						failAlert(err?.response?.data?.message?.[0]);
					} else {
						failAlert('Failed to add the agent.');
					}
				},
			});
		} else {
			const editPayload = {
				agentName,
				agentTel,
				// username,
				id: editTarget.id,
				// type: parseType,
				grade: parseGrade,
			};

			updateAgentEdit(editPayload, {
				onSuccess: () => {
					successToast('The agent has been updated.');
					refetch();
				},
				onError: (err: any) => {
					if (err?.response?.data?.message?.length) {
						failAlert(err?.response?.data?.message?.[0]);
					} else {
						failAlert('Failed to update the agent.');
					}
				},
			});
		}
	};

	/**
	 * Helpers
	 */

	if (!needCreateForm) return null;

	return (
		<>
			<Blank size={60} />
			<Title title="Add/Edit Agent" desc="You can add or edit agent.">
				{/* <Button text="Collapse" status="third" width={120} onClick={refetch} /> */}
			</Title>
			<p style={{ fontWeight: 300, color: Colors.navyBlack }}>
				(default Password : <b style={{ color: Colors.blue }}>tumakr1!</b>)
			</p>

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				{/*  */}

				<Free.Row>
					<Free.Value $width={50}>
						<TextField
							label="Agent Name"
							name="agentName"
							placeholder="Please enter the agent name."
							register={register}
							errors={errors}
							error={!!errors.agentName}
							options={{ required: VALIDATION_MESSAGE.agentName.required }}
						/>
					</Free.Value>

					<Free.Value $width={50}>
						<TextField
							label="Phone Number"
							name="agentTel"
							placeholder="Please enter the your phone number. (excluding hyphens)"
							register={register}
							errors={errors}
							error={!!errors.agentTel}
							options={{ required: VALIDATION_MESSAGE.agentTel.required }}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					{!editTarget && (
						<Free.Value $width={33}>
							<TextField
								label="Username"
								name="username"
								placeholder="Please enter the username."
								register={register}
								errors={errors}
								error={!!errors.username}
								options={{ required: VALIDATION_MESSAGE.username.required }}
							/>
						</Free.Value>
					)}
					{!editTarget && (
						<Free.Value $width={33}>
							<Select
								label="Agent Type"
								name="type"
								placeholder="Please select an agent type."
								values={[
									{ label: 'Agent', value: '에이전트' },
									{
										label: 'Manager',
										value: '관리자',
									},
								]}
								valueStructure={{ label: 'label', key: 'value' }}
								register={register}
								errors={errors}
								error={!!errors.type}
								options={{ required: 'Please enter the agent type.' }}
							/>
						</Free.Value>
					)}
					<Free.Value $width={33}>
						<Select
							label="Grade"
							name="grade"
							placeholder="Please select the grade."
							values={
								grade?.map((item) => {
									return { label: item.grade, value: item.grade };
								}) ?? []
							}
							valueStructure={{ label: 'label', key: 'value' }}
							register={register}
							errors={errors}
							error={!!errors.grade}
							options={{ required: VALIDATION_MESSAGE.grade.required }}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button style={{ zIndex: 10 }} type="submit" status="primary" text="Add" />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}

			<Loader isFetching={isLoadingCreate || isLoadingUpdate} />
		</>
	);
};

export default AgentCreateForm;
