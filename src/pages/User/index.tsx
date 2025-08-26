import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import * as S from './styled';
import { CheckBox, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { GetBoardListPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import UserCreateForm from './components/UserCreateForm';
import { isUndefined } from 'lodash-es';
import { getYmd } from '@shared/utils/dayUtils';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BoardListSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import { useDeleteBoard, useGetBoardList } from '@shared/hooks/queries/board';

interface IFormValues {
	name: string;
	email: string;
}

const User: FC = () => {
	/**
	 * States
	 */
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IFormValues>();

	const { confirm, failAlert } = useModal();
	const { page, countPerPage, setPage, setTotalCount, Paging } = usePaging();

	const [searchPayload, setSearchPayload] = useState<GetBoardListPayload>();
	const [editTarget, setEditTarget] = useState<BoardListSchema>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	/**
	 * Queries
	 */
	const { data: notice, isLoading, isFetching, refetch } = useGetBoardList(searchPayload);
	const [boardList, totalCount] = notice ?? [undefined, 0];

	const { mutate: deleteBoard, isLoading: isLoadingDelete } = useDeleteBoard();

	/**
	 * Side-Effects
	 */

	// useEffect(() => {
	// 	if (page) {
	// 		setSearchPayload((prev) => ({ ...prev, page, countPerPage, type: 'A' }));
	// 	}
	// }, [page]);

	// useEffect(() => {
	// 	setTotalCount(totalCount);
	// }, [totalCount]);

	// useEffect(() => {
	// 	if (mode === 'select') {
	// 		setEditTarget(undefined);
	// 	}
	// }, [mode]);

	/**
	 * Handlers
	 */
	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		console.log(data);

		if (isFetching) return;

		setPage(1);
	};

	const removeBoard = (id: number) => {
		confirm({
			message: '공지사항을 Delete하시겠습니까?',
			okHandler: () => {
				deleteBoard(id, {
					onSuccess: () => {
						successToast('공지사항이 Delete되었습니다.');
						refetch();
					},
					onError: () => {
						failAlert('공지사항 Delete에 실패했습니다.');
					},
				});
			},
		});
	};

	const handleEditBoard = (item: BoardListSchema) => {
		setMode('edit');
		setEditTarget(item);
	};

	const handleReset = () => {
		setValue('name', '');
		setValue('email', '');
	};

	/**
	 * Helpers
	 */
	const refetchBoardList = () => {
		refetch();
		setMode('select');

		//

		if (mode === 'create') {
			setPage(1);
			handleReset();
			setSearchPayload({
				page: 1,
				countPerPage,
				type: 'A',
				title: undefined,
				content: undefined,
				username: undefined,
				name: undefined,
			});
		}
	};

	return (
		<S.Container>
			<Title title="유저 조회" desc="유저를 조회할 수 있습니다." />
			{/* <Button
					type="submit"
					status="third"
					text={needCreateForm ? 'Collapse' : '유저 등록'}
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
			</Title> */}

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={50}>
						<TextField
							label="Name"
							name="name"
							placeholder="Name을 입력해주세요."
							register={register}
							// errors={errors}
							// error={!!errors.name}
							// options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="이메일"
							name="email"
							placeholder="이메일을 입력해주세요."
							register={register}
							// errors={errors}
							// error={!!errors.email}
							// options={{ required: VALIDATION_MESSAGE.nameEng.required }}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button type="submit" status="primary" text="Search">
						<IconSearch color="white" size={14} />
					</Button>
					<Button status="primary_outlined" text="Reset Conditions" onClick={handleReset} />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}
			{needCreateForm && (
				<UserCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchBoardList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={6} />
					<Free.Label $width={36}>Name</Free.Label>
					<Free.Label>이메일</Free.Label>
					{/* <Free.Label $width={14}>Edit일</Free.Label> */}
					{/* <Free.Label>Options</Free.Label> */}
				</Free.Row>

				{!isUndefined(boardList) &&
					boardList.map((item, index) => {
						const { id, updatedAt, title, content, user, manager } = item;
						const isLast = index === boardList.length - 1;

						return (
							<Free.Row key={id} $isLast={isLast}>
								<Free.Value $width={6}>{id}</Free.Value>
								<Free.Value $width={26}>{title}</Free.Value>
								<Free.Value $width={42}>{content}</Free.Value>
								<Free.Value $width={14}>{getYmd(updatedAt, 'YYYY-MM-DD HH:mm')}</Free.Value>

								<Free.Value>
									<OptionButtons>
										{/* <RowButton $status="primary_outlined" onClick={() => {}}>
											Details
										</RowButton> */}
										<RowButton $status="primary_outlined" onClick={() => handleEditBoard(item)}>
											Edit
										</RowButton>
										<RowButton $status="danger_outlined" onClick={() => removeBoard(id)}>
											Delete
										</RowButton>
									</OptionButtons>
								</Free.Value>
							</Free.Row>
						);
					})}
				<EmptyResult items={boardList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingDelete} />
		</S.Container>
	);
};

export default User;
