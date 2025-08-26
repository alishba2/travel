/* eslint-disable react/no-array-index-key */
import { IModal } from '..';
import * as S from '../styled';
import { Image } from '@components/index';
import { ICONS } from '@shared/constants';
import { useModal } from '@shared/hooks';
import React, { useState, ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import Modal from 'react-modal';
import { isUndefined } from 'lodash-es';
import CommonAlert from '../custom/CommonAlert';

interface Props {
	needCloseButton?: boolean;
	needOKButton?: boolean;
	onAfterClose?: any;
	disabled?: boolean;
	containerStyle?: any;
	children?: JSX.Element;

	//

	message?: string;
	type?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'none';
}

const AlertModal: ForwardRefRenderFunction<IModal, Props> = (
	{
		needCloseButton = false,
		needOKButton = false,
		onAfterClose,
		disabled = true,
		containerStyle,
		children,
		message,
		type = 'info',
	},
	ref,
) => {
	/**
	 * States
	 */
	const { closeAlert } = useModal();
	const [isOpen, setOpen] = useState(false);

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */
	const openModal = () => setOpen(true);
	const closeModal = () => {
		closeAlert();
		setOpen(false);
	};

	/**
	 * Helpers
	 */
	useImperativeHandle(ref, () => ({
		open: openModal,
		close: closeModal,
	}));

	const onClickButton = () => {
		closeModal();
		// onAfterClose?.();
	};

	const isCommonModal = !isUndefined(message);

	const buttonBackground = disabled ? '#23815e' : '#ccc';

	return (
		<Modal
			className="Modal"
			overlayClassName="Overlay"
			isOpen={isOpen}
			onRequestClose={closeModal}
			style={containerStyle}
			shouldCloseOnEsc
			onAfterClose={() => {
				onAfterClose?.();
			}}
		>
			{needCloseButton && <S.ModalBlank />}

			{isCommonModal && <CommonAlert message={message} type={type} buttonHandler={onClickButton} />}

			{needCloseButton && (
				<S.CloseWrapper>
					<Image src="close_modal.webp" onClick={closeModal} />
				</S.CloseWrapper>
			)}

			{/*  */}

			{children}

			{/*  */}

			{needOKButton && (
				<S.ButtonWrapper>
					<button
						type="button"
						onClick={() => {
							closeModal();
						}}
						style={{ backgroundColor: buttonBackground }}
					>
						확인
					</button>
				</S.ButtonWrapper>
			)}
		</Modal>
	);
};

export default forwardRef(AlertModal);
