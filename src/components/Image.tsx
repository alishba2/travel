import React, { FC, CSSProperties } from 'react';
import { IMG_URI, unit } from '@shared/utils/base';
import { isUndefined } from 'lodash-es';

interface Props {
	$width?: number;
	$height?: number;
	style?: CSSProperties;
	id?: string;
	alt?: string;
	className?: string;
	src: string;
	onClick?: any;
	ariaLabel?: string;
}

const Image: FC<Props> = ({
	$width,
	$height,
	style,
	id,
	src,
	onClick,
	className,
	ariaLabel = '이미지 버튼',
	alt = '이마지 설명',
}) => {
	if (isUndefined(onClick))
		return (
			<img
				id={id}
				style={{ width: $width && unit($width), height: $height && unit($height), ...style }}
				className={className}
				src={`${IMG_URI}/${src}`}
				alt={alt}
			/>
		);
	return (
		<button type="button" aria-label={ariaLabel} onClick={onClick}>
			<img
				id={id}
				style={{ width: $width && unit($width), height: $height && unit($height), ...style }}
				className={className}
				src={`${IMG_URI}/${src}`}
				alt={alt}
			/>
		</button>
	);
};

export default Image;
