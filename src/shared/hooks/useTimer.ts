import { useRef, useEffect, useState } from 'react';

const useTimer = (): [number, (initialNum: number) => void, () => void] => {
	const [count, setCount] = useState(-1);
	const interval: any = useRef(null);

	const startTimer = (initialNum: number) => {
		setCount(initialNum);
		if (interval.current !== null) clearInterval(interval.current);

		interval.current = setInterval(() => {
			setCount((prev) => {
				if (prev > 0) return prev - 1;
				clearInterval(interval.current);
				return 0;
			});
		}, 1000);
	};

	const clearTimer = () => {
		if (interval.current !== null) clearInterval(interval.current);
	};

	useEffect(() => {
		return () => {
			if (interval.current !== null) clearInterval(interval.current);
		};
	}, []);
	return [count, startTimer, clearTimer];
};
export { useTimer };
