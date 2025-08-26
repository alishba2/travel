import styled from '@emotion/styled';
import { getItemImg, unit } from '@shared/utils/base';
import { backgroundImageCover } from '@styles/globalStyles';

export const Container = styled.div`
	width: ${unit(700)};

	button {
		position: absolute;
		bottom: ${unit(5)};
		left: ${unit(330)};
	}
`;

export const SearchResult = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${unit(10)};
	padding: ${unit(10)};
`;

export const FileBox = styled.div`
	width: calc((100% - ${unit(40)}) / 5);
	position: relative;

	&:hover {
		cursor: pointer;
		figure {
			/* transform: scale(1.05); */
		}
		p {
			opacity: 1;
		}
	}
`;

export const ItemName = styled.p`
	font-size: ${unit(14)};
	width: 100%;
	word-break: break-all;
	text-transform: capitalize;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: ${unit(80)};
	background-color: rgba(0, 0, 0, 0.4);
	color: #fff;
	transition: 0.2s;
	opacity: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: ${unit(13)};
	padding: 0 ${unit(5)};
	word-break: keep-all;
`;

export const FileImgFigure = styled.figure<{ $src: string; $isHaveHttps: boolean }>`
	background-image: ${({ $src, $isHaveHttps }) => ($src && $isHaveHttps ? `url(${$src})` : `url(${getItemImg($src)})`)};
	${backgroundImageCover};
	width: 100%;
	height: ${unit(80)};
	transition: transform 0.3s;
`;
