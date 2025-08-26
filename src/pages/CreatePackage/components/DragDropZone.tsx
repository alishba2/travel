/* eslint-disable import/no-cycle */
import React, { FC, useState, useEffect } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import * as S from './styled';
import { insertAtIndex, removeAtIndex, arrayMove } from '@shared/utils/array';
import Item from './Item';
import { CustomSetState, StringKeyAndVal } from '@typings/base';
import Droppable from './Droppable';
import { ItemGroups, SelectedItemType } from '../types';
import { CART_KEY } from '@shared/utils/base';

export interface Item {
	id: number;
	name: string;
}

export interface Group {
	id: number;
	day: number;
}

interface IProps {
	itemGroups: ItemGroups;
	setItemGroups: CustomSetState<ItemGroups>;
	handleRemoveDay: (key: string) => void;
	handleCopyItem: (key: number) => void;
	selectedItemList: SelectedItemType[];
	setSelectedItemList: CustomSetState<SelectedItemType[]>;
}

const DragDropZone: FC<IProps> = ({
	itemGroups,
	setItemGroups,
	handleRemoveDay,
	selectedItemList,
	setSelectedItemList,
	handleCopyItem,
}) => {
	/**
	 * States
	 */

	const [activeId, setActiveId] = useState(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			// onActivation: (event) => console.log('onActivation', event), // Here!
			activationConstraint: { distance: 5 },
		}),
		useSensor(TouchSensor),
	);

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	const handleDragStart = ({ active }: any) => {
		setActiveId(active.id);
	};

	const handleDragCancel = () => setActiveId(null);

	const handleDragOver = ({ active, over }: any) => {
		const overId = over?.id;

		if (!overId) {
			return;
		}

		const activeContainer = active.data.current.sortable.containerId;
		const overContainer = over.data.current?.sortable.containerId || over.id;

		if (activeContainer !== overContainer) {
			setItemGroups((prevItemGroups) => {
				const activeIndex = active.data.current.sortable.index;
				const overIndex =
					over.id in prevItemGroups ? prevItemGroups[overContainer].length : over.data.current.sortable.index;

				return moveBetweenContainers(prevItemGroups, activeContainer, activeIndex, overContainer, overIndex, active.id);
			});
		}
	};

	const handleDragEnd = ({ active, over }: any) => {
		if (!over) {
			setActiveId(null);
			return;
		}

		if (active.id !== over.id) {
			const activeContainer = active.data.current.sortable.containerId;
			const overContainer = over.data.current?.sortable.containerId || over.id;
			const activeIndex = active.data.current.sortable.index;
			const overIndex = over.data.current?.sortable.index ?? 0;

			setItemGroups((prevItemGroups) => {
				let newItems;
				if (activeContainer === overContainer) {
					newItems = {
						...prevItemGroups,
						[overContainer]: arrayMove(prevItemGroups[overContainer], activeIndex, overIndex),
					};
				} else {
					newItems = moveBetweenContainers(
						prevItemGroups,
						activeContainer,
						activeIndex,
						overContainer,
						overIndex,
						active.id,
					);
				}

				return newItems;
			});
		}
		setActiveId(null);
	};

	const moveBetweenContainers = (
		items: any,
		activeContainer: any,
		activeIndex: any,
		overContainer: any,
		overIndex: any,
		item: any,
	) => {
		return {
			...items,
			[activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
			[overContainer]: insertAtIndex(items[overContainer], overIndex, item),
		};
	};

	/**
	 * Helpers
	 */

	return (
		<>
			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragCancel={handleDragCancel}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<S.CreateSection>
					<Droppable
						id={CART_KEY}
						items={itemGroups[CART_KEY]}
						activeId={activeId}
						key={CART_KEY}
						setItemGroups={setItemGroups}
						handleRemoveDay={handleRemoveDay}
						itemGroups={itemGroups}
						selectedItemList={selectedItemList}
						handleCopyItem={handleCopyItem}
						setSelectedItemList={setSelectedItemList}
					/>
					<S.DroppableDays>
						{Object.keys(itemGroups)
							.filter((o) => o !== CART_KEY)
							.map((group) => {
								return (
									<Droppable
										id={group}
										items={itemGroups[group]}
										activeId={activeId}
										key={group}
										setItemGroups={setItemGroups}
										handleRemoveDay={handleRemoveDay}
										itemGroups={itemGroups}
										selectedItemList={selectedItemList}
										handleCopyItem={handleCopyItem}
										setSelectedItemList={setSelectedItemList}
									/>
								);
							})}
					</S.DroppableDays>
				</S.CreateSection>

				<DragOverlay>
					{activeId ? (
						<Item
							id={activeId}
							dragOverlay
							setItemGroups={setItemGroups}
							selectedItemList={selectedItemList}
							handleCopyItem={handleCopyItem}
							setSelectedItemList={setSelectedItemList}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</>
	);
};

export default DragDropZone;
