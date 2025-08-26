/* eslint-disable import/no-cycle */
import React, { FC, useState, useEffect } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import * as S from './styled';
import { arrayMove, insertAtIndex, removeAtIndex } from '@shared/utils/array';
import Item from './Item';
import { CustomSetState } from '@typings/base';
import { ItemGroups } from '..';
import Droppable from './Droppable';

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
}

const DragDropZone: FC<IProps> = ({ itemGroups, setItemGroups, handleRemoveDay }) => {
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
			setItemGroups((itemGroups: any) => {
				const activeIndex = active.data.current.sortable.index;
				const overIndex = over.id in itemGroups ? itemGroups[overContainer].length : over.data.current.sortable.index;

				return moveBetweenContainers(itemGroups, activeContainer, activeIndex, overContainer, overIndex, active.id);
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
			const overIndex = over.id in itemGroups ? itemGroups[overContainer].length : over.data.current.sortable.index;

			setItemGroups((itemGroups: any) => {
				let newItems;
				if (activeContainer === overContainer) {
					console.log('ififififfii');
					newItems = {
						...itemGroups,
						[overContainer]: arrayMove(itemGroups[overContainer], activeIndex, overIndex),
					};
				} else {
					console.log('elseelseelseelse');
					newItems = moveBetweenContainers(
						itemGroups,
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
					{Object.keys(itemGroups).map((group) => {
						return (
							<Droppable
								id={group}
								items={itemGroups[group]}
								activeId={activeId}
								key={group}
								setItemGroups={setItemGroups}
								handleRemoveDay={handleRemoveDay}
								itemGroups={itemGroups}
							/>
						);
					})}
				</S.CreateSection>

				<DragOverlay>{activeId ? <Item id={activeId} dragOverlay setItemGroups={setItemGroups} /> : null}</DragOverlay>
			</DndContext>
		</>
	);
};

export default DragDropZone;
