import { css, keyframes, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { ButtonStatus, StringKeyAndVal } from '@typings/base';

// 웹 색상표
export const Colors: StringKeyAndVal = {
	blue: '#4477b2',
	green: '#3b8d6e',
	grayButton: '#888f9a',
	fail: '#FF6C6C', //! FIXME 임시값

	navyBlack: 'rgb(42, 53, 71)',

	//
	//

	// primary: 'rgb(94, 136, 255)',
	primary: '#0066ca',
	secondary: 'rgb(73, 190, 255)',
	third: '#243461',

	fourth: '#4463B8',
	fifth: '#17213D',

	//

	warning: 'rgb(255, 44, 32)',

	danger: '#ff0000',
	// danger: 'rgb(250, 137, 107)',
	// disabled: '#e4e9ee',
	disabled: 'rgb(236, 242, 255)',
};

const bttonStatusCSS: any = {
	primary: css`
		background-color: ${Colors.primary};
		border: 1px solid transparent;
		color: #fff;
	`,

	primary_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.primary};
		color: ${Colors.primary};
	`,

	secondary: css`
		background-color: ${Colors.secondary};
		border: 1px solid transparent;
		color: #fff;
	`,

	secondary_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.secondary};
		color: ${Colors.secondary};
	`,

	third: css`
		background-color: ${Colors.third};
		border: 1px solid transparent;
		color: #fff;
	`,

	third_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.third};
		color: ${Colors.third};
	`,

	//

	fourth: css`
		background-color: ${Colors.fourth};
		border: 1px solid transparent;
		color: #fff;
	`,

	fourth_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.fourth};
		color: ${Colors.fourth};
	`,

	//

	danger: css`
		background-color: ${Colors.danger};
		border: 1px solid transparent;
		color: #fff;
	`,

	danger_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.danger};
		color: ${Colors.danger};
	`,

	warning: css`
		background-color: ${Colors.warning};
		border: 1px solid transparent;
		color: #fff;
	`,

	warning_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.warning};
		color: ${Colors.warning};
	`,

	success: css`
		background-color: ${Colors.success};
		border: 1px solid transparent;
		color: #fff;
	`,

	success_outlined: css`
		background-color: transparent;
		border: 1px solid ${Colors.success};
		color: ${Colors.success};
	`,

	disabled: css`
		background-color: ${Colors.disabled};
		border: 1px solid transparent;
		color: #c3c7cc;

		&:hover {
			cursor: default;
		}
	`,
};

export const point = 1025;
export const mobilePoint = `${point}px`;

export const onlyPC = (query: string): any => {
	const spot = Number(mobilePoint.replace('px', '')) + 1;
	return css`
		@media screen and (min-width: ${spot}px) {
			${query}
		}
	`;
};

const fadeIn = keyframes`
	0% { opacity: 0; }
	100% { opacity: 1; }
`;

export const fadeInAnimate = css`
	animation-name: ${fadeIn};
	animation-duration: 1s;
	animation-iteration-count: 1;
`;

// 중복, 자주 사용
export const often = {
	centerX: css`
		position: absolute;
		transform: translateX(-50%);
		left: 50%;
	`,
	centerY: css`
		position: absolute;
		transform: translateY(-50%);
		top: 50%;
	`,
	centerXY: css`
		position: absolute;
		transform: translate(-50%, -50%);
		top: 50%;
		left: 50%;
	`,
};

export const hoverButton = css`
	&:hover {
		cursor: pointer;
	}
`;

export const backgroundImageCover = css`
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
`;

export const fixedTop = css`
	position: fixed;
	top: 0;
	left: 0;
`;

export const fixedBottom = css`
	position: fixed;
	bottom: 0;
	left: 0;
`;

export const flexRow = css`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

export const flexRowCenter = css`
	${flexRow}
	justify-content: center;
`;

export const flexRowBetween = css`
	${flexRow}
	justify-content: space-between;
`;

export const flexMobile = css`
	display: flex;
	flex-direction: column;
`;

export const scroller = css`
	overflow: auto;
	white-space: nowrap;
	&::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`;

export const numberOfLines = (lineLength: number): SerializedStyles => css`
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: ${lineLength};
	-webkit-line-clamp: ${lineLength};
	display: -webkit-box;
	-webkit-box-orient: vertical;
`;

export const hideScrollbar = css`
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
	::-webkit-scrollbar {
		display: none;
	}
`;

export const LeftIcon = css`
	content: '';
	${backgroundImageCover}
	${often.centerY}
	left: 0;
`;

export const Table = styled.div<{ $isNotPaging?: boolean }>`
	width: 100%;
	overflow-x: scroll;
	overflow-y: hidden;
	display: inline-block;
	background-color: #fff;
	margin-bottom: ${({ $isNotPaging }) => ($isNotPaging ? 'none' : unit(20))};
`;

const headerStyle = css`
	/* border-bottom: 1px solid #eee;
	border-top: 1px solid #eee; */
	/* background-color: #f0f0f0; */
	padding: ${unit(10)} 0;
	div {
		font-weight: 600;
		font-size: ${unit(13)};
	}
