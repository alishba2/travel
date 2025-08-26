/* eslint-disable import/no-cycle */
import React, { FC, useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import * as S from './styled';
import { insertAtIndex, removeAtIndex, arrayMove } from '@shared/utils/array';
import Item from './Item';
import { CustomSetState } from '@typings/base';
import Droppable from './Droppable';
import { ItemGroups, SelectedEstimateItemType } from '../types';
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
	mainRef: any;
	itemGroups: ItemGroups;
	setItemGroups: CustomSetState<ItemGroups>;
	handleRemoveDay: (key: string) => void;
	handleCopyItem: (key: number) => void;
	selectedItemList: SelectedEstimateItemType[];
	setSelectedItemList: CustomSetState<SelectedEstimateItemType[]>;
	handleSend: () => void;
	isLoadingCopyItem: boolean;
	startDate: string | Date;
}

const DragDropZone: FC<IProps> = ({
	itemGroups,
	setItemGroups,
	handleRemoveDay,
	selectedItemList,
	setSelectedItemList,
	handleCopyItem,
	mainRef,
	handleSend,
	isLoadingCopyItem,
	startDate,
}) => {
	/**
	 * States
	 */
	const [activeId, setActiveId] = useState<number | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(TouchSensor),
	);

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

		const activeContainer = active.data.current?.sortable?.containerId;
		const overContainer = over.data.current?.sortable?.containerId || over.id;

		// Only proceed if we have valid containers and they're different
		if (!activeContainer || !overContainer || activeContainer === overContainer) {
			return;
		}

		setItemGroups((prevItemGroups) => {
			// Ensure both containers exist in the current state
			if (!prevItemGroups[activeContainer] || !prevItemGroups[overContainer]) {
				return prevItemGroups;
			}

			const activeIndex = active.data.current.sortable.index;
			const overIndex = over.id in prevItemGroups 
				? prevItemGroups[overContainer].length 
				: (over.data.current?.sortable?.index ?? 0);

			return moveBetweenContainers(
				prevItemGroups, 
				activeContainer, 
				activeIndex, 
				overContainer, 
				overIndex, 
				active.id
			);
		});

		// Update the day property of the item being moved
		setSelectedItemList((prevList) => {
			return prevList.map((item) => {
				if (item.sequence === active.id) {
					return {
						...item,
						day: Number(overContainer)
					};
				}
				return item;
			});
		});
	};

	const handleDragEnd = ({ active, over }: any) => {
		if (!over) {
			setActiveId(null);
			return;
		}

		if (active.id !== over.id) {
			const activeContainer = active.data.current?.sortable?.containerId;
			const overContainer = over.data.current?.sortable?.containerId || over.id;
			const activeIndex = active.data.current?.sortable?.index;
			const overIndex = over.data.current?.sortable?.index ?? 0;

			if (!activeContainer || !overContainer) {
				setActiveId(null);
				return;
			}

			setItemGroups((prevItemGroups) => {
				// Ensure containers exist
				if (!prevItemGroups[activeContainer] || !prevItemGroups[overContainer]) {
					return prevItemGroups;
				}

				let newItems;
				if (activeContainer === overContainer) {
					// Moving within the same container
					newItems = {
						...prevItemGroups,
						[overContainer]: arrayMove(prevItemGroups[overContainer], activeIndex, overIndex),
					};
				} else {
					// Moving between different containers
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

			// Update the item's day property if moving between containers
			if (activeContainer !== overContainer) {
				setSelectedItemList((prevList) => {
					return prevList.map((item) => {
						if (item.sequence === active.id) {
							return {
								...item,
								day: Number(overContainer)
							};
						}
						return item;
					});
				});
			}
		}
		setActiveId(null);
	};

	const moveBetweenContainers = (
		items: ItemGroups,
		activeContainer: string,
		activeIndex: number,
		overContainer: string,
		overIndex: number,
		item: number,
	): ItemGroups => {
		// Validate that the item exists in the active container
		if (!items[activeContainer] || !items[activeContainer].includes(item)) {
			console.warn(`Item ${item} not found in container ${activeContainer}`);
			return items;
		}

		// Ensure the over container exists
		if (!items[overContainer]) {
			console.warn(`Target container ${overContainer} does not exist`);
			return items;
		}

		return {
			...items,
			[activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
			[overContainer]: insertAtIndex(items[overContainer], overIndex, item),
		};
	};

	/**
	 * Helpers
	 */
	const data = selectedItemList.find((o) => o.sequence === activeId);

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
						items={itemGroups[CART_KEY] || []}
						activeId={activeId}
						key={CART_KEY}
						setItemGroups={setItemGroups}
						handleRemoveDay={handleRemoveDay}
						itemGroups={itemGroups}
						selectedItemList={selectedItemList}
						handleCopyItem={handleCopyItem}
						setSelectedItemList={setSelectedItemList}
						handleSend={handleSend}
						isLoadingCopyItem={isLoadingCopyItem}
					/>
					<S.DroppableDays ref={mainRef}>
						{Object.keys(itemGroups)
							.filter((o) => o !== CART_KEY)
							.sort((a, b) => Number(a) - Number(b)) // Ensure days are sorted numerically
							.map((group, idx) => {
								return (
									<Droppable
										id={group}
										items={itemGroups[group] || []}
										activeId={activeId}
										key={group} // Use group as key instead of idx for better React reconciliation
										setItemGroups={setItemGroups}
										handleRemoveDay={handleRemoveDay}
										itemGroups={itemGroups}
										selectedItemList={selectedItemList}
										handleCopyItem={handleCopyItem}
										setSelectedItemList={setSelectedItemList}
										handleSend={handleSend}
										isLoadingCopyItem={isLoadingCopyItem}
										startDate={startDate}
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
							data={data}
							setItemGroups={setItemGroups}
							selectedItemList={selectedItemList}
							handleCopyItem={handleCopyItem}
							setSelectedItemList={setSelectedItemList}
							handleSend={handleSend}
							isLoadingCopyItem={isLoadingCopyItem}
						/>
					) : null}
				</DragOverlay>
			</DndContext>
		</>
	);
};

export default DragDropZone;