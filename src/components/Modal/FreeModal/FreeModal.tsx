/* eslint-disable react/no-array-index-key */
import { IModal } from '..';
import * as S from '../styled';
import { Image } from '@components/index';
import { ICONS } from '@shared/constants';
import { useModal } from '@shared/hooks';
import React, { useState, ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import Modal from 'react-modal';

interface Props {
	needCloseButton?: boolean;
	needOKButton?: boolean;
	onAfterClose?: any;
	disabled?: boolean;
	containerStyle?: any;
	children?: JSX.Element;

	shouldCloseOnOverlayClick?: boolean;
	shouldCloseOnEsc?: boolean;
}

const FreeModal: ForwardRefRenderFunction<IModal, Props> = (
	{ needCloseButton = false, needOKButton = false, onAfterClose, disabled = true, containerStyle, children, ...props },
	ref,
) => {
	/**
	 * States
	 */
	const { closeFreeModal } = useModal();
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
		closeFreeModal();
		setOpen(false);
	};

	/**
	 * Helpers
	 */
	useImperativeHandle(ref, () => ({
		open: openModal,
		close: closeModal,
	}));

	const buttonBackground = disabled ? '#23815e' : '#ccc';

	return (
		<Modal
			className="Modal FreeModal"
			overlayClassName="Overlay FreeOverlay"
			isOpen={isOpen}
			onRequestClose={closeModal}
			style={containerStyle}
			onAfterClose={onAfterClose}
			shouldCloseOnEsc
			{...props}
		>
			{needCloseButton && (
				<S.CloseWrapper>
					<Image src="close_modal.webp" onClick={closeModal} />
				</S.CloseWrapper>
			)}

			{needCloseButton && <S.ModalBlank />}

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

export default forwardRef(FreeModal);
