/* eslint-disable no-param-reassign */
import Title from '@components/Title';
import Free from '@styles/FreeTable';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import * as S from './styled';
import { CheckBox, Radio, TextArea, TextField } from '@components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import {
	GetItemSearchPayload,
	GetMyEstimateOneWayPayload,
	ItemType,
	PostMyEstimateDetailItem,
	PostMyEstimateDetailPayload,
} from '@typings/payload';
import Loader from '@components/Loader';
import Blank from '@components/Blank';
import {
	groupBy,
	isEmpty,
	isNaN,
	isUndefined,
	mapKeys,
	mapValues,
	maxBy,
	omit,
	range,
	some,
	sum,
	sumBy,
	throttle,
} from 'lodash-es';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { useModal } from '@shared/hooks';
import { BoardListSchema } from '@typings/schema';
import { CART_KEY, TIMELINE_JOIN_KEY, comma, createLinkAndCopy, whatTheBest } from '@shared/utils/base';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetEstimateOneWayList, usePostEstimateDetailBulk } from '@shared/hooks/queries/estimate';
import { useGetItemDetail, useGetItemSearch } from '@shared/hooks/queries/item';
import { VALIDATION_MESSAGE } from '@shared/constants';
import { ItemGroups, SelectedEstimateItemType } from './types';
import { DragDropZone } from './components';
import { StringKeyAndVal } from '@typings/base';
import { useDeleteBatch, useUpdateBatch } from '@shared/hooks/queries/batch';
// import useInterval from '@shared/hooks/useInterval';
import TextEditer from '@components/TextEditer';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { safeJsonParse } from '@shared/utils/json';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import { ButtonView } from '@components/ButtonBox/styled';
import dayjs from 'dayjs';
import { getEstimateOneWayList } from '@shared/apis/estimate';
import useExcel from '@shared/hooks/useExcel';
import useMe from '@shared/hooks/useMe';

interface IFormValues {
	keyword: string;
	type: ItemType;
}

interface IBatchFormValues {
	title: string;
	startDate: Date;
	endDate: Date;
	validDate: Date;
	adultsCount: number | string;
	childrenCount: number | string;
	infantsCount: number | string;
	recipient: string;
	onlyPlace: string;
	hidePrice: string;
	quotation: string;
	preparedBy: string;
	address: string;
	email: string;
	officeHours: string;
	officeNumber: string;
	emergencyNumber: string;
	// autoSumAmount: number;
}

const MEMBER_TOTAL_LENGTH = 10;

