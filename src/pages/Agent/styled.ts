import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

export const Container = styled.div`
	width: 100%;
`;

export const DropZone = styled.section<{ $isActive: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
`;
