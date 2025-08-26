import React, { FC } from 'react';
import Pagination, { ReactJsPaginationProps } from 'react-js-pagination';

import * as S from './styled';

const CustomPagination: FC<ReactJsPaginationProps> = (props) => (
	<S.Container>
		<Pagination {...props} />
	</S.Container>
);

export default CustomPagination;
