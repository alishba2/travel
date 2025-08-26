import React, { FC } from 'react';
import * as S from './styled';

interface Props {
	children?: React.ReactNode;
}

const TableWrapper: FC<Props> = ({ children }) => {
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
		<S.Container>
			<S.Header>Search Results</S.Header>
			<S.Wrapper>{children}</S.Wrapper>
		</S.Container>
	);
};

export default TableWrapper;
