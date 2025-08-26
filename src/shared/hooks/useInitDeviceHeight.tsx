import { useEffect } from 'react';
import useWindowSize from './useWindowSize';

// IOS 창 사이즈 고정
const useInitDeviceHeight = () => {
	const { height } = useWindowSize();

	useEffect(() => {
		if (height) {
			const vh = height * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
	}, [height]);
};

export default useInitDeviceHeight;
