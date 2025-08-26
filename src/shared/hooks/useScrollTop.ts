import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useTopRefStore } from '@shared/store/top';
import { TopRefStore } from '@shared/store/types';

interface IUseScrollTop {
	page?: string | number;
}

const useScrollTop = ({ page }: IUseScrollTop): void => {
	const { pathname } = useLocation();
	const { root } = useTopRefStore((state: TopRefStore) => state);

	useEffect(() => {
		if (root) root.scrollIntoView();
	}, [page, root]);

	useEffect(() => {
		if (root) root.scrollIntoView();
	}, [pathname, root]);
};

export default useScrollTop;
