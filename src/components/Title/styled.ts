import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

export const Container = styled.article<{ $isChild?: boolean }>`
	${({ $isChild }) =>
		$isChild &&
		`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: end;
	`}
`;

export const HeadingBox = styled.section`
	display: flex;
	flex-direction: column;
	gap: ${unit(6)};
`;

export const Title = styled.h1`
	font-size: ${unit(22)};
	letter-spacing: ${unit(-0.6)};
	color: ${Colors.navyBlack};
	font-weight: 600;
`;

export const Description = styled.h3`
	letter-spacing: ${unit(-0.6)};
	font-size: ${unit(16)};
	color: ${Colors.navyBlack};
	font-weight: 300;
	white-space: pre-line;
`;
