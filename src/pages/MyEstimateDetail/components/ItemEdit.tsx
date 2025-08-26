import React, { FC, useState, useEffect } from 'react';
import * as S from './styled';
import PlaceCreateForm from '@pages/Place/components/PlaceCreateForm';
import { useGetItemDetail } from '@shared/hooks/queries/item';
import TransportationCreateForm from '@pages/Transportation/components/TransportationCreateForm';
import ContentsCreateForm from '@pages/Contents/components/ContentsCreateForm';
import AccommodationCreateForm from '@pages/Accommodation/components/AccommodationCreateForm';

interface IProps {
	itemInfo?: { itemType: string; itemId: number };
	handleSend: () => void;
}

const ItemEdit: FC<IProps> = ({ itemInfo, handleSend }) => {
	/**
	 * States
	 */

	/**
	 * Queries
	 */
	const { data } = useGetItemDetail(itemInfo?.itemId ? { id: itemInfo?.itemId } : undefined);

	const [item, totalCount] = data ?? [[], 0];

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	/**
	 * Helpers
	 */
	if (!itemInfo?.itemType) return null;

	return (
		<S.ItemEditContainer>
			{itemInfo?.itemType === '여행지' && (
				<PlaceCreateForm editTarget={item?.[0]} needCreateForm refetch={() => handleSend()} />
			)}
			{itemInfo?.itemType === '이동수단' && (
				<TransportationCreateForm editTarget={item?.[0]} needCreateForm refetch={() => handleSend()} />
			)}
			{itemInfo?.itemType === '컨텐츠' && (
				<ContentsCreateForm editTarget={item?.[0]} needCreateForm refetch={() => handleSend()} />
			)}
			{itemInfo?.itemType === '숙박' && (
				<AccommodationCreateForm editTarget={item?.[0]} needCreateForm refetch={() => handleSend()} />
			)}
		</S.ItemEditContainer>
	);
};

export default ItemEdit;
