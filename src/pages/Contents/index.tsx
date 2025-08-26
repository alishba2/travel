import Title from '@components/Title';
import usePaging from '@shared/hooks/usePaging';
import { Colors, OptionButtons, RowButton } from '@styles/globalStyles';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useRef, useState } from 'react';
import * as S from './styled';
import { CheckBox, Radio, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { GetItemListPayload } from '@typings/payload';
import Loader from '@components/Loader';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Blank from '@components/Blank';
import ContentsCreateForm from './components/ContentsCreateForm';
import { isUndefined } from 'lodash-es';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { ItemSchema } from '@typings/schema';
import EmptyResult from '@components/EmptyResult';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import Select from '@components/Select';
import { useDeleteItem, useGetItemDetail, useGetItemList, usePostItemCopy } from '@shared/hooks/queries/item';
import { comma, getItemImg } from '@shared/utils/base';
import { safeJsonParse } from '@shared/utils/json';
import { FreeModal, IModal } from '@components/Modal';
import { useItemSearchStore } from '@shared/store/itemSearch';
import { ButtonView } from '@components/ButtonBox/styled';
import { getItemList } from '@shared/apis/item';
import useExcel from '@shared/hooks/useExcel';
import { useGoogleMapStore } from '@shared/store/googleMap';

interface IFormValues {
	nameKor: string;
	nameEng: string;
	enable: string;
	agent: string;
}

const Contents: FC = () => {
	/**
	 * States
	 */

	const { itemId, dispatchItemId } = useItemSearchStore((state) => state);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<IFormValues>({
		defaultValues: {
			enable: 'Exposed',
		},
	});

	const { confirm, failAlert } = useModal();
	const { page, countPerPage, setPage, setTotalCount, Paging } = usePaging();

	const [selectedFiles, setSelectedFiles] = useState<any>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [isLoadingExcel, setIsLoadingExcel] = useState(false);

	const { excelDownload } = useExcel();

	const [detailSearchPayload, setDetailSearchPayload] = useState<{ id: number }>();

	const [searchPayload, setSearchPayload] = useState<GetItemListPayload>({
		page: 1,
		countPerPage: 10,
		type: '컨텐츠',
		enable: true,
	});
	const [editTarget, setEditTarget] = useState<ItemSchema>();
	const [mode, setMode] = useState<'select' | 'create' | 'edit'>('select');
	const needCreateForm = mode === 'create' || mode === 'edit';

	const watchEnable = watch('enable');

	const fileModal = useRef<IModal>(null);

	const { dispatchMap } = useGoogleMapStore();

	/**
	 * Queries
	 */
	const { data: item, isLoading, isFetching, refetch } = useGetItemList(searchPayload);
	const [itemList, totalCount] = item ?? [undefined, 0];

	const { data: itemDetail, refetch: refetchDetail } = useGetItemDetail(detailSearchPayload);
	const [itemDetailList, detailTotalCount] = itemDetail ?? [undefined, 0];

	const { mutate: postItemCopy, isLoading: isLoadingCopy } = usePostItemCopy();
	const { mutate: deleteItem, isLoading: isLoadingDelete } = useDeleteItem();

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (page) {
			setSearchPayload((prev) => ({ ...prev, page, countPerPage }));
		}
	}, [page]);

	useEffect(() => {
		setTotalCount(itemId ? detailTotalCount : totalCount);
	}, [totalCount, detailTotalCount]);

	useEffect(() => {
		if (mode === 'select') {
			setEditTarget(undefined);
		}
	}, [mode]);

	useEffect(() => {
		if (itemId) {
			setDetailSearchPayload({ id: itemId });
		}
	}, [itemId]);

	useEffect(() => {
		return () => {
			dispatchItemId(0);
		};
	}, []);

	/**
	 * Handlers
	 */
	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		if (isFetching) return;

		const { agent, enable, nameEng, nameKor } = data;

		const convertAgent = safeJsonParse(agent)?.value || undefined;

		const payload: GetItemListPayload = {
			nameEng: nameEng || undefined,
			nameKor: nameKor || undefined,
			agentId: convertAgent || undefined,
			enable: enable === 'Exposed',
			type: '컨텐츠',
			page: 1,
			countPerPage: 10,
		};

		setSearchPayload(payload);
		setSelectedIds([]);
		setPage(1);
	};

	const removeItem = (id: number) => {
		const payload = { ids: id.toString() };
		confirm({
			message: 'Do you want to delete the product?',
			okHandler: () => {
				deleteItem(payload, {
					onSuccess: () => {
						successToast('The product has been deleted.');
						refetch();
					},
					onError: () => {
						failAlert('Failed to delete the product.');
					},
				});
			},
		});
	};

	const handleEditItem = (data: ItemSchema) => {
		setMode('edit');
		setEditTarget(data);

		window.scrollTo({
			top: 0,
			behavior: 'smooth', // 'smooth' Options을 사용하여 부드럽게 스크롤
		});
	};

	const handleReset = () => {
		setValue('enable', 'Exposed');
		setValue('agent', '');
		setValue('nameKor', '');
		setValue('nameEng', '');
	};

	const handleRemoveSelectedItems = () => {
		if (!selectedIds.length) return;

		const payload = { ids: selectedIds.join(',') };
		confirm({
			message: 'Do you want to delete the selected product?',
			okHandler: () => {
				deleteItem(payload, {
					onSuccess: () => {
						successToast('The product has been deleted.');
						setSelectedIds([]);
						refetch();
					},
					onError: () => {
						failAlert('Failed to delete the product.');
						setSelectedIds([]);
					},
				});
			},
		});
	};

	const copy = (id: number) => {
		confirm({
			message: 'This item will be duplicated',
			okHandler: () => {
				postItemCopy(
					{ itemId: id },
					{
						onSuccess: () => {
							refetch();
							successToast('Duplication was successful.');
						},
						onError: () => {
							errorToast('Duplication failed.');
						},
					},
				);
			},
		});
	};

	const handleExcelDownload = async () => {
		setIsLoadingExcel(true);
		try {
			const res = await getItemList({ page: 1, countPerPage: 999, type: '컨텐츠', enable: true });
			const [list] = res ?? [undefined, 0];
			const header = {
				Exposed: 'Exposed',
				Name: 'Name',
				'English Name': 'English Name',
				'Price (USD)': 'Price (USD)',
				Address: 'Address',
				Description: 'Description',
			};

			const excelData = list.map((o) => ({
				Exposed: o.enable ? 'O' : 'X',
				Name: o.nameKor,
				'English Name': o.nameEng,
				'Price (USD)': comma(o.price),
				Address: o.addressEnglish,
				Description: o.description,
			}));

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
	const refetchItemList = () => {
		if (itemId) {
			refetchDetail();
		} else {
			refetch();
		}
		setMode('select');

		//

		if (mode === 'create') {
			setPage(1);
			handleReset();
			setSearchPayload({
				page: 1,
				countPerPage,
				type: '컨텐츠',
				enable: true,
			});
		}
	};

	const targetList = itemId ? itemDetailList : itemList;

	return (
		<S.Container>
			<Title title="Contents Management" desc="You can manage contents.">
				<ButtonView>
					<Button type="button" status="third_outlined" text="Excel Download" onClick={handleExcelDownload} />
					<Button
						type="button"
						status="third"
						text={needCreateForm ? 'Collapse' : 'Add to contents'}
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
						<RadioWrapper label="Exposed">
							<Radio
								name="enable"
								label="Exposed"
								register={register}
								value="Exposed"
								checked={watchEnable === 'Exposed'}
							/>
							<Radio
								name="enable"
								label="Hidden"
								register={register}
								value="Hidden"
								checked={watchEnable === 'Hidden'}
							/>
						</RadioWrapper>
					</Free.Value>
					{/* <Free.Value>
						<Select
							label="Agent"
							name="agent"
							placeholder="Please select an agent."
							values={[]}
							valueStructure={{ label: 'label', key: 'value' }}
							register={register}
							// errors={errors}
							// error={!!errors.agent}
							// options={{ required: VALIDATION_MESSAGE.agent.required }}
						/>
					</Free.Value> */}
				</Free.Row>
				<Free.Row>
					<Free.Value $width={50}>
						<TextField
							label="Contents Name(Korean)"
							name="nameKor"
							placeholder="Please enter the contents name in Korean."
							register={register}
							// errors={errors}
							// error={!!errors.nameKor}
							// options={{ required: VALIDATION_MESSAGE.nameKor.required }}
						/>
					</Free.Value>
					<Free.Value>
						<TextField
							label="Contents Name(English)"
							name="nameEng"
							placeholder="Please enter the contents name in English."
							register={register}
							// errors={errors}
							// error={!!errors.nameEng}
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
				<ContentsCreateForm needCreateForm={needCreateForm} editTarget={editTarget} refetch={refetchItemList} />
			)}

			{/*  */}

			<Blank size={80} />

			{/*  */}

			<Title title="Search Results">
				<Button type="submit" status="warning" text="Delete Selected" onClick={handleRemoveSelectedItems} />
			</Title>
			<Blank size={10} />

			<Free.ResultTable>
				<Free.Row>
					<Free.Label $width={4} />
					<Free.Label $width={5}>Exposed</Free.Label>
					<Free.Label $width={10}>Main Image</Free.Label>
					<Free.Label $width={10}>Name</Free.Label>
					<Free.Label $width={17}>English Name</Free.Label>
					<Free.Label $width={8}>Price (USD)</Free.Label>
					<Free.Label $width={10}>Address</Free.Label>
					<Free.Label $width={15}>Description</Free.Label>
					<Free.Label $width={7}>Grade</Free.Label>
					<Free.Label $width={14}>Options</Free.Label>
				</Free.Row>

				{!isUndefined(targetList) &&
					targetList.map((o, index) => {
						const {
							id,
							enable,
							nameEng,
							nameKor,
							price,
							address,
							description,
							files,
							addressEnglish,
							lat,
							lng,
							grade,
						} = o;
						const isLast = index === targetList.length - 1;
						const getThumbnail = files.find((o2) => o2.type === '썸네일');
						const getDetails = files.filter((o3) => o3.type !== '썸네일');

						return (
							<Free.Row key={id} $isLast={isLast}>
								<Free.Value $width={4}>
									<CheckBox
										isChecked={selectedIds.includes(id)}
										checkHandler={() => {
											setSelectedIds((prev) => {
												if (prev.includes(id)) {
													return prev.filter((a) => a !== id);
												}
												return [...prev, id];
											});
										}}
									/>
								</Free.Value>
								<Free.Value $width={5}>{enable ? 'O' : 'X'}</Free.Value>
								<Free.Value $width={10}>
									<img src={getItemImg(getThumbnail?.itemSrc)} style={{ width: '100%', height: 'auto' }} alt="" />
								</Free.Value>
								<Free.Value $width={10}>{nameKor}</Free.Value>
								<Free.Value $width={17}>{nameEng}</Free.Value>
								<Free.Value $width={8}>{comma(price)}</Free.Value>
								<Free.Value
									$width={10}
									style={{ textDecoration: 'underline', cursor: 'pointer' }}
									$color={Colors.blue}
									onClick={() => {
										if (!lat || !lng || !addressEnglish) {
											failAlert('The latitude and longitude are missing. Please re-enter the address.');
											return;
										}
										dispatchMap({ lat: Number(lng), lng: Number(lat), isOpen: true });
									}}
								>
									{addressEnglish}
								</Free.Value>
								<Free.Value $width={15}>{description}</Free.Value>
								<Free.Value $width={7}>{grade}</Free.Value>

								<Free.Value $width={14}>
									<OptionButtons>
										<RowButton
											$status="primary_outlined"
											onClick={() => {
												setSelectedFiles(getDetails);
												fileModal.current?.open();
											}}
										>
											Details
										</RowButton>
										<RowButton $status="primary_outlined" onClick={() => copy(o.id)}>
											copy
										</RowButton>
										<RowButton $status="primary_outlined" onClick={() => handleEditItem(o)}>
											Edit
										</RowButton>
										<RowButton $status="danger_outlined" onClick={() => removeItem(id)}>
											Delete
										</RowButton>
									</OptionButtons>
								</Free.Value>
							</Free.Row>
						);
					})}
				<EmptyResult items={targetList} />
			</Free.ResultTable>

			{/*  */}

			<Paging />

			<Loader isFetching={isLoading || isLoadingDelete || isLoadingCopy || isLoading || isLoadingExcel} />

			<FreeModal ref={fileModal} needCloseButton>
				<S.FileModalBox>
					<p>Detail Images</p>
					<div>
						{selectedFiles.map((file: any) => {
							return (
								<figure key={file.id}>
									<img src={getItemImg(file?.itemSrc)} style={{ width: '100%', height: 'auto' }} alt="" />
								</figure>
							);
						})}
					</div>
				</S.FileModalBox>
			</FreeModal>
		</S.Container>
	);
};

export default Contents;
