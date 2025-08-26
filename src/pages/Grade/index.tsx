import React, { FC, useEffect, useState } from 'react';
import Title from '@components/Title';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import * as S from './styled';
import Button from '@components/Button';
import Loader from '@components/Loader';
import { IconPlus } from '@tabler/icons-react';
import Blank from '@components/Blank';
import GradeCreateForm from './components/GradeCreateForm';
import { isUndefined } from 'lodash-es';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { GradeSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import useMe from '@shared/hooks/useMe';
import { useDeleteGrade, useGetGradeList } from '@shared/hooks/queries/grade';

const Grade: FC = () => {
	/**
	 * States
	 */

	const { managerId } = useMe();

	// const {
	// 	register,
	// 	handleSubmit,
	// 	setValue,
	// 	formState: { errors },
	// } = useForm<IFormValues>();

	const { confirm, failAlert } = useModal();

	const [editTarget, setEditTarget] = useState<GradeSchema>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	/**
	 * Queries
	 */
	const { data: grade, isLoading, isFetching, refetch } = useGetGradeList();

	const { mutate: deleteGrade, isLoading: isLoadingDelete } = useDeleteGrade();

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (mode === 'select') {
			setEditTarget(undefined);
		}
	}, [mode]);

	/**
	 * Handlers
	 */

	const removeGrade = (id: number) => {
		confirm({
			message: 'Do you want to delete grade?',
			okHandler: () => {
				deleteGrade(
					{ id: id.toString() },
					{
						onSuccess: () => {
							successToast('Deleted successfully.');
							refetch();
						},
						onError: () => {
							failAlert('Failed to delete the grade.');
						},
					},
				);
			},
		});
	};

	const handleEditGrade = (data: GradeSchema) => {
		setMode('edit');
		setEditTarget(data);
	};

	/**
	 * Helpers
	 */
	const refetchGradeList = () => {
		refetch();
		setMode('select');
	};

	return (
		<S.Container>
			<Title title="Grade Management" desc="You can manage grade.">
				<Button
					type="button"
					status="third"
					text={needCreateForm ? 'Collapse' : 'Add grade'}
					onClick={() => {
						if (needCreateForm) {
							setMode('select');
						} else {
							setMode('create');
						}
					}}
				>
					{needCreateForm ? undefined : <IconPlus color="white" size={14} />}
				</Button>
			</Title>

			<Blank size={24} />

			{/*  */}

			{/*  */}

			{needCreateForm && (
				<GradeCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchGradeList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={50}>Grade Name</Free.Label>
					<Free.Label>Options</Free.Label>
				</Free.Row>

				{!isUndefined(grade) &&
					grade.length &&
					grade.map((o, index) => {
						const { id, grade: gradeText } = o;
						const isLast = index === grade.length - 1;

						return (
							<Free.Row key={id} $isLast={isLast}>
								<Free.Value $width={50}>{gradeText}</Free.Value>
								<Free.Value>
									<OptionButtons>
										<RowButton $status="primary_outlined" onClick={() => handleEditGrade(o)}>
											Edit
										</RowButton>
										<RowButton $status="danger_outlined" onClick={() => removeGrade(id)}>
											Delete
										</RowButton>
									</OptionButtons>
								</Free.Value>
							</Free.Row>
						);
					})}

				<EmptyResult items={grade} />
			</Free.ResultTable>

			{/*  */}

			<Loader isFetching={isLoading || isLoadingDelete} />
		</S.Container>
	);
};

export default Grade;
