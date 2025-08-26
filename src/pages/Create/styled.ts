import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

export const Container = styled.main``;

export const MemoSection = styled.form`
	border-radius: ${unit(7)};
	border: 1px solid rgb(229, 234, 239);
	overflow: auto;
	width: 100%;
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
