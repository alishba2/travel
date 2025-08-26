import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

export const HeaderContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	margin-bottom: ${unit(30)};
`;

export const HeaderButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: ${unit(15)};
	width: calc(100% / 3);

	button {
		width: ${unit(15)};
		height: ${unit(15)};

		&.arrowLeft {
			transform: rotate(180deg);
		}

		img {
			width: 100%;
			height: auto;
		}
	}
`;

export const HeaderDateTitle = styled.div`
	font-size: ${unit(26)};
	letter-spacing: ${unit(-0.6)};
	color: ${Colors.navyBlack};
	font-weight: 600;
	width: ${unit(210)};
	text-align: center;
`;

export const TodayButton = styled.button`
	width: calc(100% / 3);
	font-size: ${unit(16)};
	color: gray;
	font-weight: 500;
	display: flex;
	justify-content: flex-start;
	transform: unset !important;
`;
