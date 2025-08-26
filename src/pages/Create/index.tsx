/* eslint-disable import/no-cycle */
import React, { FC, useState, useEffect, FormEvent } from 'react';
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
import { flatMap, groupBy, isNaN, keys, mapKeys, mapValues, omit, range, sortBy } from 'lodash-es';
import DragDropZone from './components/DragDropZone';
import { CART_KEY } from '@shared/utils/base';

interface IFormValues {
	keyword: string;
	type: string;
}

const SEARCH_TYPES = ['여행지', '이동수단', '컨텐츠', '숙박'];

export interface ItemGroups {
	[key: string]: number[];
}

export const ITEMS = [
	{ id: 1, name: '경복궁' },
	{ id: 2, name: '버스' },
	{ id: 3, name: '지하철' },
	{ id: 4, name: '명동' },
	{ id: 5, name: '비행기' },
	{ id: 5, name: '비행기' },
];

export const searchData = [
	{
		day: '1',
		id: 2,
		name: '버스',
		sequence: 1,
	},
	{
		day: '1',
		id: 3,
		name: '지하철',
		sequence: 2,
	},
	{
		day: '2',
		id: 5,
		name: '비행기',
		sequence: 3,
	},
	{
		day: '2',
		id: 4,
		name: '명동',
		sequence: 4,
	},
	{
		day: '3',
		id: 5,
		name: '비행기',
		sequence: 5,
	},
];

const Create: FC = () => {
	/**
	 * States
	 */
	const [itemGroups, setItemGroups] = useState<ItemGroups>({
		[CART_KEY]: [], // 장바구니
	});

	const [memo, setMemo] = useState('');

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

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	useEffect(() => {
		if (!ITEMS.length) {
			return;
		}

		// const groupByDay = groupBy(searchData, 'day');
		// console.log(groupByDay);

		// const convertDate = mapValues(groupByDay, (value) => {
		// 	return value.map((item) => item.sequence);
		// });

		// console.log(convertDate);

		// const sum = { ...itemGroups, ...convertDate };
		// setItemGroups(sum);

		// console.log(searchData);
		const result = searchData.reduce((acc: any, cur: any) => {
			return {
				...acc,
				[cur.day]: !acc[cur.day] ? [cur.sequence] : [...acc[cur.day], cur.sequence],
			};
		}, {});

		const sum = { ...itemGroups, ...result };

		setItemGroups(sum);

		// console.log(result);
	}, [ITEMS]);

	/**
	 * Handlers
	 */
	const onSubmit: SubmitHandler<IFormValues> = (data) => {
		console.log(data);
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
		}
	};

	const handleRemoveDay = (key: string) => {
		setItemGroups((prev) => {
			const remainingState = omit(prev, key);
			const deletedItmes = prev[key];
			const updateCartItems = [...prev[CART_KEY], ...deletedItmes];

			const updateGroup = mapKeys(remainingState, (value, k) => {
				console.log('valuevaluevalue', value);
				console.log('kkkk', k);

				return Number(k) > Number(key) ? Number(k) - 1 : Number(k);
			});

			return {
				...updateGroup,
				[CART_KEY]: updateCartItems,
			};
		});
	};

	const handleSend = () => {
		// const omitCart = omit(itemGroups, CART_KEY);

		// const values = Object.values(omitCart).flat();

		// console.log(Object.entries(omitCart));

		// const payload = flatMap(Object.entries(omitCart), ([key, value]) => {
		// 	return value.map((item) => {
		// 		const target = searchData.find((o1) => o1.sequence === item);
		// 		const findSequence = values.indexOf(item);
		// 		return { ...target, day: key, sequence: findSequence + 1 };
		// 	});
		// });

		const keyValue = searchData.reduce((acc: any, cur: any) => {
			return {
				...acc,
				[cur.sequence]: cur,
			};
		}, {});

		const days = Object.keys(itemGroups);

		const result = days.reduce((acc: any, day: string) => {
			if (day === '0') return acc;

			const lastSeq = acc.length;
			const itemList = itemGroups[day].map((seq: number, index: number) => ({
				...keyValue[`${seq}`],
				day,
				sequence: lastSeq + 1 + index,
			}));

			return [...acc, ...itemList];
		}, []);

		console.log(result);
	};

	/**
	 * Helpers
	 */

	return (
		<S.Container>
			<Title title="견적 생성" />

			<Blank size={24} />

			<Free.SearchTable onSubmit={handleSubmit(onSubmit)}>
				<Free.Row>
					<Free.Value $width={50}>
						<TextField
							label="상품 검색"
							name="keyword"
							placeholder="상품명을 입력해주세요."
							register={register}
							errors={errors}
							error={!!errors.keyword}
							options={{ required: VALIDATION_MESSAGE.keyword.required }}
						/>
					</Free.Value>
					<Free.Value $width={50}>
						<RadioWrapper label="Exposed">
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

			<DragDropZone itemGroups={itemGroups} setItemGroups={setItemGroups} handleRemoveDay={handleRemoveDay} />

			<Blank size={24} />

			<S.MemoSection>
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
					<Button type="button" status="primary" text="전송하기" onClick={handleSend} />
				</ButtonBox>
			</S.MemoSection>
		</S.Container>
	);
};

export default Create;
