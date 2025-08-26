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

export const EstimateDetailBox = styled.div`
	background-color: #ecefff;
	padding: ${unit(15)} ${unit(30)};
	display: flex;
	align-items: center;
	gap: ${unit(150)};

	ul {
		min-width: ${unit(300)};

		p {
			font-size: ${unit(18)};
			font-weight: 700;
			margin-bottom: ${unit(10)};
		}

		li {
			color: rgb(42, 53, 71);
			font-size: ${unit(16)};
			font-weight: 500;

			/* isWrap 일괄 적용  */
			white-space: pre-line;
			word-break: break-all;
			word-wrap: break-word;
		}
	}
`;
