import Image from '@components/Image';
import styled from '@emotion/styled';
import { munit, unit } from '@shared/utils/base';
import { Colors, mobilePoint } from '@styles/globalStyles';

export const CommonAlert = styled.article`
	padding: ${unit(30)} ${unit(50)} ${unit(30)};
	/* padding: ${unit(36)} ${unit(50)} ${unit(40)}; */
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	word-break: keep-all;
	@media screen and (max-width: ${mobilePoint}) {
		padding: ${munit(30)} ${munit(20)} ${munit(30)};
	}
`;

export const ModalIcon = styled(Image)`
	width: ${unit(70)};
	height: ${unit(70)};
	margin-bottom: ${unit(20)};
	@media screen and (max-width: ${mobilePoint}) {
		width: ${munit(60)};
		height: ${munit(60)};
		margin-bottom: ${munit(10)};
	}
`;

export const ModalDescription = styled.p`
	font-size: ${unit(16)};
	line-height: 1.65;
	color: black;
	@media screen and (max-width: ${mobilePoint}) {
		font-size: ${munit(15)};
		font-weight: 500;
		line-height: 1.6;
		letter-spacing: -${munit(0.3)};
	}
`;

export const ModalButtonWrapper = styled.div<{ $isConfirm?: boolean }>`
	display: flex;
	flex-direction: row;
	gap: ${unit(10)};

	justify-content: center;
	align-items: center;
	margin-top: ${unit(26)};
	@media screen and (max-width: ${mobilePoint}) {
		gap: ${munit(8)};
		margin-top: ${munit(30)};
	}

	button {
		width: ${({ $isConfirm }) => ($isConfirm ? unit(120) : unit(120))};
		height: ${({ $isConfirm }) => ($isConfirm ? unit(42) : unit(42))};
		border-radius: ${unit(7)};
		border: none;
		color: white;

		font-size: ${unit(15)};
		font-weight: 400;

		display: flex;
		justify-content: center;
		align-items: center;

		@media screen and (max-width: ${mobilePoint}) {
			width: ${({ $isConfirm }) => ($isConfirm ? munit(136) : munit(280))};
			height: ${munit(50)};
			border-radius: ${munit(8)};

			font-size: ${munit(15)};
			letter-spacing: ${munit(-0.3)};
		}

		&:nth-of-type(1) {
			background-color: ${Colors.green};
		}
		&:nth-of-type(2) {
			background-color: ${Colors.grayButton};
		}
	}
`;
