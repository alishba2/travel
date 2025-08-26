import styled from '@emotion/styled';
import { munit, unit } from '@shared/utils/base';
import { Colors, mobilePoint } from '@styles/globalStyles';

export const Container = styled.div`
	position: relative;
	top: ${unit(20)};

	margin-bottom: ${unit(36)};

	.pagination {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: ${unit(20)};
		@media screen and (max-width: ${mobilePoint}) {
			margin-bottom: ${munit(20)};
		}
		* {
			user-select: none;
		}
	}
	ul.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	ul.pagination li {
		font-size: ${unit(14)};
		letter-spacing: ${unit(0.28)};
		color: #666;
		position: relative;
		display: inline-block;
		width: ${unit(22)};
		height: ${unit(22)};
		margin: 0 ${unit(3)};
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		border-radius: ${unit(4)};

		@media screen and (max-width: ${mobilePoint}) {
			width: ${munit(18)};
			height: ${munit(18)};
			margin: 0 ${munit(4)};
		}
	}
	ul.pagination li:first-child {
		background: none;
		border: 1px solid #b2b6bd;
		border-radius: 50%;
		color: #b2b6bd;
	}
	ul.pagination li:last-child {
		background: none;
		border: 1px solid #b2b6bd;
		border-radius: 50%;
		color: #b2b6bd;
	}
	ul.pagination li a {
		text-decoration: none;
		color: #000;
		font-size: ${unit(14)};
		line-height: 2.4;
		letter-spacing: -${unit(0.3)};
		transition: 0.2s;

		@media screen and (max-width: ${mobilePoint}) {
			font-size: ${munit(14)};
			letter-spacing: -${munit(0.3)};
		}
	}
	ul.pagination li.active a {
		font-weight: 800;

		/* font-weight: 700;
		color: ${Colors.primary}; */
	}

	.page-selection {
		width: ${unit(48)};
		height: ${unit(30)};
		color: #4981e2;
	}
`;
