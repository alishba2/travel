import React, { FC } from 'react';
import * as S from './styled';

interface IProps {
	title: string;
	desc?: string;
	children?: React.ReactNode;
}

const Title: FC<IProps> = ({ title, desc, children }) => {
	/**
	 * States
	 */

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
		<S.Container $isChild={!!children}>
			<S.HeadingBox>
				<S.Title>{title}</S.Title>
				{desc && <S.Description>{desc}</S.Description>}
			</S.HeadingBox>

			{/*  */}

			{children || null}
		</S.Container>
	);
};

export default Title;