`;

export const Column = styled.div<{ $isHeader?: boolean; $width?: number }>`
	width: ${({ $width }) => unit(Number($width)) || 'auto'};
	flex-shrink: 0;
	padding: ${unit(10)} 0;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: ${unit(14)};

	border-bottom: 1px solid #eee;
	font-weight: ${({ $isHeader }) => $isHeader && '600'};

	img {
		height: ${unit(60)};
	}
	&:last-child {
		flex-grow: 1;
	}
`;

export const Row = styled.div<{ $isHeader?: boolean; $isNotBorderBottom?: boolean; $background?: string }>`
	display: flex;
	min-height: ${unit(80)};
	width: auto;
	${({ $isHeader }) => $isHeader && headerStyle}
	${({ $isNotBorderBottom }) => $isNotBorderBottom && `border-bottom: none`}
	${({ $background }) => ($background ? `background-color: ${$background}` : ``)}
`;

export const InsertForm = styled.form`
	margin-bottom: ${unit(50)};
`;

export const InsertButtons = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${unit(10)};
`;

export const InsertButton = styled.button`
	width: ${unit(150)};
	height: ${unit(40)};
	background-color: ${Colors.primary};
	color: #fff;
	font-weight: 600;
	border-radius: ${unit(5)};
	font-size: ${unit(14)};
`;
export const ResetButton = styled.button`
	width: ${unit(150)};
	height: ${unit(40)};
	border: 1px solid ${Colors.primary};
	color: ${Colors.primary};
	font-weight: 600;
	border-radius: ${unit(5)};
	font-size: ${unit(14)};
`;
export const InsertField = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: ${unit(20)};
	border: 1px solid #eee;
	border-bottom: none;
`;
export const InsertPiece = styled.aside<{ $pieceGrow?: number }>`
	display: flex;
	min-height: ${unit(60)};
	width: calc(100% * ${({ $pieceGrow }) => $pieceGrow || 1});
`;
export const InsertPieceLabel = styled.div`
	width: ${unit(150)};
	padding: 0 ${unit(20)};
	background: #f6f6f6;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${unit(14)};
	font-weight: 500;
	text-align: center;
	border-right: 1px solid #eee;
	border-bottom: 1px solid #eee;
	flex-shrink: 0;
`;
export const InsertPieceContent = styled.div`
	display: flex;
	align-items: center;
	padding: ${unit(10)};
	flex-grow: 1;
	border: none;
	border-bottom: 1px solid #eee;
	position: relative;

	select,
	input[type='text'],
	input[type='password'],
	input[type='number'] {
		width: 100%;
		height: ${unit(40)};
		padding: 0 ${unit(10)};
		border: 1px solid #eee;
	}
	textarea {
		width: 100%;
		height: ${unit(40)};
		padding: ${unit(10)};
		border: 1px solid #eee;
		resize: none;
		height: ${unit(200)};
		overflow-y: scroll;
		line-height: ${unit(25)};
	}
`;

export const Divider = styled.hr`
	margin: ${unit(40)} 0;
	border: none;
	border-top: 1px solid #eee;
`;

export const OptionButtons = styled.div`
	display: flex;
	align-items: center;
	gap: ${unit(8)};
	flex-wrap: wrap;
`;

export const RowButton = styled.button<{ $status?: ButtonStatus; $isArea?: boolean }>`
	padding: ${({ $isArea }) => ($isArea ? `${unit(5)} ${unit(10)}` : `${unit(3)} ${unit(8)}`)};
	border-radius: ${unit(4)};

	${({ $status }) =>
		($status === 'primary' && bttonStatusCSS.primary) ||
		($status === 'primary_outlined' && bttonStatusCSS.primary_outlined) ||
		/*  */

		($status === 'secondary' && bttonStatusCSS.secondary) ||
		($status === 'secondary_outlined' && bttonStatusCSS.secondary_outlined) ||
		/*  */

		($status === 'third' && bttonStatusCSS.third) ||
		($status === 'third_outlined' && bttonStatusCSS.third_outlined) ||
		/*  */

		($status === 'fourth' && bttonStatusCSS.fourth) ||
		($status === 'fourth_outlined' && bttonStatusCSS.fourth_outlined) ||
		/*  */

		($status === 'danger' && bttonStatusCSS.danger) ||
		($status === 'danger_outlined' && bttonStatusCSS.danger_outlined) ||
		/*  */

		($status === 'warning' && bttonStatusCSS.warning) ||
		($status === 'warning_outlined' && bttonStatusCSS.warning_outlined) ||
		/*  */

		($status === 'success' && bttonStatusCSS.success) ||
		($status === 'success_outlined' && bttonStatusCSS.success_outlined) ||
		/*  */
		(!!$status && bttonStatusCSS.primary_outlined)};
`;

export const ButtonBox2 = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;

	gap: ${unit(15)};
`;

export const RadioBox = styled.div`
	display: flex;
	align-items: center;
	gap: ${unit(15)};
`;

export const CreateButtonBox = styled.div`
	width: 100%;

	margin-bottom: ${unit(8)};

	display: flex;
	justify-content: flex-end;
	align-items: center;
`;
