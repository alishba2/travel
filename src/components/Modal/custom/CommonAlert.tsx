import * as S from './styled';
import React, { FC } from 'react';
import { ICONS } from '@shared/constants';
import { StringKeyAndVal } from '@typings/base';
import { Colors } from '@styles/globalStyles';

interface Props {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info' | 'question' | 'none';
	buttonHandler: () => void;
}

export const modalIcon: StringKeyAndVal = {
	success: 'modal_success.webp',
	error: 'modal_error.webp',
	warning: 'modal_warning.webp',
	info: 'modal_success.webp',
	question: 'modal_warning.webp',
	none: '',
};

const buttonStyle: { [key: string]: any } = {
	success: { backgroundColor: Colors.primary },
	error: { backgroundColor: Colors.danger },
	warning: { backgroundColor: Colors.warning },
	info: { backgroundColor: Colors.primary },
	question: { backgroundColor: Colors.primary },
	none: { backgroundColor: Colors.primary },
};

const CommonAlert: FC<Props> = ({ message, type = 'info', buttonHandler }) => {
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
	const splittedMessage = message?.split(/<b>|<\/b>/) || [];
	const icon = modalIcon[type];

	return (
		<S.CommonAlert>
			{/* <S.ModalIcon src={icon} /> */}

			{/*  */}

			<S.ModalDescription>
				{splittedMessage.map((text, index) => {
					// eslint-disable-next-line react/no-array-index-key
					if (!(index === 0) && index % 2 === 1) return <b key={index}>{text}</b>;
					return text;
				})}
			</S.ModalDescription>

			<S.ModalButtonWrapper>
				<button type="button" onClick={buttonHandler} style={buttonStyle[type]}>
					확인
				</button>
			</S.ModalButtonWrapper>
		</S.CommonAlert>
	);
};

export default CommonAlert;
