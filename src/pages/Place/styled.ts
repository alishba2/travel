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

export const FileModalBox = styled.div`
	width: ${unit(500)};
	padding: 0 ${unit(30)} ${unit(30)} ${unit(30)};

	p {
		font-size: ${unit(18)};
		font-weight: 500;
		margin-bottom: ${unit(20)};
	}

	& > div {
		display: flex;
		flex-wrap: wrap;
		gap: ${unit(10)};
		align-items: flex-start;

		figure {
			width: ${unit(200)};
			border: 1px solid black;
			padding: ${unit(15)};
		}
	}
`;
