import React, { FC, useState, useEffect, FormEvent, useRef, useMemo } from 'react';
import { Radio, TextArea, TextField } from '@components/Input';
import RadioWrapper from '@components/Input/Radio/RadioWrapper';
import Title from '@components/Title';
import Free from '@styles/FreeTable';
import * as S from './styled';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@components/Button';
import ButtonBox from '@components/ButtonBox';
import { VALIDATION_MESSAGE } from '@shared/constants';
import Blank from '@components/Blank';
import {
	find,
	flatMap,
	groupBy,
	isEmpty,
	isNaN,
	isUndefined,
	mapKeys,
	mapValues,
	omit,
	some,
	sumBy,
	throttle,
} from 'lodash-es';
import { GetItemSearchPayload, ItemType } from '@typings/payload';
import { useGetItemSearch } from '@shared/hooks/queries/item';
import { StringKeyAndVal } from '@typings/base';
import { useGetPackageDetailList, usePostPackageDetailFORM } from '@shared/hooks/queries/package-detail';
import Loader from '@components/Loader';
import { useParams } from 'react-router-dom';
import { ItemGroups, SelectedItemType } from './types';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { CART_KEY, TIMELINE_JOIN_KEY, comma, getItemImg, getPackageImg } from '@shared/utils/base';
import { getYmd } from '@shared/utils/dayUtils';
import { DragDropZone } from './components';

interface IFormValues {
	keyword: string;
	type: ItemType;
}

const SEARCH_TYPES = ['여행지', '이동수단', '컨텐츠', '숙박'];

