import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

const gradient = keyframes`
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
`;

export const Container = styled.main`
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;

	animation-timeline: auto;
	animation-range-start: normal;
	animation-range-end: normal;
	background: radial-gradient(rgb(210, 241, 223, 0.3), rgb(211, 215, 250, 0.3), rgb(186, 216, 244, 0.3)) 0% 0% / 400%
		400%;

	animation: 15s ease 0s infinite normal none running ${gradient};

	display: flex;
	justify-content: center;
	align-items: center;
`;

export const LoginBox = styled.form`
	background-color: white;
	width: ${unit(450)};
	padding: ${unit(50)} ${unit(32)} ${unit(36)};
	border-radius: ${unit(7)};
	box-shadow: rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
	transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

export const Logo = styled.figure`
	display: flex;
	justify-content: center;
	margin-bottom: ${unit(38)};

	img {
		width: ${unit(200)};
	}
`;

export const InputBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${unit(25)};
`;

export const ButtonBox = styled.div`
	margin-top: ${unit(24)};

	display: flex;
	flex-direction: column;
	gap: ${unit(8)};
`;
