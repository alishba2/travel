import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors, flexRowCenter } from './globalStyles';

type TypeAlign = 'left' | 'center' | 'right' | 'space-between' | 'flex-start' | 'flex-end';

const TableCSS = ($width?: number, $needScrollY?: boolean) => css`
	border-radius: ${unit(7)};
	border: 1px solid rgb(229, 234, 239);
	overflow: auto;

	width: ${$width ? unit($width) : '100%'};

	${$needScrollY ? `position: relative; max-height: ${unit(700)};` : ''}

	ul {
		&:first-of-type {
			${$needScrollY ? `position: sticky; top: 0;` : ''}
		}
	}
`;

//
//

const SearchTable = styled.form<{
	$width?: number;
	$needScrollY?: boolean;
	$isOverflowVisible?: boolean;
}>`
	${({ $width, $needScrollY }) => TableCSS($width, $needScrollY)};
	${({ $isOverflowVisible }) => $isOverflowVisible && `overflow: visible;`}

	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	border: none;
	padding: 0 0 ${unit(25)} ${unit(24)};

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
`;

const ResultTable = styled.article<{
	$width?: number;
	$needScrollY?: boolean;
}>`
	${({ $width, $needScrollY }) => TableCSS($width, $needScrollY)}
`;

//

const Row = styled.ul<{
	$isHover?: boolean;
	$isNonBorder?: boolean;
	$isNonBorderBottom?: boolean;
	$bgColor?: string;
	$isLast?: boolean;
	$paddingTop?: number;
}>`
	&:hover {
		cursor: ${({ $isHover }) => ($isHover ? 'pointer' : 'cursor')};
		& > li {
			${({ $isHover }) => $isHover && `background-color: rgb(247, 249, 252)`}
		}
	}
	display: flex;

	& > li {
		border-bottom: ${({ $isLast }) => ($isLast ? 0 : '1px solid rgb(229, 234, 239)')};
		${({ $paddingTop }) => $paddingTop && `padding-top: ${unit($paddingTop)} !important;`};
		background-color: 'white';
	}

	& > li {
		border-bottom: ${({ $isNonBorderBottom }) => ($isNonBorderBottom ? 0 : '1px solid rgb(229, 234, 239)')};
		${({ $paddingTop }) => $paddingTop && `padding-top: ${unit($paddingTop)} !important;`};
		background-color: 'white';
	}
`;

//

const Label = styled.li<{ $width?: number; $height?: number; $align?: TypeAlign; $required?: boolean }>`
	font-size: ${unit(14)};
	color: rgb(42, 53, 71);
	font-weight: 600;
	letter-spacing: ${unit(-0.32)};

	width: ${({ $width }) => ($width ? `${$width}%` : 'auto')};
	min-height: ${({ $height }) => ($height ? unit($height) : unit(46))};

	padding: ${unit(14)} 0 ${unit(14)} 0;

	${flexRowCenter}

	flex-grow: ${({ $width }) => ($width ? 0 : 1)};
	flex-shrink: 0;

	${({ $align }) => ($align ? `justify-content: ${$align}` : '')}
	${({ $required }) =>
		$required
			? `&::before {
					content: '*';
					color: #f00;
					font-size: ${unit(14)};
					margin-right: ${unit(4)};
				}
				`
			: ''}
`;

const Value = styled.li<{
	$width?: number;
	$height?: number;
	$align?: TypeAlign;
	$color?: string;
	$isStrong?: boolean;
	$isPointer?: boolean;
}>`
	color: ${({ $color }) => $color ?? 'rgb(42, 53, 71)'};
	letter-spacing: ${unit(-0.24)};
	font-size: ${unit(15)};
	font-weight: ${({ $isStrong }) => ($isStrong ? 600 : 400)};
	cursor: ${({ $isPointer }) => ($isPointer ? 'pointer' : 'unset')};

	background-color: white;
	width: ${({ $width }) => ($width ? `${$width}%` : 'auto')};
	min-height: ${({ $height }) => ($height ? unit($height) : unit(64))};
	padding: ${unit(15)};

	${flexRowCenter}

	flex-grow: ${({ $width }) => ($width ? 0 : 1)};
	flex-shrink: 0;

	/* isWrap 일괄 적용  */
	white-space: pre-line;
	word-break: break-all;
	word-wrap: break-word;
	text-align: center;
	/*  */

	${({ $align }) => ($align ? `justify-content: ${$align}; padding-left: ${unit(40)}` : '')}
`;

export default { SearchTable, ResultTable, Row, Label, Value };