const CreatePackage: FC = () => {
	/**
	 * States
	 */

	const { id } = useParams();

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

	const watchType = watch('type');
	const watchKeyword = watch('keyword');

	const [itemGroups, setItemGroups] = useState<ItemGroups>({
		[CART_KEY]: [], // 장바구니
	});
	const [inputValue, setInputValue] = useState<StringKeyAndVal>({});
	const [detailListPayload, setDetailListPayload] = useState<{ packageId: number } | undefined>();
	const [searchPayload, setSearchPayload] = useState<GetItemSearchPayload>();
	const [memo, setMemo] = useState('');

	const [isFoldDesc, setIsFoldDesc] = useState(true);
	const [searchFoldFlag, setSearchFoldFlag] = useState(true);
	const [searchResultActive, setSearchResultActive] = useState(0);
	const [isComposing, setIsComposing] = useState(false);

	const [selectedItemList, setSelectedItemList] = useState<SelectedItemType[]>([]);
	const [timeline, setTimeline] = useState<StringKeyAndVal | undefined>();

	const throttleSearch = useRef(
		throttle((query, type) => {
			if (isUndefined(query) || !query) return;
			setSearchPayload({ keyword: query, page: 1, countPerPage: 7, type, grade: '' });
		}, 300),
	).current;

	/**
	 * Queries
	 */

	const { data: detailList, refetch } = useGetPackageDetailList(detailListPayload);
	const { data: items } = useGetItemSearch(searchPayload);
	const { mutate: postPackageDetail, isLoading } = usePostPackageDetailFORM();

	const memoOfDays = useMemo(() => Object.keys(itemGroups), [itemGroups]);

	const [itemList, totalCount] = items ?? [[], 0];

	/**
	 * Side-Effects
	 */
	useEffect(() => {
		if (id) {
			setDetailListPayload({ packageId: Number(id) });
		}
	}, [id]);

	useEffect(() => {
		throttleSearch(watchKeyword, watchType);
	}, [watchKeyword, watchType]);

	useEffect(() => {
		if (!detailList?.length || !detailList[0]?.packageDetails.length) {
			return;
		}

		const details = detailList[0].packageDetails;

		const convertList: SelectedItemType[] = details.map((o) => {
			const { days, item, price, sequence } = o;
			const getThumbnailImg = item?.files?.find((img) => img.type === '썸네일');

			return {
				id: item.id,
				nameKor: item.nameKor,
				nameEng: item.nameEng,
				price: price?.toString() === item?.price.toString() ? '' : price?.toString(),
				sequence,
				itemSrc: getThumbnailImg?.itemSrc ?? '',
				day: days,
				originPrice: item.price?.toString() ?? '',
				desc: item.description,
			};
		});

		const groupByDay = groupBy(details, 'days');

		const convertDate = mapValues(groupByDay, (value) => {
			return value.map((item) => item.sequence);
		});

		const sum = { [CART_KEY]: [], ...convertDate };

		setMemo(detailList[0].description);
		setItemGroups(sum);
		setSelectedItemList(convertList);

		const splitTimeline = detailList[0]?.timeline?.split(TIMELINE_JOIN_KEY);

		splitTimeline?.forEach((text, idx) => {
			setTimeline((prev) => {
				return { ...prev, [idx + 1]: text };
			});
		});
	}, [detailList]);

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

	/**
	 * Handlers
	 */

	const onClickSearchResult = (result: string) => {
		setValue('keyword', result);
		setSearchFoldFlag(false);
	};

	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		if (!itemList?.length) {
			return;
		}

		const sequence = selectedItemList.length;
		const target = itemList[0];
		const thumbnail = target.files.find((item) => item.type === '썸네일');

		const addSequence: SelectedItemType = {
			id: target.id,
			nameEng: target.nameEng,
			nameKor: target.nameKor,
			price: '',
			originPrice: target.price?.toString() ?? '',
			sequence: sequence + 1,
			day: Number(CART_KEY),
			itemSrc: thumbnail?.itemSrc ?? '',
			desc: target.description,
		};

		setSelectedItemList((prev) => [...prev, addSequence]);
		setItemGroups((prev) => ({ ...prev, [CART_KEY]: [...prev[CART_KEY], addSequence.sequence] }));
		setValue('keyword', '');
		setSearchPayload({ page: 1, countPerPage: 7, keyword: 'reset', type: watchType, grade: '' });
		successToast('상품이 추가되었습니다.');
	};

	const handleCopyItem = (targetSeq: number) => {
		const sequence = selectedItemList.length;
		const addSequence = selectedItemList.find((o) => o.sequence === targetSeq);

		if (addSequence) {
			const convertAddSequence = {
				...addSequence,
				price: '',
				sequence: sequence + 1,
				day: Number(CART_KEY),
			};

			setSelectedItemList((prev) => [...prev, convertAddSequence]);
			setItemGroups((prev) => ({ ...prev, [CART_KEY]: [...prev[CART_KEY], convertAddSequence.sequence] }));
			successToast('여행상품이 성공적으로 복사되었습니다.');
		}
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

			// 상태 업데이트
			setItemGroups(newState);
			successToast('추가되었습니다.');
		}
	};

	const handleRemoveDay = (key: string) => {
		setItemGroups((prev) => {
			const remainingState = omit(prev, key);
			const deletedItmes = prev[key];
			const updateCartItems = [...prev[CART_KEY], ...deletedItmes];

			const updateGroup = mapKeys(remainingState, (value, k) => {
				return Number(k) > Number(key) ? Number(k) - 1 : Number(k);
			});

			return {
				...updateGroup,
				[CART_KEY]: updateCartItems,
			};
		});
		successToast('Delete되었습니다.');
	};

	const handleSend = () => {
		const omitCart = omit(itemGroups, CART_KEY);

		const isEmptyList = some(omitCart, (value) => isEmpty(value));

		if (isEmptyList) {
			errorToast('There are empty values.');
			return;
		}

		const values = Object.values(omitCart).flat();

		const transformInputData = flatMap(omitCart, (sequences, day) =>
			sequences.map((sequence) => {
				const item = find(selectedItemList, { sequence });
				const findSequence = values.findIndex((o2) => o2 === Number(sequence));

				return {
					packageId: Number(id),
					itemId: item?.id ?? 0,
					price: Number(item?.price) || Number(item?.originPrice) || null,
					days: Number(day),
					sequence: findSequence + 1,
				};
			}),
		);

		const timelineValues = Object.values(timeline ?? {}).join(TIMELINE_JOIN_KEY);

		const payload = {
			items: transformInputData,
			description: memo,
			timeline: timelineValues,
		};

		postPackageDetail(payload, {
			onSuccess: () => {
				refetch();
				successToast('저장되었습니다.');
			},
			onError: () => {
				errorToast('저장에 실패하였습니다.');
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

			const { nameEng } = itemList[searchResultActive - 1];
			onClickSearchResult(nameEng);
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

	const detail = detailList?.[0] ?? null;

	return (
		<>
			<S.Container>
				<Title title="패키지 정보">
					<Button
						type="submit"
						status="third"
						text={isFoldDesc ? 'Collapse' : '펼치기'}
						onClick={() => {
							setIsFoldDesc((prev) => !prev);
						}}
					/>
				</Title>

				<Blank size={24} />

				{isFoldDesc && detail ? (
					<S.Summary>
						<section>
							<div>
								<h5>제목</h5>
								<p>
									{detail.title} ({detail.titleEng})
								</p>
							</div>
							<div>
								<h5>판매일정</h5>
								<p>{`${getYmd(detail.salesStart, 'YYYY.MM.DD')} ~ ${getYmd(detail.salesEnd, 'YYYY.MM.DD')}`}</p>
							</div>
							{/* <div>판매여부 : {detail.enable ? 'O' : 'X'}</div>
							<div>승인여부 : {detail.valid ? 'O' : 'X'}</div> */}
							<div>
								<h5>여행상품 합산금액</h5>
								<p>{comma(detail.autoSumAmount)}원</p>
							</div>
							<div>
								<h5>판매확정Price</h5>
								<p>{comma(detail.totalPrice)}원</p>
							</div>
						</section>
						<article>
							<S.Thumbnail $thumbnail={getPackageImg(detail.thumbnail)} />
						</article>
					</S.Summary>
				) : null}

				<Blank size={24} />

				<Title title="패키지 생성" />

				<Blank size={24} />

				<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
					<Free.Row>
						<Free.Value $width={50} style={{ position: 'relative' }}>
							<TextField
								label="여행상품 검색"
								name="keyword"
								placeholder="여행상품명을 입력해주세요."
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
							{searchFoldFlag && !isEmpty(itemList) && (
								<S.RecommendButtonBox>
									{itemList.map(({ id: itemId, nameEng }, index) => {
										return (
											<S.SearchResultButton
												type="button"
												key={itemId}
												onClick={() => onClickSearchResult(nameEng)}
												$active={searchResultActive === index + 1}
												onMouseOver={() => setSearchResultActive(index + 1)}
											>
												<li>
													{convertText(nameEng).map((text, idx) => {
														// eslint-disable-next-line react/no-array-index-key
														if (!(idx === 0) && idx % 2 === 1) return <b key={idx}>{text}</b>;
														return text;
													})}
												</li>
											</S.SearchResultButton>
										);
									})}
								</S.RecommendButtonBox>
							)}
						</Free.Value>

						<Free.Value $width={50}>
							<RadioWrapper label="여행상품 분류">
								{SEARCH_TYPES.map((item) => {
									return (
										<Radio
											name="type"
											key={item}
											label={item}
											register={register}
											value={item}
											checked={watchType === item}
										/>
									);
								})}
							</RadioWrapper>
						</Free.Value>
					</Free.Row>

					<ButtonBox>
						<Button type="submit" status="primary" text="여행상품 추가" />
					</ButtonBox>
				</Free.SearchTable>

				<Blank size={24} />

				<ButtonBox>
					<Button type="button" status="primary_outlined" text="일 추가" onClick={handleAddDay} />
				</ButtonBox>

				<S.totalPrice>
					현재 Price : {comma(sumBy(selectedItemList.map((item) => Number(item.price || item.originPrice))))}원
				</S.totalPrice>

				<DragDropZone
					itemGroups={itemGroups}
					setItemGroups={setItemGroups}
					setSelectedItemList={setSelectedItemList}
					selectedItemList={selectedItemList}
					handleRemoveDay={handleRemoveDay}
					handleCopyItem={handleCopyItem}
				/>

				<Blank size={24} />

				<S.MemoSection>
					<Free.Row>
						{memoOfDays.map((item) => {
							if (item === CART_KEY) return null;
							return (
								<Free.Value key={item}>
									<TextArea
										name="timeline"
										label={`${item}일차 타임라인`}
										placeholder={`${item}일차 타임라인을 작성해주세요.`}
										height={100}
										value={timeline?.[item] ?? ''}
										onChange={(e) => {
											setTimeline((prev) => ({
												...prev,
												[item]: e.target.value,
											}));
										}}
									/>
								</Free.Value>
							);
						})}
					</Free.Row>
					<Free.Row $isNonBorderBottom>
						<Free.Value>
							<TextArea
								name="memo"
								label="메모"
								placeholder="메모를 작성해주세요."
								height={100}
								value={memo}
								onChange={(e) => {
									setMemo(e.target.value);
								}}
							/>
						</Free.Value>
					</Free.Row>

					<ButtonBox>
						<Button type="button" status="primary" text="저장" onClick={handleSend} />
					</ButtonBox>
				</S.MemoSection>
			</S.Container>

			<Loader isFetching={isLoading} />

			{searchFoldFlag && !isEmpty(itemList) && <S.Overlay onClick={() => setSearchFoldFlag(false)} />}
		</>
	);
};

export default CreatePackage;
