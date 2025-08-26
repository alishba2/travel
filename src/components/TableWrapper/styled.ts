import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

export const Container = styled.section`
	width: 100%;

	border-radius: ${unit(7)};
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	border: none;
`;

export const Wrapper = styled.div`
	padding: ${unit(18)} ${unit(20)} ${unit(20)};
	padding: ${unit(24)};
`;

export const Header = styled.div`
	font-size: ${unit(18)};
	font-weight: 500;
	color: ${Colors.navyBlack};

	padding: ${unit(14 + 4)} ${unit(20)} 0;
`;
