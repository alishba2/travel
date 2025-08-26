import React, { ChangeEvent, ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as S from './styled';
import { IconCopy, IconEdit, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { getItemImg, comma, whatTheBest } from '@shared/utils/base';
import { SelectedEstimateItemType } from '../types';
import { errorToast, successToast } from '@shared/utils/toastUtils';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@shared/path';
import { ItemType } from '@typings/payload';
import { StringKeyAndAny } from '@typings/base';
import { useItemSearchStore } from '@shared/store/itemSearch';
import { FreeModal, IModal } from '@components/Modal';
import ItemEdit from './ItemEdit';
import { CheckBox } from '@components/Input';

const Item: FC<any> = ({
	id,
	setItemGroups,
	group = null,
	data,
	selectedItemList,
	handleCopyItem,
	setSelectedItemList,
	dragOverlay,
	handleSend,
	isLoadingCopyItem,
}) => {
	const itemEditModal = useRef<IModal>(null);
	const [editItemInfo, setEditItemInfo] = useState<{ itemType: string; itemId: number }>();
	const [isLoadingItemDelete, setIsLoadingItemDelete] = useState(false);

	const { dispatchItemId } = useItemSearchStore((state) => state);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const navigate = useNavigate();

	const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (value.includes('-') || !/^\d*$/.test(value)) {
			return;
		}

		setSelectedItemList((prev: any) => {
			return prev.map((item: SelectedEstimateItemType) => {
				if (item.sequence === id) {
					if (name === 'quantity') {
						if (value === '') {
							return { ...item, [name]: '', price: null };
						}
						return {
							...item,
							[name]: value,
							price:
								String(value) === '1' ? null : Number(whatTheBest(item.pricePolicy, Number(value))) * Number(value),
						};
					}
					return { ...item, [name]: value };
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
		setIsLoadingItemDelete(true);
		setItemGroups((prev: any) => {
			if (!prev) {
				return prev;
			}
			return {
				...prev,
				[group]: prev[group].filter((o: any) => o !== id),
			};
		});

		setSelectedItemList((prev: any) => {
			if (!prev) {
				return prev;
			}
			const removeList = prev.filter((o: any) => o.sequence !== id);
			return removeList;
		});

		successToast('The product has been deleted.');
		setIsLoadingItemDelete(false);
	};

	const decrease = () => {
		if (data?.quantity === 1) {
			return;
		}
		setSelectedItemList((prev: any) => {
			return prev.map((item: SelectedEstimateItemType) => {
				if (item.sequence === id) {
					const quantity = Number(item.quantity) - 1;
					return {
						...item,
						quantity,
						price: quantity === 1 ? null : whatTheBest(item?.pricePolicy, quantity) * quantity,
					};
				}

				return item;
			});
		});
	};

	const increase = () => {
		setSelectedItemList((prev: any) => {
			return prev.map((item: SelectedEstimateItemType) => {
				if (item.sequence === id) {
					const quantity = Number(item.quantity) + 1;
					return {
						...item,
						quantity,
						price: whatTheBest(item?.pricePolicy, quantity) * quantity,
					};
				}
				return item;
			});
		});
	};

	const copyItem = () => {
		handleCopyItem(id);
	};

	const editItem = () => {
		const { itemType, itemId } = data;

		itemEditModal.current?.open();
		setEditItemInfo({ itemId, itemType });

		// const pathsMap: StringKeyAndAny = {
		// 	여행지: PATHS.PLACE,
		// 	이동수단: PATHS.TRANSPORTATION,
		// 	컨텐츠: PATHS.CONTENTS,
		// 	숙박: PATHS.ACCOMMODATION,
		// };

		// const path = pathsMap?.[itemType];

		// if (path) {
		// 	dispatchItemId(itemId);
		// 	navigate(path);
		// } else {
		// 	errorToast('The product cannot be found.');
		// }
	};

	const handleEnableContent = () => {
		setSelectedItemList((prev: any) => {
			return prev.map((item: SelectedEstimateItemType) => {
				if (item.sequence === id) {
					return {
						...item,
						enableContent: !item.enableContent,
					};
				}
				return item;
			});
		});
	};

	return (
		<S.Item style={style} ref={setNodeRef} {...attributes} {...listeners}>
			<S.ItemThumbnailFigure $backgroundImage={getItemImg(data?.itemSrc)} />
			<S.EditButton onClick={editItem} type="button">
				<IconEdit size={20} />
			</S.EditButton>
			{data?.itemType === '컨텐츠' && (
				<S.ContentCheckBox>
					<CheckBox isChecked={data.enableContent} checkHandler={handleEnableContent} />
				</S.ContentCheckBox>
			)}

			<S.ItemContent>
				<S.ItemNameBox>
					<h5>
						{data?.nameKor} <summary>{data?.nameEng}</summary>
					</h5>
					{/* <span>
						<a data-tooltip-id="my-tooltip" data-tooltip-content={data?.desc}>
							<IconInfoCircle size={20} />
						</a>
					</span> */}
				</S.ItemNameBox>

				<S.PriceQuantity>
					<p>{comma(whatTheBest(data?.pricePolicy, data?.quantity))} USD</p>
					<S.QuantityOption>
						<button type="button" onClick={decrease}>
							-
						</button>
						<input type="text" name="quantity" maxLength={2} value={data?.quantity} onChange={onChangeValue} />
						<button type="button" onClick={increase}>
							+
						</button>
					</S.QuantityOption>
				</S.PriceQuantity>

				<S.InputBox>
					<input
						type="text"
						name="price"
						onChange={(e) => {
							onChangeValue(e);
						}}
						value={data?.price ? data?.price : ''}
						placeholder="새 Price을 입력하세요"
					/>
					<button onClick={copyItem} type="button" disabled={isLoadingCopyItem}>
						<IconCopy size={20} />
					</button>
					<button onClick={deleteItem} type="button" disabled={isLoadingItemDelete}>
						<IconTrash size={20} />
					</button>
				</S.InputBox>
			</S.ItemContent>

			<FreeModal ref={itemEditModal} needCloseButton>
				<ItemEdit
					itemInfo={editItemInfo}
					handleSend={() => {
						handleSend();
						itemEditModal.current?.close();
					}}
				/>
			</FreeModal>

			{/* {!dragOverlay ? <Tooltip id="my-tooltip" className="tooltipStyle" border="1px solid #666" /> : null} */}
		</S.Item>
	);
};

export default Item;
