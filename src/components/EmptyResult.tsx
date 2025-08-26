import React, { FC } from 'react';
import Free from '@styles/FreeTable';
import { isEmpty, isUndefined } from 'lodash-es';
import { unit } from '@shared/utils/base';

interface Props {
	items: any;
}

//! FIXME 수정 요망.
const EmptyResult: FC<Props> = ({ items }) => {
	/**
	 * States
	 */

	/**
	 * Queries
	 */

	/**
	 * Side-Effects
	 */

	/**
	 * Handlers
	 */

	/**
	 * Helpers
	 */

	if (isUndefined(items)) return null;
	if (!isEmpty(items)) return null;

	return (
		<Free.Row $isLast>
			<Free.Value style={{ fontSize: unit(18) }} $height={250}>
				No results found.
			</Free.Value>
		</Free.Row>
	);
};

export default EmptyResult;
