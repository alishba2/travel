import { useCallback, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

interface IReturnProps {
	targetRef: React.ForwardedRef<HTMLDivElement>;
	download: (filename: string) => void;

	isBusy: boolean;
}

const useHtmlToImgDown = (): IReturnProps => {
	const [isBusy, setIsBusy] = useState(false);
	const targetRef = useRef<HTMLDivElement>(null);
	const onClickHandler = useCallback(
		(filename: string) => {
			if (targetRef.current === null) {
				return;
			}
			setIsBusy(true);

			setTimeout(() => {
				html2canvas(targetRef.current!, { useCORS: true, scale: 2 }).then((canvas) => {
					canvas.toBlob((blob) => {
						if (blob) {
							setTimeout(() => {
								saveAs(blob, `${filename}.png`);
								setIsBusy(false);
							}, 1000);
						}
					});
				});
			}, 500);
		},
		[targetRef],
	);

	return { targetRef, download: onClickHandler, isBusy };
};

export default useHtmlToImgDown;
