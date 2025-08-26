import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

export const Wrapper = styled.div`
	width: ${unit(350)};
	height: ${unit(350)};
	position: fixed;
	top: ${unit(10)};
	right: ${unit(10)};
	z-index: 100000;
`;

export const Close = styled.div`
	width: 100%;
	height: ${unit(25)};
	padding-bottom: ${unit(10)};
	display: flex;
	align-items: center;
	justify-content: flex-end;

	img {
		width: ${unit(25)};
		height: auto;
		cursor: pointer;
	}
`;

export const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;
