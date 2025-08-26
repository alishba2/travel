import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useState } from 'react';
import * as S from './styled';
import { Radio, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { BatchStatusType, BatchType, GetBatchListPayload, PostBatchCopyPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import EstimateCreateForm from './components/EstimateCreateForm';
import { getYmd, getYoil } from '@shared/utils/dayUtils';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BatchSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import Select from '@components/Select';
import { StatusEng, comma, createLinkAndCopy, unit } from '@shared/utils/base';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';
import { useCreateBatchCopy, useDeleteBatch, useGetBatchList } from '@shared/hooks/queries/batch';
import { aesEncrypt } from '@shared/utils/crypto';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import { ButtonView } from '@components/ButtonBox/styled';
import useExcel from '@shared/hooks/useExcel';
import { getBatchList } from '@shared/apis/batch';
import { getEstimateOneWayList } from '@shared/apis/estimate';

interface IFormValues {
	status: BatchStatusType;
	title: string;
	recipient: string;
	startDate: Date;
	orderBy: 'Date Created' | 'Price' | 'Total Number of People' | 'Travel Start Date';
	order: 'ASC' | 'DESC';
}

const ORDER = ['ASC', 'DESC'];
const ORDER_BY = ['Date Created', 'Price', 'Total Number of People', 'Travel Start Date'];

const STATUS = [
	{ label: 'Pending Response', value: 1 },
	{ label: 'Response Completed', value: 2 },
	{ label: 'Finalized', value: 3 },
];

const MyEstimate: FC = () => {
	/**
	 * States
	 */
	const navigate = useNavigate();

	const { register, handleSubmit, setValue, watch } = useForm<IFormValues>({
		defaultValues: {
			order: 'ASC',
			orderBy: 'Date Created',
		},
	});

	const { confirm, failAlert } = useModal();
	const { page, countPerPage, setPage, setTotalCount, Paging } = usePaging();

	const [isLoadingExcel, setIsLoadingExcel] = useState(false);

	const [searchPayload, setSearchPayload] = useState<GetBatchListPayload>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	const watchStartDate = watch('startDate');
	const watchOrder = watch('order');
	const watchOrderBy = watch('orderBy');

	const { excelDownload } = useExcel();

	/**
	 * Queries
	 */
	const { data: batches, isLoading, isFetching, refetch } = useGetBatchList(searchPayload);
	const [batchList, totalCount] = batches ?? [undefined, 0];

	const { mutate: copyBatch, isLoading: isLoadingCopy } = useCreateBatchCopy();
	const { mutate: deleteBatch, isLoading: isLoadingDelete } = useDeleteBatch();

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (page) {
			setSearchPayload((prev) => ({
				...prev,
				page,
				countPerPage,
				type: 'one-way',
				order: watchOrder,
				orderBy: watchOrderBy,
			}));
		}
	}, [page]);

	useEffect(() => {
		setTotalCount(totalCount);
	}, [totalCount]);

	/**
	 * Handlers
	 */

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		const { recipient, startDate, title, order, orderBy } = data;

		const payload = {
			page: 1,
			countPerPage: 10,
			recipient: recipient || undefined,
			startDate: startDate || undefined,
			title: title || undefined,
			type: 'one-way' as BatchType,
			order: order || undefined,
			orderBy: orderBy || undefined,
		};

		setSearchPayload(payload);
		setPage(1);
	};

	const copy = (batchId: number) => {
		confirm({
			message: 'This quote will be duplicated',
			okHandler: () => {
				const payload: PostBatchCopyPayload = {
					batchId,
				};

				copyBatch(payload, {
					onSuccess: () => {
						refetch();
						successToast('Duplication was successful.');
					},
					onError: () => {
						errorToast('Duplication failed.');
					},
				});
			},
		});
	};

	const handleReset = () => {
		setValue('recipient', '');
		setValue('startDate', getYmd(new Date(), 'YYYY-MM-DD') as any);
		setValue('title', '');
	};

	const goDetail = (id: number) => {
		navigate(PATHS.MY_ESTIMATE_DETAIL.replace(':id', String(id)));
	};

	const removeBatch = (id: number) => {
		confirm({
			message: 'Do you want to delete the batch?',
			okHandler: () => {
				deleteBatch(id.toString(), {
					onSuccess: () => {
						successToast('The batch has been deleted.');
						refetch();
					},
					onError: () => {
						failAlert('Failed to delete the batch.');
					},
				});
			},
		});
	};

	const handleExcelDownload = async () => {
		setIsLoadingExcel(true);
		try {
			const res = await getBatchList({
				page: 1,
				countPerPage: 999,
				type: 'one-way',
				order: 'ASC',
				orderBy: 'Date Created',
			});
			const [list] = res ?? [undefined, 0];
			const header = {
				Customer: 'Customer',
				Title: 'Title',
				'Total Price(USD)': 'Total Price(USD)',
				'Travel Duration': 'Travel Duration',
				PAX: 'PAX',
				Status: 'Status',
				'Created Date': 'Created Date',
			};

			const excelData = list.map((o) => ({
				Customer: o.recipient ? o.recipient : '-',
				Title: o.title,
				'Total Price(USD)': `$${comma(o.autoSumAmount)} ($${comma(
					Math.round(o.autoSumAmount / (o.childrenCount + o.adultsCount)),
				)} / Person)`,
				'Travel Duration': `${getYmd(o.startDate, 'DD.MM.YYYY')} ~ ${getYmd(o.endDate, 'DD.MM.YYYY')}`,
				PAX: `Adults : ${o.adultsCount} / Children : ${o.childrenCount} (Total PAX: ${
					o.childrenCount + o.adultsCount
				})`,
				Status: StatusEng?.[o.status] ?? '',
				'Created Date': getYmd(o.createdAt, 'DD.MM.YYYY'),
			}));

			excelDownload({ list: excelData, header });
			setIsLoadingExcel(false);
		} catch {
			failAlert('다운로드에 실패하였습니다.');
			setIsLoadingExcel(false);
		}
	};

	const handleDetailExcelDownload = async (id: number) => {
		try {
			setIsLoadingExcel(true);
			const res = await getEstimateOneWayList({ batchId: Number(id) });
			const { estimateDetails } = res ?? undefined;
			console.log('estimateDetailsestimateDetails', estimateDetails);

			const header = {
				Type: 'Type',
				NameKor: 'NameKor',
				NameEng: 'NameEng',
				OriginPrice: 'OriginPrice',
				SalesPrice: 'SalesPrice',
				Days: 'Days',
				Sequence: 'Sequence',
				Quantity: 'Quantity',
				Address: 'Address',
				Description: 'Description',
				Keyword: 'Keyword',
				Enable: 'Enable',
				WebsiteLink: 'WebsiteLink',
				PersonalTag: 'PersonalTag',
			};

			const excelData = estimateDetails.map((o) => {
				const { item } = o;
				return {
					Type: item.type,
					NameKor: item.nameKor,
					NameEng: item.nameEng,
					OriginPrice: `$${comma(item.price)}`,
					Address: item?.addressEnglish ?? '',
					Description: item?.description ?? '',
					Keyword: item?.keyword ?? '',
					Enable: item.enable ? 'O' : 'X',
					WebsiteLink: item?.websiteLink ?? '',
					PersonalTag: item?.personalTag ?? '',
					SalesPrice: `$${comma(o.price)}`,
					Days: o.days,
					Sequence: o.sequence,
					Quantity: o.quantity,
				};
			});

			excelDownload({ list: excelData, header });

			setIsLoadingExcel(false);
		} catch {
			failAlert('다운로드에 실패하였습니다.');
			setIsLoadingExcel(false);
		}
	};

	/**
	 * Helpers
	 */

	const refetchBatchList = () => {
		setMode('select');
		setSearchPayload({ page: 1, countPerPage: 10, type: 'one-way' });
		refetch();
	};

	return (
		<S.Container>
			<Title title="My Quote Management" desc="You can create a quote.">
				<ButtonView>
					<Button type="button" status="third_outlined" text="Excel Download" onClick={handleExcelDownload} />
					<Button
						type="button"
						status="third"
						text={needCreateForm ? 'Collapse' : 'Add to quotation'}
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
				</ButtonView>
			</Title>

			<Blank size={24} />

			{/*  */}

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={50}>
						<TextField label="Title" name="title" placeholder="Please enter the title." register={register} />
					</Free.Value>
					<Free.Value>
						<TextField label="Customer" name="recipient" placeholder="Please enter the customer." register={register} />
					</Free.Value>
					{/* <Free.Value $width={33.3}>
						<Select
							label="Status"
							name="status"
							placeholder="Please select a status."
							values={STATUS}
							valueStructure={{ label: 'label', key: 'value' }}
							register={register}
						/>
					</Free.Value> */}
				</Free.Row>

				{/* <Free.Row>
					<Free.Value $width={50}>
						<Select
							label="Order By Option"
							name="orderBy"
							placeholder="Please select an order by option."
							values={ORDER_BY}
							register={register}
						/>
					</Free.Value>
					<Free.Value $width={50}>
						<RadioWrapper label="Order">
							{ORDER.map((item) => {
								return (
									<Radio
										name="order"
										key={item}
										label={item}
										register={register}
										value={item}
										checked={watchOrder === item}
									/>
								);
							})}
						</RadioWrapper>
					</Free.Value>
				</Free.Row> */}

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
				</Free.Row>

				<ButtonBox>
					<Button type="submit" status="primary" text="Search">
						<IconSearch color="white" size={14} />
					</Button>
					<Button status="primary_outlined" text="Reset Conditions" onClick={handleReset} />
				</ButtonBox>
			</Free.SearchTable>

			{/*  */}
			{needCreateForm && <EstimateCreateForm needCreateForm={needCreateForm} refetch={refetchBatchList} />}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results" />
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={4} />
					<Free.Label $width={8}>Customer</Free.Label>
					<Free.Label $width={20}>Title</Free.Label>
					<Free.Label $width={10}>Total Price(USD)</Free.Label>
					<Free.Label $width={10}>Travel Duration</Free.Label>
					<Free.Label $width={10}>PAX</Free.Label>
					<Free.Label $width={8}>Status</Free.Label>
					<Free.Label $width={8}>Created Date</Free.Label>
					<Free.Label $width={22}>Options</Free.Label>
				</Free.Row>
				{batchList &&
					batchList.map((o: BatchSchema, index: number) => (
						<Free.Row key={o.id}>
							<Free.Value $width={4}>{totalCount - (page - 1) * countPerPage - index}</Free.Value>
							<Free.Value $width={8}>{o.recipient ? o.recipient : '-'}</Free.Value>
							<Free.Value
								$width={20}
								onClick={() => {
									goDetail(o.id);
								}}
								$isPointer
							>
								{o.title}
							</Free.Value>
							<Free.Value $width={10} style={{ display: 'flex', flexDirection: 'column', gap: unit(5) }}>
								<div>${comma(o.autoSumAmount)}</div>
								<div>(${comma(Math.round(o.autoSumAmount / (o.childrenCount + o.adultsCount)))} / Person)</div>
							</Free.Value>
							<Free.Value $width={10}>
								<div style={{ display: 'flex', flexDirection: 'column', gap: unit(5) }}>
									<div>{getYmd(o.startDate, 'DD.MM.YYYY')}</div>
									<div>{getYmd(o.endDate, 'DD.MM.YYYY')}</div>
								</div>
							</Free.Value>
							<Free.Value $width={10} style={{ display: 'flex', flexDirection: 'column', gap: `${unit(5)}` }}>
								<div>Adults : {o.adultsCount}</div>
								<div>Children : {o.childrenCount}</div>
								<div>(Total PAX: {o.childrenCount + o.adultsCount})</div>
								{/* <div>infants : {o.infantsCount}</div> */}
							</Free.Value>
							<Free.Value $width={8}>{StatusEng?.[o.status] ?? ''}</Free.Value>
							<Free.Value $width={8}>{getYmd(o.createdAt, 'DD.MM.YYYY')}</Free.Value>
							<Free.Value $width={22}>
								<OptionButtons>
									<RowButton $status="primary_outlined" onClick={() => createLinkAndCopy(o.id)}>
										Link
									</RowButton>
									<RowButton $status="primary_outlined" onClick={() => copy(o.id)}>
										Copy
									</RowButton>
									<RowButton
										$status="primary_outlined"
										onClick={() => {
											goDetail(o.id);
										}}
									>
										View
									</RowButton>
									<RowButton
										$status="danger_outlined"
										onClick={() => {
											removeBatch(o.id);
										}}
									>
										Delete
									</RowButton>
									{/* <RowButton
										$status="secondary_outlined"
										onClick={() => {
											handleDetailExcelDownload(o.id);
										}}
									>
										Excel
									</RowButton> */}
								</OptionButtons>
							</Free.Value>
						</Free.Row>
					))}

				<EmptyResult items={batchList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingCopy || isFetching || isLoadingDelete || isLoadingExcel} />
		</S.Container>
	);
};

export default MyEstimate;
