import { CustomSetState } from '@typings/base';
import React, { ReactElement, useState } from 'react';
import { Pagination } from '@components/index';

/*
!NOTE 
관리자 페이지네이션용.
*/

interface IReturn {
	page: number;
	countPerPage: number;
	setPage: CustomSetState<number>;
	setCountPerPage: CustomSetState<number>;
	setTotalCount: CustomSetState<number>;
	Paging: () => ReactElement | null;
}

const COUNT_PER_PAGE = 10;
const RANGE_PAGE_DISPLAYED = 10;

const usePaging = (itemsCountPerPage = COUNT_PER_PAGE, pageRangeDisplayed = RANGE_PAGE_DISPLAYED): IReturn => {
	const [page, setPage] = useState(1);
	const [countPerPage, setCountPerPage] = useState(itemsCountPerPage);
	const [totalCount, setTotalCount] = useState(0);

	const Paging = (): ReactElement | null => {
		if (totalCount === 0) return null;
		return (
			<Pagination
				hideFirstLastPages
				activePage={page}
				itemsCountPerPage={itemsCountPerPage}
				totalItemsCount={totalCount}
				pageRangeDisplayed={pageRangeDisplayed}
				prevPageText="‹"
				nextPageText="›"
				onChange={(p) => setPage(p)}
			/>
		);
	};

	return { page, countPerPage, setPage, setCountPerPage, setTotalCount, Paging };
};

export default usePaging;
