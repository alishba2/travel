import React, { FC, useState, useEffect } from 'react';
import { ToolbarProps } from 'react-big-calendar';
import * as S from './styled';
import Image from '@components/Image';

const CustomHeader: FC<ToolbarProps> = ({ localizer, label, onNavigate }) => {
	/**
	 * States
	 */

	const { messages } = localizer;

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	/**
	 * Helpers
	 */
	return (
		<S.HeaderContainer>
			<S.TodayButton type="button" onClick={() => onNavigate('TODAY')}>
				{messages.today}
			</S.TodayButton>
			<S.HeaderButtonGroup>
				<button type="button" onClick={() => onNavigate('PREV')} className="arrowLeft">
					<Image src="calendar_arrow.png" />
				</button>
				<S.HeaderDateTitle>{label}</S.HeaderDateTitle>
				<button type="button" onClick={() => onNavigate('NEXT')} className="arrowRight">
					<Image src="calendar_arrow.png" />
				</button>
			</S.HeaderButtonGroup>
		</S.HeaderContainer>
	);
};

export default CustomHeader;
