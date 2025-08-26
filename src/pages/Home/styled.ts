import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

export const Container = styled.main`
	height: calc(100vh - ${unit(48)});
	border: 1px solid #eee;
	padding: ${unit(20)};
	border-radius: ${unit(10)};

	.calendar {
		.rbc-header {
			background-color: #eef1f8;
			padding: ${unit(15)} 0;
			font-weight: 500;
			font-size: ${unit(15)};
			border-left: none;
		}

		.rbc-button-link {
			cursor: unset !important;
			font-size: ${unit(16)};
		}

		.rbc-show-more {
			cursor: pointer !important;
		}

		.rbc-row-segment {
			padding: ${unit(5)};
			padding-top: 0;
		}

		.rbc-month-view {
			border-color: #eee;
		}
	}
`;
