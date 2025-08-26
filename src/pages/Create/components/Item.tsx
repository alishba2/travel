import React, { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as S from './styled';
import { IconX } from '@tabler/icons-react';
import { ITEMS, searchData } from '..';

const Item: FC<any> = ({ id, dragOverlay, setItemGroups, group = null }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: 'pointer',
	};

	const convertName = (itemId: number) => {
		const addCustomIndex = searchData.map((item, idx) => {
			return { ...item, dragId: idx + 1 };
		});

		const result = addCustomIndex.find((o: any) => itemId === o.dragId);
		return result?.name;
	};

	const deleteItem = () => {
		setItemGroups((prev: any) => {
			return {
				...prev,
				[group]: prev[group].filter((o: any) => o !== id),
			};
		});
	};

	return (
		<S.Item style={style} ref={setNodeRef} {...attributes} {...listeners}>
			<p>{convertName(id)}</p>
			<button onClick={deleteItem} type="button">
				<IconX size={20} />
			</button>
		</S.Item>
	);
};

export default Item;
