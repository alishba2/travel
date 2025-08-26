import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

const cartContainerCss = css`
	width: 100%;
	background-color: #f9f9f9;
`;

const cartBoxCss = css`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
`;

export const CreateSection = styled.section`
	border-radius: ${unit(7)};
	width: 100%;
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	border: none;
	padding: ${unit(25)};
	display: flex;
	align-items: flex-start;
	flex-wrap: wrap;
	/* justify-content: space-between; */
	gap: ${unit(20)};
`;

export const DropSection = styled.div<{ $isCart: boolean }>`
	background-color: #f9f9f9;
	width: 23.5%;
	overflow: scroll;
	min-height: ${unit(200)};
	padding: ${unit(10)};
	border-radius: ${unit(7)};
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	border: 1px solid;

	${({ $isCart }) => $isCart && cartContainerCss}
`;

export const BoxTitle = styled.div`
	width: 100%;
	margin-bottom: ${unit(10)};
	display: flex;
	align-items: center;
	justify-content: space-between;

	h1 {
		font-size: ${unit(22)};
	}
`;

export const ItemBox = styled.div<{ $isCart: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${unit(10)};

	${({ $isCart }) => $isCart && cartBoxCss}
`;

export const Item = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${unit(15)};
	background-color: #ccc;
	padding: ${unit(10)};
	border-radius: ${unit(5)};

	p {
		font-size: ${unit(16)};
	}
`;
