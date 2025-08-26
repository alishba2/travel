import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';
import { Colors } from '@styles/globalStyles';

const wave = keyframes`
    to {
        transform: scale(4);
        opacity: 0;
    }
`;

const thinStyles = css`
	width: ${unit(100)};
`;

export const Container = styled.div<{ $isWide: boolean }>`
	position: fixed;
	left: 0;
	top: 0;
	height: 100%;
	min-height: 100vh;
	background-color: white;
	width: ${unit(270)};
	flex-shrink: 0;
	padding: ${unit(24)} ${unit(24)} ${unit(30)};
	overflow-y: auto;
	border-right: 1px solid rgb(229, 234, 240);
	transition: 0.3s;
	${({ $isWide }) => !$isWide && thinStyles}
`;

export const Logo = styled.figure`
	display: flex;
	align-items: flex-end;
	/* justify-content: flex-start; */
	justify-content: center;
	gap: ${unit(10)};
	margin-bottom: ${unit(10)};
	padding: ${unit(30)} 0;

	img {
		width: 100%;
	}

	&:hover {
		cursor: pointer;
	}

	span {
		font-size: ${unit(32)};
		font-weight: 500;
		position: relative;
		top: ${unit(4)};
		color: rgb(17, 20, 45);
	}
`;

export const MenuUl = styled.ul`
	margin-bottom: ${unit(30)};
`;

export const MenuLi = styled.li`
	h3 {
		font-size: ${unit(14)};
		font-weight: 500;
		color: rgb(42, 53, 71);
		margin-bottom: ${unit(6)};
	}
`;

export const MenuBox = styled.div<{ $isSelected?: boolean; $isWide: boolean }>`
	position: relative;
	border-radius: ${unit(7)};

	background-color: ${({ $isSelected }) => ($isSelected ? Colors.primary : 'white')};
	justify-content: ${({ $isWide }) => (!$isWide ? 'center' : 'flex-start')};
	margin-bottom: ${unit(2)};

	display: flex;
	align-items: center;
	padding: 0 ${unit(10)};
	gap: ${unit(18)};
	height: ${unit(45)};
	width: 100%;

	border: none;
	outline: none;
	overflow: hidden; /* Ensures wave effect is contained within the button */

	/*  */

	img {
		width: ${unit(20)};
		height: ${unit(20)};
	}
	span {
		/* color: rgb(42, 53, 71); */
		color: ${({ $isSelected }) => ($isSelected ? 'white' : 'rgb(42, 53, 71)')};
		font-size: ${unit(14)};
	}

	&:hover {
		cursor: pointer;
		background-color: ${({ $isSelected }) => ($isSelected ? Colors.primary : 'rgb(236, 242, 255)')};

		span {
			color: ${({ $isSelected }) => ($isSelected ? 'white' : 'rgb(100, 141, 255)')};
		}
	}
`;

export const WaveAnimation = styled.span`
	position: absolute;
	border-radius: 50%;
	transform: scale(0);
	animation: ${wave} 0.5s linear;
	background: rgba(236, 242, 255, 0.1);

	top: 50%;
	left: 50%;
	width: ${unit(100)};
	height: ${unit(100)};
	margin-top: ${unit(-50)}; /* Half of the height */
	margin-left: ${unit(-50)}; /* Half of the width */
`;

export const WideSection = styled.div`
	display: flex;
	justify-content: flex-end;
	button {
	}
`;
// Add these to your existing styled.ts file

export const SearchSection = styled.div<{ $isWide: boolean }>`
  position: relative;
  margin: ${({ $isWide }) => ($isWide ? '20px 0' : '10px 0')};
  padding: ${({ $isWide }) => ($isWide ? '0 15px' : '0 8px')};
  width: 100%;
`;

export const SearchInput = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  
  input {
    width: 100%;
    padding: 12px 16px 12px 40px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    
    &:focus {
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
    
    &::placeholder {
      color: #999;
      font-size: 13px;
    }
    
    &:hover {
      border-color: #bbb;
    }
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  color: #666;
  pointer-events: none;
`;

export const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-top: 6px;
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const SearchResultItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  background: ${({ $active }) => ($active ? '#f0f8ff' : 'white')};
  text-align: left;
  cursor: pointer;
  transition: background-color 0.1s ease;
  
  &:hover {
    background: #f0f8ff;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const SearchResultContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

export const SearchResultType = styled.span`
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
`;

export const SearchResultName = styled.span`
  font-size: 14px;
  color: #333;
  flex: 1;
  
  strong {
    background: yellow;
    font-weight: normal;
  }
`;

export const SearchResultTag = styled.span`
  font-size: 12px;
  color: #888;
  font-style: italic;
`;

export const SearchResultPrice = styled.span`
  font-size: 12px;
  color: #2196f3;
  font-weight: 600;
`;