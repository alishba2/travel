import { point } from '@styles/globalStyles';
import { useLayoutEffect, useState } from 'react';

interface IUseWindowSize {
	isMobile?: boolean;
	width?: number;
	height?: number;
}

function useWindowSizeTemp(): IUseWindowSize {
	const [windowSize, setWindowSize] = useState<{ width?: number; height?: number }>({
		width: undefined,
		height: undefined,
	});

	const handleSize = () => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	// Set size at the first client-side load
	useLayoutEffect(() => {
		window.addEventListener('resize', handleSize);

		handleSize();

		return () => {
			window.removeEventListener('resize', handleSize);
		};
	}, []);

	return {
		isMobile: windowSize.width ? windowSize.width <= point : undefined,
		width: windowSize.width,
		height: windowSize.height,
	};
}

export default useWindowSizeTemp;
