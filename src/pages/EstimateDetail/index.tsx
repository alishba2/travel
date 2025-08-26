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
import EstimateCreateForm from './components/EstimateCreateForm';
import { isUndefined } from 'lodash-es';
import { getYmd } from '@shared/utils/dayUtils';
import { successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BoardListSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import { useDeleteBoard, useGetBoardList } from '@shared/hooks/queries/board';
import Select from '@components/Select';
import { comma } from '@shared/utils/base';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';

interface IFormValues {
	name: string;
	startDate: string;
	status: string;
}

const STATUS = [
	{ label: '답변 전', value: 1 },
	{ label: '답변완료', value: 2 },
	{ label: '최종완료', value: 3 },
];

const EstimateDetail: FC = () => {
	/**
	 * States
	 */
	const navigate = useNavigate();

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
		console.log(data);
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
		setValue('startDate', '');
	};

	const goCreate = () => {
		navigate(PATHS.CREATE);
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
			<Title title="고객 정보" desc={`Name : 홍길동\n이메일 : example@gmail.com`}>
				{/* <Button
					type="submit"
					status="third"
					text={needCreateForm ? 'Collapse' : '견적서 등록'}
					onClick={() => {
						if (needCreateForm) {
							setMode('select');
						} else {
							setMode('create');
						}
					}}
				>
					{needCreateForm ? undefined : <IconPlus color="white" size={14} />}
				</Button> */}
			</Title>

			<Blank size={25} />

			{/*  */}

			{/* <Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={50}>
						<TextField label="고객명" name="name" placeholder="고객명을 입력해주세요." register={register} />
					</Free.Value>
					<Free.Value>
						<TextField label="시작일자" name="startDate" placeholder="시작일자를 입력해주세요." register={register} />
					</Free.Value>
				</Free.Row>

				<Free.Row>
					<Free.Value $width={50}>
						<Select
							label="상태"
							name="status"
							placeholder="Please select a status."
							values={STATUS}
							valueStructure={{ label: 'label', key: 'value' }}
							register={register}
						/>
					</Free.Value>
				</Free.Row>

				<ButtonBox>
					<Button type="submit" status="primary" text="Search">
						<IconSearch color="white" size={14} />
					</Button>
					<Button status="primary_outlined" text="Reset Conditions" onClick={handleReset} />
				</ButtonBox>
			</Free.SearchTable> */}

			{/*  */}
			{needCreateForm && (
				<EstimateCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchBoardList} />
			)}

			{/*  */}

			{/*  */}

			<Title title="견적 리스트" />
			<Blank size={10} />

			<Free.ResultTable>
				{/* <Free.Row>
					<Free.Label $width={6} />
					<Free.Label $width={10}>여행지</Free.Label>
					<Free.Label $width={10}>요청자</Free.Label>
					<Free.Label $width={8}>기간</Free.Label>
					<Free.Label $width={15}>총 Price</Free.Label>
					<Free.Label $width={15}>최초요청일자</Free.Label>
					<Free.Label $width={8}>보낸 견적</Free.Label>
					<Free.Label $width={8}>상태</Free.Label>
					<Free.Label>Options</Free.Label>
				</Free.Row> */}

				<Free.Row $isNonBorderBottom>
					<Free.Value $width={25}>1박2일</Free.Value>
					<Free.Value $width={25}>{comma(1000000)}원</Free.Value>
					<Free.Value $width={30}>경복궁, 호텔, 공항</Free.Value>
					<Free.Value>
						<OptionButtons>
							{/* <RowButton $status="primary_outlined" onClick={() => {}}>
											Details
										</RowButton> */}
							<RowButton $status="primary_outlined" onClick={() => {}}>
								열람
							</RowButton>
							<RowButton $status="danger_outlined" onClick={() => {}}>
								Delete
							</RowButton>
						</OptionButtons>
					</Free.Value>
				</Free.Row>

				<S.EstimateDetailBox>
					<ul>
						<p>1일차</p>
						<li>{'공항 -> 호텔 -> 경복궁 -> 호텔'}</li>
						<Blank size={15} />
						<p>2일차</p>
						<li>{'호텔 -> 명동 -> 공항'}</li>
					</ul>
					<OptionButtons>
						<RowButton
							$status="primary_outlined"
							onClick={() => {
								goCreate();
							}}
						>
							답변하기
						</RowButton>
					</OptionButtons>
				</S.EstimateDetailBox>

				<Free.Row>
					<Free.Value $width={25}>1박2일</Free.Value>
					<Free.Value $width={25}>{comma(2000000)}원</Free.Value>
					<Free.Value $width={30}>경복궁, 명동, 호텔, 공항</Free.Value>
					<Free.Value>
						<OptionButtons>
							{/* <RowButton $status="primary_outlined" onClick={() => {}}>
											Details
										</RowButton> */}
							<RowButton $status="primary_outlined" onClick={() => {}}>
								열람
							</RowButton>
							<RowButton $status="danger_outlined" onClick={() => {}}>
								Delete
							</RowButton>
						</OptionButtons>
					</Free.Value>
				</Free.Row>
				<EmptyResult items={boardList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingDelete} />
		</S.Container>
	);
};

export default EstimateDetail;