const MyEstimateDetail: FC = () => {
	/**
	 * States
	 */
	const { grade: managerGrade } = useMe();
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<IFormValues>({
		defaultValues: {
			type: '여행지',
		},
	});

	const {
		register: batchRegister,
		handleSubmit: batchHandleSubmit,
		setValue: batchSetValue,
		watch: batchWatch,
		formState: { errors: batchErrors },
	} = useForm<IBatchFormValues>({
		defaultValues: {
			adultsCount: 1,
			childrenCount: 0,
			infantsCount: 0,
		},
	});

	const mainRef = useRef<HTMLDivElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);

	const watchType = watch('type');
	const watchKeyword = watch('keyword');

	const watchTitle = batchWatch('title');
	const watchAdultsCount = batchWatch('adultsCount');
	const watchChildrenCount = batchWatch('childrenCount');
	const watchInfantsCount = batchWatch('infantsCount');
	const watchStartDate = batchWatch('startDate');
	const watchEndDate = batchWatch('endDate');
	const watchRecipient = batchWatch('recipient');
	const watchValidDate = batchWatch('validDate');
	const watchOnlyPlace = batchWatch('onlyPlace');
	const watchHidePrice = batchWatch('hidePrice');
	const watchQuotation = batchWatch('quotation');
	const watchPreparedBy = batchWatch('preparedBy');
	const watchAddress = batchWatch('address');
	const watchEmail = batchWatch('email');
	const watchOfficeHours = batchWatch('officeHours');
	const watchOfficeNumber = batchWatch('officeNumber');
	const watchEmergencyNumber = batchWatch('emergencyNumber');
	const queryClient = useQueryClient();

	const [itemGroups, setItemGroups] = useState<ItemGroups>({
		[CART_KEY]: [], // 장바구니
	});

	const { confirm, failAlert } = useModal();

	const [estimateDetailsPayload, setEstimateDetailsPayload] = useState<GetMyEstimateOneWayPayload | undefined>();
	const [searchPayload, setSearchPayload] = useState<GetItemSearchPayload>();
	const [comment, setComment] = useState('');
	const [timeline, setTimeline] = useState<StringKeyAndVal | undefined>();

	const [searchFoldFlag, setSearchFoldFlag] = useState(true);
	const [searchResultActive, setSearchResultActive] = useState(0);
	const [isComposing, setIsComposing] = useState(false);
	const [headcount, setHeadcount] = useState<number>(0);
	const [enableHeadcount, setEnableHeadcount] = useState(true);

	const [totalPrice, setTotalPrice] = useState<number>(0);

	const [selectedItemList, setSelectedItemList] = useState<SelectedEstimateItemType[]>([]);
	const [isInitialDataLoad, setIsInitialDataLoad] = useState(false);

	const [searchItemId, setSearchItemId] = useState<number>(0);
	const [editItemId, setEditItemId] = useState<number>();
	const [isLoadingExcel, setIsLoadingExcel] = useState(false);

	const [editorState, setEditorState] = useState(EditorState.createEmpty());

	const [isLoadingCopyItem, setIsLoadingCopyItem] = useState(false);
	const throttleSearch = useRef(
		throttle((query, grade) => {
			if (isUndefined(query) || !query?.length) return;
			setSearchPayload({ keyword: query, page: 1, countPerPage: 15, grade });
		}, 300),
	).current;

	useEffect(() => {
		console.log(selectedItemList, "selected item list is here");
	}, [selectedItemList])

	/**
	 * Queries
	 */
	const { data: itemDetail } = useGetItemDetail(searchItemId ? { id: searchItemId } : undefined);
	const [itemDetailList] = itemDetail ?? [[], 0];

	const { data: aboutEstimates, isLoading, isFetching, refetch } = useGetEstimateOneWayList(estimateDetailsPayload);
	const batchInfo = aboutEstimates?.batchInfo ?? undefined;
	const estimateInfo = aboutEstimates?.estimateInfo ?? undefined;
	const estimateDetails = aboutEstimates?.estimateDetails ?? [];
	const memoOfDays = useMemo(() => Object.keys(itemGroups), [itemGroups]);
	const { data: items } = useGetItemSearch(searchPayload);
	const { mutate: postEstimateDetailBulk, isLoading: postIsLoading } = usePostEstimateDetailBulk();
	const { mutate: putBatch, isLoading: putIsLoading } = useUpdateBatch();
	const { mutate: deleteBatch, isLoading: isLoadingDelete } = useDeleteBatch();

	const [itemList, totalCount] = items ?? [[], 0];

	const { excelDownload } = useExcel();

	/**
	 * Side-Effects
	 */

	// useInterval(() => {
	// 	handleSend();
	// }, 30000);

	useEffect(() => {
		const handleScroll = (source: HTMLDivElement | null, target: HTMLDivElement | null) => {
			if (source && target) {
				const { scrollTop, scrollLeft } = source;
				target.scrollTop = scrollTop;
				target.scrollLeft = scrollLeft;
			}
		};

		const targetMain = mainRef.current;
		const targetTimeline = timelineRef.current;

		const syncScroll1 = () => handleScroll(mainRef.current, timelineRef.current);
		const syncScroll2 = () => handleScroll(timelineRef.current, mainRef.current);

		if (targetMain && targetTimeline) {
			targetMain.addEventListener('scroll', syncScroll1);
			targetTimeline.addEventListener('scroll', syncScroll2);
		}

		return () => {
			if (targetMain && targetTimeline) {
				targetMain.removeEventListener('scroll', syncScroll1);
				targetTimeline.removeEventListener('scroll', syncScroll2);
			}
		};
	}, []);

	useEffect(() => {
		if (id) {
			setEstimateDetailsPayload({ batchId: Number(id) });
		}
	}, [id]);

	useEffect(() => {
		if (batchInfo) {
			const {
				title,
				startDate,
				endDate,
				adultsCount,
				childrenCount,
				infantsCount,
				recipient,
				validDate,
				onlyPlace,
				hidePrice,
				email,
				address,
				emergencyNumber,
				officeHours,
				officeNumber,
				preparedBy,
				quotation,
			} = batchInfo;
			const values: any = {
				title,
				startDate,
				endDate,
				adultsCount,
				childrenCount,
				infantsCount,
				recipient,
				validDate,
				onlyPlace: onlyPlace ? 'onlyPlace' : 'all',
				hidePrice: hidePrice ? 'hide' : 'show',
				email,
				address,
				emergencyNumber,
				officeHours,
				officeNumber,
				preparedBy,
				quotation,
			};
			Object.keys(values).forEach((keys: any) => {
				batchSetValue(keys, values[keys]);
			});
		}
	}, [batchInfo]);

	useEffect(() => {
		if (memoOfDays.length > 1) {
			const newTimeline = memoOfDays.reduce((acc: any, day) => {
				if (day !== CART_KEY) {
					acc[day] = timeline?.[day] ?? '';
				}
				return acc;
			}, {});

			setTimeline(newTimeline);
		}
	}, [memoOfDays]);

	useEffect(() => {
		throttleSearch(watchKeyword, managerGrade);
	}, [watchKeyword]);

	// useEffect(() => {
	// 	const total = sum([watchAdultsCount, watchChildrenCount].map(Number));
	// 	setHeadcount(total);

	// 	if (enableHeadcount && !isInitialDataLoad) {
	// 		setSelectedItemList((prev) =>
	// 			prev.map((o) => ({
	// 				...o,
	// 				quantity: o.itemType === '여행지' ? total : o.quantity,
	// 				price: o.itemType === '여행지' ? String(Number(whatTheBest(o.pricePolicy, total)) * total) : o.price,
	// 			})),
	// 		);
	// 		console.log('useEffect headcount', total, selectedItemList);
	// 	}
	// }, [watchAdultsCount, watchChildrenCount, enableHeadcount, isInitialDataLoad]);

	useEffect(() => {
		if (!estimateDetails?.length) {
			return;
		}


		console.log(estimateDetails, "estimated Details aer here");
		setIsInitialDataLoad(true);
		const convertList: SelectedEstimateItemType[] = estimateDetails.map((o) => {
			const { days, item, estimateId, id: estimateDetailId, quantity, price, sequence, enableContent } = o;

			const convertPricePolicy = item.pricePolicy ? item.pricePolicy.split(TIMELINE_JOIN_KEY).map(Number) : [];
			const pricePolicy = !item.pricePolicy
				? { 1: item.price?.toString() } // { 1 : 원래Price }
				: convertPricePolicy.reduce((acc: any, cur: any, idx: number) => {
					return {
						...acc,
						[idx + 1]: Number(cur),
					};
				}, {});

			const getThumbnailImg = item?.files?.find((img) => img.type === '썸네일');

			return {
				id: estimateDetailId,
				itemId: item.id,
				estimateId,
				quantity,
				nameKor: item.nameKor,
				nameEng: item.nameEng,
				price: quantity === 1 ? '' : price?.toString(),
				sequence,
				itemSrc: getThumbnailImg?.itemSrc ?? '',
				day: days,
				pricePolicy,
				originPrice: item.price?.toString() ?? '',
				desc: item.description,
				itemType: item.type,
				enableContent,
			};
		});

		const groupByDay = groupBy(estimateDetails, 'days');

		const convertDate = mapValues(groupByDay, (value) => {
			return value.map((item) => item.sequence);
		});

		const convertGroupItem = { [CART_KEY]: [], ...convertDate };

		setItemGroups(convertGroupItem);
		console.log(convertList, "convert list is here");
		setSelectedItemList(convertList);

		if (estimateInfo?.comment) {
			const contentState = convertFromRaw(safeJsonParse(estimateInfo?.comment));
			const newEditorState = EditorState.createWithContent(contentState);
			setEditorState(newEditorState);
		}

		const splitTimeline = estimateInfo?.timeline.split(TIMELINE_JOIN_KEY);

		splitTimeline?.forEach((text, idx) => {
			setTimeline((prev) => {
				return { ...prev, [idx + 1]: text };
			});
		});

		// Reset the flag after a short delay
		setTimeout(() => {
			setIsInitialDataLoad(false);
		}, 100);
	}, [estimateDetails]);

	// Calculate total price whenever selectedItemList or itemGroups change
	useEffect(() => {
		const omitCart = omit(itemGroups, CART_KEY);
		const flat = Object.values(omitCart).flat();

		const calculatedTotalPrice = selectedItemList.reduce((acc, cur) => {
			const isIncludes = flat.includes(cur.sequence);
			const targetPrice = isIncludes ? Number(cur.price || cur.originPrice) : 0;
			return acc + targetPrice;
		}, 0);

		setTotalPrice(calculatedTotalPrice);
		console.log('Total price updated:', calculatedTotalPrice);
	}, [selectedItemList, itemGroups]);

	useEffect(() => {
		console.log(selectedItemList, "selectedItemList");
	}, [selectedItemList])

	const onClickSearchResult = (result: string, itemId: number) => {
		setValue('keyword', result);
		setSearchItemId(itemId);
		setSearchFoldFlag(false);
	};

	const batchOnSubmit: SubmitHandler<IBatchFormValues> = () => {
		if (!id) return;

		editBatchInfo();
	};

	const editBatchInfo = () => {
		if (!id) return;

		const payload = {
			id: Number(id),
			startDate: watchStartDate,
			endDate: watchEndDate,
			title: watchTitle,
			adultsCount: Number(watchAdultsCount) ?? 0,
			childrenCount: Number(watchChildrenCount) ?? 0,
			infantsCount: Number(watchInfantsCount) ?? 0,
			recipient: watchRecipient,
			validDate: watchValidDate,
			onlyPlace: watchOnlyPlace === 'onlyPlace',
			hidePrice: watchHidePrice === 'hide',
			quotation: watchQuotation,
			preparedBy: watchPreparedBy,
			address: watchAddress,
			email: watchEmail,
			officeHours: watchOfficeHours,
			officeNumber: watchOfficeNumber,
			emergencyNumber: watchEmergencyNumber,
		};

		console.log(watchOnlyPlace);

		putBatch(payload, {
			onSuccess: () => {
				refetch();
				successToast('Updated successfully.');
			},
			onError: () => {
				errorToast('Failed to update the quote.');
			},
		});
	};

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		if (!itemDetailList?.length) {
			return;
		}

		const sequence = selectedItemList.length;
		const target = itemDetailList[0];
		const thumbnail = target.files.find((item) => item.type === '썸네일');
		const estimateId = batchInfo?.estimates[0]?.id;
		if (!estimateId) return;

		const convertPricePolicy = target.pricePolicy ? target.pricePolicy.split(TIMELINE_JOIN_KEY).map(Number) : [];
		const pricePolicy = !target.pricePolicy
			? { 1: target.price?.toString() } // { 1 : 원래Price }
			: convertPricePolicy.reduce((acc: any, cur: any, idx: number) => {
				return {
					...acc,
					[idx + 1]: Number(cur),
				};
			}, {});

		const originPrice = target.pricePolicy ? String(whatTheBest(pricePolicy, headcount)) : target.price?.toString();

		const addSequence: SelectedEstimateItemType = {
			id: target.id,
			itemId: target.id,
			estimateId,
			nameEng: target.nameEng,
			nameKor: target.nameKor,
			quantity: 1,
			pricePolicy,
			price: '',
			originPrice: originPrice ?? '',
			sequence: sequence + 1,
			day: Number(CART_KEY),
			itemSrc: thumbnail?.itemSrc ?? '',
			desc: target.description,
			itemType: target.type,
			enableContent: false,
		};

		setSelectedItemList((prev) => [...prev, addSequence]);
		setItemGroups((prev) => ({ ...prev, [CART_KEY]: [...prev[CART_KEY], addSequence.sequence] }));
		setValue('keyword', '');
		setSearchItemId(99999999);
		setSearchPayload({ page: 1, countPerPage: 7, keyword: 'reset', grade: '' });
		successToast('Added the product.');
	};

	const handleCopyItem = (targetSeq: number) => {
		setIsLoadingCopyItem(true);
		// const sequence = selectedItemList.length;
		const sequence = maxBy(selectedItemList, 'sequence')?.sequence ?? 0;

		const addSequence = selectedItemList.filter((o) => o.sequence === targetSeq)?.[0];

		if (addSequence && sequence) {
			const convertAddSequence = {
				...addSequence,
				id: sequence + 1,
				sequence: sequence + 1,
				day: Number(CART_KEY),
			};

			setSelectedItemList((prev) => [...prev, convertAddSequence]);
			setItemGroups((prev) => ({ ...prev, [CART_KEY]: [...prev[CART_KEY], convertAddSequence.sequence] }));
			successToast('The travel package has been successfully copied.');
		}
		setIsLoadingCopyItem(false);
	};

	const handleAddDay = () => {
		// 현재 상태에서 숫자 키만 추출
		const numberKeys = Object.keys(itemGroups)
			.filter((key) => !isNaN(Number(key)))
			.map(Number);

		if (numberKeys.length) {
			// 가장 큰 숫자 찾기
			const maxNumber = Math.max(...numberKeys);

			// 새로운 숫자 키 추가
			const newState = { ...itemGroups, [maxNumber + 1]: [] };

			setItemGroups(newState);
			successToast('Added successfully.');
		}
	};

	const handleRemoveDay = (key: string) => {
		setItemGroups((prev) => {
			const remainingState = omit(prev, key);
			const deletedItems = prev[key];
			const updateCartItems = [...prev[CART_KEY], ...deletedItems];

			const updateGroup = mapKeys(remainingState, (value, k) => {
				return Number(k) > Number(key) ? Number(k) - 1 : Number(k);
			});

			return {
				...updateGroup,
				[CART_KEY]: updateCartItems,
			};
		});
		successToast('Deleted successfully.');
	};

	const handleSend = () => {
		const omitCart = omit(itemGroups, CART_KEY);

		const isEmptyList = some(omitCart, (value) => isEmpty(value));

		if (isEmptyList) {
			errorToast('There are empty values.');
			return;
		}

		const estimateId = batchInfo?.estimates[0]?.id;

		if (!estimateId) return;

		editBatchInfo();

		const transformInputData = Object.keys(itemGroups).reduce((acc: PostMyEstimateDetailItem[], day: string) => {
			const result = itemGroups[day].map((seq: number, index: number) => {
				const item = selectedItemList.find((o) => o.sequence === seq);
				return {
					estimateId,
					itemId: item?.itemId ?? 0,
					price: Number(item?.price) || Number(whatTheBest(item?.pricePolicy, item?.quantity || 1)) || null,
					days: Number(day),
					sequence: acc.length + 1 + index,
					quantity: item?.quantity,
					enableContent: !!item?.enableContent,
				};
			});
			return [...acc, ...result];
		}, []);

		const convertTimeline = Object.values(timeline ?? {}).join(TIMELINE_JOIN_KEY);

		const convertEditerComment = convertToRaw(editorState.getCurrentContent());

		const payload: PostMyEstimateDetailPayload = {
			items: transformInputData,
			timeline: convertTimeline,
			comment: JSON.stringify(convertEditerComment),
			estimateId,
			batchId: Number(id),
		};

		postEstimateDetailBulk(payload, {
			onSuccess: () => {
				refetch();

				successToast('Saved successfully.');
			},
			onError: () => {
				errorToast('Failed to save.');
			},
		});
	};

	const onKeyDown = async (ev: React.KeyboardEvent) => {
		if (isComposing) return;
		if (ev.code === 'ArrowDown' && searchResultActive < itemList?.length) {
			setSearchResultActive((prev: number) => prev + 1);
		}
		if (ev.code === 'ArrowUp' && searchResultActive > 0) {
			setSearchResultActive((prev: number) => prev - 1);
		}
		if (ev.code === 'Enter' && itemList.length && itemList[searchResultActive - 1]) {
			ev.preventDefault();

			const { nameEng, id: itemId } = itemList[searchResultActive - 1];
			onClickSearchResult(nameEng, itemId);
		}
	};

	const removeBatch = () => {
		confirm({
			message: 'Do you want to delete the batch?',
			okHandler: () => {
				deleteBatch(id?.toString() ?? 0, {
					onSuccess: () => {
						successToast('The batch has been deleted.');
						navigate(-1);
					},
					onError: () => {
						failAlert('Failed to delete the batch.');
					},
				});
			},
		});
	};

	const handleDetailExcelDownload = async () => {
		try {
			setIsLoadingExcel(true);
			const res = await getEstimateOneWayList({ batchId: Number(id) });
			const { estimateDetails: esti } = res ?? undefined;
			console.log('estimateDetailsestimateDetails', esti);

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

			const excelData = esti.map((o) => {
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

	const convertText = (v?: string) => {
		const res = v ? v.replaceAll('#', ' > ').replaceAll(watchKeyword, `<b>${watchKeyword}</b>`) : '';
		const splittedDesc = res?.split(/<b>|<\/b>/) || [];

		return splittedDesc;
	};

	const TYPE_ENG_KEY = {
		여행지: 'Place',
		컨텐츠: 'Contents',
		숙박: 'Accommodation',
		이동수단: 'Transportation',
	};

	const transTypeEng = (type: ItemType): string => {
		return TYPE_ENG_KEY[type];
	};

	return (
		<>
			<S.Container>
				<Title title="My Quotation Management" desc="">
					<ButtonView>
						<Button type="button" status="third_outlined" text="Excel Download" onClick={handleDetailExcelDownload} />
						<Button type="button" status="primary" text="Save" onClick={handleSend} />
						<Button
							type="button"
							status="primary_outlined"
							text="Link"
							onClick={() => {
								createLinkAndCopy(Number(id ?? 0));
							}}
						/>
						<Button type="button" status="danger" text="Delete" onClick={removeBatch} />
					</ButtonView>
				</Title>

				<Blank size={48} />

				<Title title="Basic Settings" />

				<Blank size={24} />

				<Free.SearchTable onSubmit={batchHandleSubmit(batchOnSubmit)}>
					<Free.Row>
						<Free.Value $width={100 / 2}>
							<TextField label="Title" name="title" placeholder="Please enter the title" register={batchRegister} />
						</Free.Value>
					</Free.Row>
					<Free.Row>
						<Free.Value $width={100 / 6}>
							<TextField
								type="date"
								label="Travel Start Date"
								name="startDate"
								placeholder="Please Enter the travel start date."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 6}>
							<TextField
								type="date"
								label="Travel End Date"
								name="endDate"
								placeholder="Please Enter the travel end date."
								register={batchRegister}
							/>
						</Free.Value>
					</Free.Row>
					<Free.Row>
						<Free.Value $width={100 / 6}>
							<TextField
								type="date"
								label="Expiration Date"
								name="validDate"
								placeholder="Please Enter the expiration date."
								register={batchRegister}
							/>
						</Free.Value>
					</Free.Row>
					<Free.Row>
						<Free.Value $width={100 / 8}>
							<TextField
								label="Adults"
								name="adultsCount"
								placeholder="Please Enter the number of adults."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 8}>
							<TextField
								label="Children"
								name="childrenCount"
								placeholder="Please Enter the number of children."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 8}>
							<TextField
								label="FOC"
								name="infantsCount"
								placeholder="Please Enter the number of FOC."
								register={batchRegister}
							/>
						</Free.Value>
					</Free.Row>

					<Free.Row>
						<Free.Value $width={100 / 4}>
							<TextField
								label="Customer"
								name="recipient"
								placeholder="Please enter the customer."
								register={batchRegister}
							/>
						</Free.Value>
					</Free.Row>
					<Free.Row>
						<Free.Value $width={33}>
							<RadioWrapper label="Only Place">
								<Radio
									name="onlyPlace"
									label="Only Place"
									register={batchRegister}
									value="onlyPlace"
									checked={watchOnlyPlace === 'onlyPlace'}
								/>
								<Radio
									name="onlyPlace"
									label="Show All"
									register={batchRegister}
									value="all"
									checked={watchOnlyPlace === 'all'}
								/>
							</RadioWrapper>
						</Free.Value>
						<Free.Value $width={33}>
							<RadioWrapper label="Hide Price">
								<Radio
									name="hidePrice"
									label="Hide"
									register={batchRegister}
									value="hide"
									checked={watchHidePrice === 'hide'}
								/>
								<Radio
									name="hidePrice"
									label="Show"
									register={batchRegister}
									value="show"
									checked={watchHidePrice === 'show'}
								/>
							</RadioWrapper>
						</Free.Value>
					</Free.Row>

					<Free.Row>
						<Free.Value $width={100 / 4}>
							<TextField
								label="Quotation"
								name="quotation"
								placeholder="Please enter the quotation."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 4}>
							<TextField
								label="PreparedBy"
								name="preparedBy"
								placeholder="Please enter the preparedBy."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 4}>
							<TextField
								label="Address"
								name="address"
								placeholder="Please enter the address."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 4}>
							<TextField label="Email" name="email" placeholder="Please enter the email." register={batchRegister} />
						</Free.Value>
					</Free.Row>

					<Free.Row>
						<Free.Value $width={100 / 4}>
							<TextField
								label="OfficeHours"
								name="officeHours"
								placeholder="Please enter the officeHours."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 4}>
							<TextField
								label="OfficeNumber"
								name="officeNumber"
								placeholder="Please enter the officeNumber."
								register={batchRegister}
							/>
						</Free.Value>
						<Free.Value $width={100 / 4}>
							<TextField
								label="EmergencyNumber"
								name="emergencyNumber"
								placeholder="Please enter the emergencyNumber."
								register={batchRegister}
							/>
						</Free.Value>
					</Free.Row>
				</Free.SearchTable>

				<Blank size={24} />

				<Title title="Product Search" />

				<Blank size={24} />

				<Free.SearchTable $isOverflowVisible onSubmit={handleSubmit(onSubmit)}>
					<Free.Row>
						<Free.Value $width={50} style={{ position: 'relative' }}>
							<TextField
								label="Search Travel Products"
								name="keyword"
								placeholder="Please enter the travel product name."
								autoComplete="off"
								register={register}
								errors={errors}
								error={!!errors.keyword}
								options={{ required: VALIDATION_MESSAGE.keyword.required }}
								onFocus={() => {
									setSearchFoldFlag(true);
								}}
								onKeyDown={onKeyDown}
								onCompositionStart={() => setIsComposing(true)}
								onCompositionEnd={() => setIsComposing(false)}
							/>
							{watchKeyword && searchFoldFlag && !isEmpty(itemList) && (
								<S.RecommendButtonBox>
									{itemList.map(({ id: itemId, nameEng, type, personalTag, price }, index) => {
										return (
											<S.SearchResultButton
												type="button"
												key={itemId}
												onClick={() => onClickSearchResult(nameEng, itemId)}
												$active={searchResultActive === index + 1}
												onMouseOver={() => setSearchResultActive(index + 1)}
											>
												<li>
													[{transTypeEng(type)}]{` `}
													{convertText(nameEng).map((text, idx) => {
														// eslint-disable-next-line react/no-array-index-key
														if (!(idx === 0) && idx % 2 === 1) return <b key={idx}>{text}</b>;
														return text;
													})}{' '}
													{personalTag ? `(${personalTag})` : ''} {price ? `(${price})` : ''}
												</li>
											</S.SearchResultButton>
										);
									})}
								</S.RecommendButtonBox>
							)}
						</Free.Value>
					</Free.Row>

					<ButtonBox>
						<div style={{ justifyContent: 'flex-start', width: '100%', display: 'flex' }}>
							<Button type="submit" status="primary" text="Add Travel Product" />
						</div>
					</ButtonBox>
				</Free.SearchTable>

				<Blank size={24} />

				<ButtonBox>
					<Button type="button" status="primary_outlined" text="Add Day" onClick={handleAddDay} />
				</ButtonBox>

				<S.totalPrice>
					{`Total Price : ${comma(totalPrice)} (${
						headcount ? comma(Math.round(totalPrice / headcount)) : ''
					} / Person)\nTotal Pax : ${headcount}`}
				</S.totalPrice>

				<DragDropZone
					itemGroups={itemGroups}
					setItemGroups={setItemGroups}
					setSelectedItemList={setSelectedItemList}
					selectedItemList={selectedItemList}
					handleRemoveDay={handleRemoveDay}
					handleCopyItem={handleCopyItem}
					mainRef={mainRef}
					handleSend={handleSend}
					isLoadingCopyItem={isLoadingCopyItem}
					startDate={watchStartDate}
				/>

				<S.MemoSection>
					<section>
						<figure />
						<article ref={timelineRef}>
							{memoOfDays.map((item) => {
								if (item === CART_KEY) return null;
								return (
									<div key={item}>
										<TextArea
											name="timeline"
											label={`Day ${item} Timeline`}
											placeholder="Please enter the timeline"
											height={100}
											value={timeline?.[item] ?? ''}
											onChange={(e) => {
												setTimeline((prev) => ({
													...prev,
													[item]: e.target.value,
												}));
											}}
										/>
									</div>
								);
							})}
						</article>
					</section>

					<Blank size={40} />

					<TextEditer editorState={editorState} setEditorState={setEditorState} />
				</S.MemoSection>

				<Loader isFetching={isLoading || postIsLoading} />
			</S.Container>

			{searchFoldFlag && !isEmpty(itemList) && <S.Overlay onClick={() => setSearchFoldFlag(false)} />}
		</>
	);
};

export default MyEstimateDetail;