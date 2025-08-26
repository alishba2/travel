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
import Loader from '@components/Loader';
import { useCreateBatch } from '@shared/hooks/queries/batch';
import * as S from '../styled';

interface Props {
	needCreateForm: boolean;
	refetch: () => void;
}

interface IFormValues {
	title: string;
	startDate: Date;
	endDate: Date;
	adultsCount: number | string;
	childrenCount: number | string;
	infantsCount: number | string;
	recipient: string;
	onlyPlace: boolean;
	hidePrice: boolean;
}

const EstimateCreateForm: FC<Props> = ({ needCreateForm, refetch }) => {
	/**
	 * States
	 */

	const {
		formState: { errors },
		register,
		handleSubmit,
	} = useForm<IFormValues>();

	const { failAlert } = useModal();

	/**
	 * Queries
	 */

	const { mutate: postBatch, isLoading } = useCreateBatch();

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { adultsCount, childrenCount, endDate, infantsCount, recipient, startDate, title, onlyPlace, hidePrice } =
			data;

		const payload = {
			startDate,
			endDate,
			title,
			adultsCount: Number(adultsCount) ?? 0,
			childrenCount: Number(childrenCount) ?? 0,
			infantsCount: Number(infantsCount) ?? 0,
			recipient,
			type: 'one-way',
			onlyPlace,
			hidePrice,
		};

		postBatch(payload, {
			onSuccess: () => {
				successToast('The quotation has been added.');
				refetch();
			},
			onError: () => {
				failAlert('Failed to add the quotation.');
			},
		});
	};

	/**
	 * Helpers
	 */

	if (!needCreateForm) return null;

	return (
		<>
			<Blank size={60} />

			<Title title="Add Quotation" desc="You can add a quotation.">
				{/* <Button text="Collapse" status="third" width={120} onClick={refetch} /> */}
			</Title>

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable style={{ position: 'relative' }} onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={100 / 2}>
						<TextField label="Title" name="title" placeholder="Please enter the title" register={register} />
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={100 / 6}>
						<TextField
							type="date"
							label="Travel Start Date"
							name="startDate"
							placeholder="Please Enter the travel start date."
							register={register}
						/>
					</Free.Value>
					<Free.Value $width={100 / 6}>
						<TextField
							type="date"
							label="Travel End Date"
							name="endDate"
							placeholder="Please Enter the travel end date."
							register={register}
						/>
					</Free.Value>
				</Free.Row>
				<Free.Row>
					<Free.Value $width={100 / 8}>
						<TextField
							label="Adults"
							name="adultsCount"
							placeholder="Please Enter the number of adults."
							register={register}
						/>
					</Free.Value>
					<Free.Value $width={100 / 8}>
						<TextField
							label="Children"
							name="childrenCount"
							placeholder="Please Enter the number of children."
							register={register}
						/>
					</Free.Value>
					<Free.Value $width={100 / 8}>
						<TextField
							label="FOC"
							name="infantsCount"
							placeholder="Please Enter the number of FOC."
							register={register}
						/>
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value $width={100 / 4}>
						<TextField label="Customer" name="recipient" placeholder="Please enter the customer." register={register} />
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button style={{ zIndex: 10 }} type="submit" status="primary" text="Add" />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}

			<Loader isFetching={isLoading} />
		</>
	);
};

export default EstimateCreateForm;
