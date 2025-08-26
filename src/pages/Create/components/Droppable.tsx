/* eslint-disable import/no-cycle */
import React, { FC } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import Item from './Item';
import * as S from './styled';
import { IconX } from '@tabler/icons-react';
import { CART_KEY } from '@shared/utils/base';

const Droppable: FC<any> = ({ id, items, itemGroups, setItemGroups, handleRemoveDay }) => {
	const { setNodeRef } = useDroppable({ id });

	const handleDelete = () => {
		handleRemoveDay(id);
	};

	const isCart = id === CART_KEY;
	const convertTitle = isCart ? '여행상품' : `${id}일차`;

	return (
		<SortableContext id={id} items={items} strategy={rectSortingStrategy}>
			<S.DropSection ref={setNodeRef} $isCart={isCart}>
				<S.BoxTitle>
					<h1>{convertTitle}</h1>
					{!isCart && Object.keys(itemGroups).length !== 2 ? (
						<button type="button" onClick={handleDelete}>
							<IconX size={20} />
						</button>
					) : null}
				</S.BoxTitle>

				<S.ItemBox $isCart={isCart}>
					{items.map((item: any) => (
						<Item key={item} group={id} id={item} setItemGroups={setItemGroups} />
					))}
				</S.ItemBox>
			</S.DropSection>
		</SortableContext>
	);
};

export default Droppable;
