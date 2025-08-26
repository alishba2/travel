/* eslint-disable import/no-cycle */
import React, { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import Item from './Item';
import * as S from './styled';
import { IconCopy, IconX } from '@tabler/icons-react';
import { CART_KEY } from '@shared/utils/base';
import { SelectedEstimateItemType } from '../types';
import { ItemSchema } from '@typings/schema';
import { isNaN, maxBy } from 'lodash-es';
import dayjs from 'dayjs';

const Droppable: FC<any> = ({
	id,
	items,
	itemGroups,
	setItemGroups,
	handleRemoveDay,
	selectedItemList,
	handleCopyItem,
	setSelectedItemList,
	handleSend,
	isLoadingCopyItem,
	startDate,
}) => {
	const { setNodeRef } = useDroppable({ id });

	const handleDelete = () => {
		handleRemoveDay(id);
	};

	const handleCopyTable = () => {
		const currentTable = itemGroups[id];

		const maxBySequence: any = maxBy(selectedItemList, 'sequence');

		const copyTable = currentTable.map((itemId: number, idx: number) => {
			const itemInfo = selectedItemList.find((item: ItemSchema) => {
				return item.sequence === itemId;
			});

			return { ...itemInfo, sequence: maxBySequence.sequence + idx + 1 };
		});

		const numberKeys = Object.keys(itemGroups)
			.filter((key) => !isNaN(Number(key)))
			.map(Number);

		// 가장 큰 숫자 찾기
		const maxNumber = Math.max(...numberKeys);

		// 새로운 숫자 키 추가
		const newState = { ...itemGroups, [maxNumber + 1]: copyTable.map((item: any) => item.sequence) };

		// 상태 업데이트
		setItemGroups(newState);
		setSelectedItemList((prev: any) => [...prev, ...copyTable]);
	};

	const getDay = (day?: number) => {
		if (!startDate || !day) {
			return null;
		}
		const newDate = dayjs(startDate).add(Number(day) - 1, 'day');

		const formattedDate = `${newDate.format('ddd')}, ${newDate.format('DD')}`;

		return formattedDate;
	};

	const isCart = id === CART_KEY;
	const convertTitle = isCart ? 'Travel Products' : `Day ${id} - ${getDay(id)}`;

	return (
		<SortableContext id={id} items={items} strategy={rectSortingStrategy}>
			<S.DropSection ref={setNodeRef} $isCart={isCart}>
				<S.BoxTitle>
					<h1>
						{convertTitle}
						{!isCart && items?.length ? (
							<S.CopyTableButton onClick={handleCopyTable} type="button">
								<IconCopy size={18} />
							</S.CopyTableButton>
						) : null}
					</h1>
					{!isCart && Object.keys(itemGroups).length !== 2 ? (
						<button type="button" onClick={handleDelete}>
							<IconX size={20} />
						</button>
					) : null}
				</S.BoxTitle>

				<S.ItemBox $isCart={isCart}>
					{items.map((item: any, idx: number) => {
						const data = selectedItemList.find((o: SelectedEstimateItemType) => o.sequence === item);
						return (
							<Item
								key={idx}
								group={id}
								id={item}
								data={data}
								setItemGroups={setItemGroups}
								selectedItemList={selectedItemList}
								handleCopyItem={handleCopyItem}
								setSelectedItemList={setSelectedItemList}
								handleSend={handleSend}
								isLoadingCopyItem={isLoadingCopyItem}
							/>
						);
					})}
				</S.ItemBox>
			</S.DropSection>
		</SortableContext>
	);
};

export default Droppable;
