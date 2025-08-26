import Title from '@components/Title';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import { TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import Blank from '@components/Blank';
import { useModal } from '@shared/hooks';
import { successToast } from '@shared/utils/toastUtils';
import { isUndefined } from 'lodash-es';
import Loader from '@components/Loader';
import useMe from '@shared/hooks/useMe';
import { GradeSchema } from '@typings/schema';
import { usePostGradeAdd, usePutGradeEdit } from '@shared/hooks/queries/grade';

interface Props {
	needCreateForm: boolean;
	editTarget?: GradeSchema;
	refetch: () => void;
}

interface IFormValues {
	grade: string;
}

const GradeCreateForm: FC<Props> = ({ needCreateForm, editTarget, refetch }) => {
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

	const { mutate: postGradeAdd, isLoading: isLoadingCreate } = usePostGradeAdd();
	const { mutate: updateGradeEdit, isLoading: isLoadingUpdate } = usePutGradeEdit();

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (isUndefined(editTarget)) return;

		const { grade } = editTarget;
		setValue('grade', grade);
	}, [editTarget]);

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { grade } = data;

		if (isUndefined(editTarget)) {
			postGradeAdd(
				{ grade },
				{
					onSuccess: () => {
						successToast('Added the grade.');
						refetch();
					},
					onError: (err: any) => {
						if (err?.response?.data?.message?.length) {
							failAlert(err?.response?.data?.message?.[0]);
						} else {
							failAlert('Failed to add the grade.');
						}
					},
				},
			);
		} else {
			const editPayload = {
				id: editTarget.id,
				grade,
			};

			updateGradeEdit(editPayload, {
				onSuccess: () => {
					successToast('The grade has been updated.');
					refetch();
				},
				onError: (err: any) => {
					if (err?.response?.data?.message?.length) {
						failAlert(err?.response?.data?.message?.[0]);
					} else {
						failAlert('Failed to update the grade.');
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
			<Title title="Add/Edit Grade" desc="You can add or edit grade." />

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				{/*  */}

				<Free.Row>
					<Free.Value $width={25}>
						<TextField
							label="Grade"
							name="grade"
							placeholder="Please enter the grade."
							register={register}
							errors={errors}
							error={!!errors.grade}
							options={{ required: 'Please enter the grade.' }}
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

export default GradeCreateForm;
