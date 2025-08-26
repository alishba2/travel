import { useEffect, useRef } from 'react';

function useInterval(callback: any, delay: number) {
	const savedCallback = useRef<any>();

	// 최신의 callback을 저장해둡니다.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// interval을 설정하고 해제하는 로직을 관리합니다.
	useEffect(() => {
		function tick() {
			if (savedCallback.current) {
				savedCallback.current();
			}
		}
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export default useInterval;
