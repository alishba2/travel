import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import * as S from './styled';
import { TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { GetBoardListPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import NoticeCreateForm from './components/NoticeCreateForm';
import { isUndefined } from 'lodash-es';
import { getYmd } from '@shared/utils/dayUtils';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BoardListSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import { useDeleteBoard, useGetBoardList } from '@shared/hooks/queries/board';

interface IFormValues {
	title: string;
	content: string;
	username: string;
	name: string;
}

const Notice: FC = () => {
	/**
	 * States
	 */
	const { register, handleSubmit, setValue } = useForm<IFormValues>();

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
		if (isFetching) return;
		const { title, content, username, name } = data;

		const payload = {
			page: 1,
			countPerPage,
			type: 'A',
			title: title || undefined,
			content: content || undefined,
			username: username || undefined,
			name: name || undefined,
		};

		setPage(1);
		setSearchPayload(payload);
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
		setValue('title', '');
		setValue('content', '');
		setValue('username', '');
		setValue('name', '');
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
			<Title title="공지사항 조회" desc="공지사항을 조회할 수 있습니다.">
				<Button
					type="submit"
					status="third"
					text={needCreateForm ? 'Collapse' : '공지사항 등록'}
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

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value>
						<TextField label="작성자 ID" name="username" placeholder="작성자 ID를 입력해주세요." register={register} />
					</Free.Value>

					<Free.Value $width={50}>
						<TextField label="작성자 Name" name="name" placeholder="작성자 Name을 입력해주세요." register={register} />
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value>
						<TextField width={950} label="제목" name="title" placeholder="제목을 입력해주세요." register={register} />
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value>
						<TextField width={950} label="내용" name="content" placeholder="내용을 입력해주세요." register={register} />
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
				<NoticeCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchBoardList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={6}>번호</Free.Label>
					<Free.Label $width={26}>제목</Free.Label>
					<Free.Label $width={42}>Description</Free.Label>
					<Free.Label $width={14}>Edit일</Free.Label>
					<Free.Label>Options</Free.Label>
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

export default Notice;
