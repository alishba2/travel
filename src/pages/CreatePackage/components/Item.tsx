import React, { FC, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as S from './styled';
import { IconCopy, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { getItemImg, comma } from '@shared/utils/base';
import { SelectedItemType } from '../types';
import { successToast } from '@shared/utils/toastUtils';
import { Tooltip } from 'react-tooltip';

const Item: FC<any> = ({
	id,
	setItemGroups,
	group = null,
	selectedItemList,
	handleCopyItem,
	setSelectedItemList,
	dragOverlay,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const [target, setTarget] = useState({ name: '', nameEng: '', src: '', originPrice: '', inputValue: '', desc: '' });

	useEffect(() => {
		const findTarget = selectedItemList?.find((o1: SelectedItemType) => o1?.sequence === id);

		if (findTarget) {
			setTarget({
				name: findTarget.nameKor,
				nameEng: findTarget.nameEng,
				src: findTarget?.itemSrc ?? '',
				originPrice: findTarget.originPrice,
				inputValue: findTarget?.price,
				desc: findTarget?.desc ?? '',
			});
		}
	}, [selectedItemList]);

	const onChangeValue = (e: any) => {
		const { value } = e.target;

		setSelectedItemList((prev: any) => {
			return prev.map((item: SelectedItemType) => {
				if (item.sequence === id) {
					return { ...item, price: value };
				}
				return item;
			});
		});
	};

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		cursor: 'pointer',
	};

	const deleteItem = () => {
		setItemGroups((prev: any) => {
			return {
				...prev,
				[group]: prev[group].filter((o: any) => o !== id),
			};
		});
		setSelectedItemList((prev: any) => {
			const removeList = prev.filter((o: any) => o.sequence !== id);
			return removeList;
		});

		successToast('The product has been deleted.');
	};

	const copyItem = () => {
		handleCopyItem(id);
	};

	// if (!target.name || !target.src) return null;

	return (
		<S.Item style={style} ref={setNodeRef} {...attributes} {...listeners}>
			<S.ItemThumbnailFigure $backgroundImage={getItemImg(target.src)} />

			<S.ItemContent>
				<S.ItemNameBox>
					<h5>
						{target.name} <summary>{target.nameEng}</summary>
					</h5>
					{/* <span>
						<a data-tooltip-id="my-tooltip" data-tooltip-content={target.desc}>
							<IconInfoCircle size={20} />
						</a>
					</span> */}
				</S.ItemNameBox>

				<p>{comma(target.originPrice)}원</p>

				<S.InputBox>
					<input
						type="text"
						onChange={(e) => {
							onChangeValue(e);
						}}
						value={target.inputValue}
						placeholder="새 Price을 입력하세요"
					/>
					<button onClick={copyItem} type="button">
						<IconCopy size={20} />
					</button>
					<button onClick={deleteItem} type="button">
						<IconTrash size={20} />
					</button>
				</S.InputBox>
			</S.ItemContent>

			{/* {!dragOverlay ? <Tooltip id="my-tooltip" className="tooltipStyle" border="1px solid #666" /> : null} */}
		</S.Item>
	);
};

export default Item;
