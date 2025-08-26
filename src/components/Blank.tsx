import React, { FC } from 'react';

import styled from '@emotion/styled';
import { unit } from '@shared/utils/base';

interface Props {
	size: number;
	isHorizontal?: boolean;
}

const Blank: FC<Props> = ({ size, isHorizontal = false }) => {
	return <Figure size={size} isHorizontal={isHorizontal} />;
};

export default Blank;

const Figure = styled.figure<{ size: number; isHorizontal: boolean }>`
	width: ${({ size, isHorizontal }) => (isHorizontal ? unit(size) : '')};
	height: ${({ size, isHorizontal }) => (isHorizontal ? '' : unit(size))};
`;
