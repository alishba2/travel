import Free from '@styles/FreeTable';
import React, { FC } from 'react';
import * as S from './styled';

interface Props {
	children?: React.ReactNode;
}

const ButtonBox: FC<Props> = ({ children }) => {
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
		<Free.Row>
			<Free.Value>
				<S.ButtonView>{children}</S.ButtonView>
			</Free.Value>
		</Free.Row>
	);
};

export default ButtonBox;
