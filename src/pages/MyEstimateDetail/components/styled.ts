import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

const cartBoxCss = css`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
`;

export const CreateSection = styled.section`
	padding: ${unit(30)} 0;
	border-radius: ${unit(7)};
	border: none;
	display: flex;
	align-items: flex-start;
	gap: ${unit(15)};
`;

export const DroppableDays = styled.div`
	position: relative;
	overflow: scroll;
	scrollbar-color: #eee #e0e0e0;
	scrollbar-width: auto;
	display: flex;
	align-items: flex-start;
	gap: ${unit(15)};
	padding: 0 ${unit(10)} ${unit(50)} ${unit(10)};
	/* padding-bottom: ${unit(50)}; */
`;

const cartContainerCss = css`
	/* width: 100%; */
`;

export const DropSection = styled.div<{ $isCart: boolean }>`
	width: ${unit(240)};

	${({ $isCart }) => $isCart && cartContainerCss}
`;

export const BoxTitle = styled.div`
	width: 100%;
	margin-bottom: ${unit(10)};
	background-color: #f7f7f7;
	padding: ${unit(10)} ${unit(20)};
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: ${unit(10)};

	h1 {
		font-size: ${unit(18)};
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: ${unit(10)};
	}
`;

export const ItemBox = styled.div<{ $isCart: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${unit(20)};
	background-color: #f7f7f7;
	min-height: ${unit(250)};
	border-radius: ${unit(10)};
	padding: ${unit(10)};
	flex-shrink: 0;
	min-width: ${unit(240)};
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;

	${({ $isCart }) => $isCart && cartBoxCss}
`;

export const Item = styled.div`
	background-color: #fff;
	border-radius: ${unit(10)};
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	overflow: hidden;
	width: ${unit(220)};
	position: relative;
`;

export const EditButton = styled.button`
	position: absolute;
	right: ${unit(10)};
	top: ${unit(10)};
	background-color: #fff;
	width: ${unit(25)};
	height: ${unit(25)};
`;

export const ItemNameBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	h5 {
		font-size: ${unit(12)};
		font-weight: 400;
		display: flex;
		flex-direction: column;
		gap: ${unit(5)};
		color: #999;
		/* align-items: center; */
		width: 100%;
		user-select: none;

		summary {
			color: #111;
			font-weight: 400;
			font-size: ${unit(16)};
		}
	}

	span {
		svg {
			color: #aaa;
		}
	}
`;

export const ItemThumbnailFigure = styled.figure<{ $backgroundImage: string }>`
	width: 100%;
	height: ${unit(150)};

	background-size: cover;
	background-position: center center;
	background-image: url(${({ $backgroundImage }) => $backgroundImage});
`;

export const ItemContent = styled.div`
	background: #fff;
	padding: ${unit(10)};
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: ${unit(10)};
`;

export const InputBox = styled.div`
	display: flex;
	align-items: center;
	gap: ${unit(5)};

	input {
		box-sizing: border-box;
		width: calc(100% - ${unit(10)} - ${unit(40)});
		background: #f9f9f9;
		border: 1px solid #eee;
		height: ${unit(40)};
		padding: ${unit(5)} ${unit(10)};
		font-size: ${unit(16)};
		border-radius: ${unit(5)};

		&::placeholder {
			font-size: ${unit(13)};
		}
	}
	button {
		box-sizing: border-box;
		flex-shrink: 0;
		border: 1px solid #eee;
		height: ${unit(40)};
		width: ${unit(30)};
		border-radius: ${unit(5)};
		background-color: #f9f9f9;

		svg {
			width: ${unit(20)};
			height: ${unit(20)};
			color: #444;
		}
	}
`;

export const PriceQuantity = styled.div`
	display: flex;
	justify-content: space-between;

	& > p {
		font-weight: 500;
		color: #8c8c8c;
		user-select: none;
	}
`;

export const QuantityOption = styled.div`
	display: flex;
	gap: ${unit(5)};
	button {
		width: ${unit(20)};
		height: ${unit(20)};
		font-size: ${unit(18)};
		line-height: ${unit(18)};
		border-radius: ${unit(5)};
		background-color: #f9f9f9;
		border: 1px solid #eee;
		/* border: none; */
		display: flex;
		justify-content: center;
		align-items: center;
	}

	input {
		box-sizing: border-box;
		width: ${unit(30)};
		background: #f9f9f9;
		border: 1px solid #eee;
		height: ${unit(20)};
		font-size: ${unit(15)};
		border-radius: ${unit(5)};
		text-align: center;

		&::placeholder {
			font-size: ${unit(13)};
		}
	}
`;

export const ItemEditContainer = styled.div`
	width: ${unit(850)};
	height: ${unit(700)};
	overflow: scroll;
	padding: 0 ${unit(30)} ${unit(30)};
`;

export const CopyTableButton = styled.button``;

export const ContentCheckBox = styled.div`
	position: absolute;
	left: ${unit(10)};
	top: ${unit(10)};
	width: ${unit(25)};
	height: ${unit(25)};
`;
