import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

export const Container = styled.main``;

export const MemoSection = styled.form`
	/* border-radius: ${unit(7)}; */
	/* border: 1px solid rgb(229, 234, 239); */
	overflow: auto;
	width: 100%;
	/* box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px; */
	border: none;
	/* padding: 0 0 ${unit(25)} ${unit(24)}; */

	& > ul > li {
		border-bottom: none;
		min-height: ${unit(45 + 24)};
		padding: 0;
		padding-right: ${unit(24)};
		justify-content: flex-start;

		padding-top: ${unit(25)};
	}

	& > ul {
		min-height: ${unit(46 + 24)};
	}

	& > section {
		display: flex;
		& > figure {
			width: ${unit(250)};
			flex-shrink: 0;
		}

		& > article {
			display: flex;
			align-items: flex-start;
			gap: ${unit(15)};
			padding: 0 ${unit(15)};
			overflow: scroll;
			flex-wrap: nowrap;
			& > div {
				border-radius: ${unit(10)};
				box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
				width: ${unit(240)};
				padding: ${unit(10)};
				background-color: #f7f7f7;
				flex-shrink: 0;
				input,
				textarea {
					background-color: #fff;
					box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
					border: none;
				}
			}
		}
	}

	& > div {
	}
`;

export const RecommendButtonBox = styled.section`
	width: calc(100% - ${unit(20)});
	background-color: #fff;
	position: absolute;
	top: 105%;
	left: 0;
	border-radius: ${unit(7)};
	box-shadow: 0 ${unit(2)} ${unit(20)} 0 rgba(193, 193, 193, 0.5);
	border: 1px solid #e8e8e8;
	z-index: 2000000;
	overflow-y: auto;

	max-height: ${unit(350)};

	button {
		width: 100%;
		text-align: left;
	}

	li {
		font-size: ${unit(15)};
		padding: ${unit(16)} ${unit(20)} ${unit(16)} ${unit(27)};

		b {
			color: ${Colors.primary};
			font-weight: 400;
		}
	}
`;

const activeResult = css`
	background-color: rgba(94, 136, 255, 0.05);
	color: ${Colors.primary};
	text-decoration: underline;
`;

export const SearchResultButton = styled.button<{ $active: boolean }>`
	${(props) => props.$active && activeResult}
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
`;

export const totalPrice = styled.div`
	text-align: end;
	padding: ${unit(10)};
	font-size: ${unit(18)};
	font-weight: 500;
	white-space: pre-line;
`;

export const Summary = styled.summary`
	background-color: #f7f7f7;
	padding: ${unit(30)} ${unit(40)};
	border-radius: ${unit(15)};
	display: flex;
	align-items: center;
	gap: ${unit(50)};

	section {
		display: flex;
		flex-direction: column;
		gap: ${unit(20)};
		div {
			h5 {
				color: #0066ca;
				font-weight: 500;
				font-size: ${unit(16)};
				margin-bottom: ${unit(5)};
			}
			p {
				font-size: ${unit(18)};
			}
		}
	}
`;

export const Thumbnail = styled.figure<{ $thumbnail: string }>`
	width: ${unit(300)};
	height: ${unit(200)};
	border-radius: ${unit(10)};
	background-size: cover;
	background-position: center center;
	background-image: url(${({ $thumbnail }) => $thumbnail});
`;
