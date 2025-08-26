import { Dispatch, SetStateAction } from 'react';
import { StyledComponent } from '@emotion/styled/types/base';

export interface StringKeyAndVal {
	[key: string]: string;
}

export interface StringKeyAndAny {
	[key: string]: any;
}

export interface PrefixOfEmotion {
	[key: string]: StyledComponent<any>;
}

export interface Action {
	type: string;
	payload?: any;
}

export type CustomSetState<T> = Dispatch<SetStateAction<T>>;

export type ButtonStatus =
	| 'primary'
	| 'primary_outlined'
	| 'secondary'
	| 'secondary_outlined'
	| 'third'
	| 'third_outlined'
	| 'danger'
	| 'danger_outlined'

	//
	| 'fourth'
	| 'fourth_outlined'
	//
	| 'fifth'
	| 'fifth_outlined'
	//
	| 'warning'
	| 'warning_outlined'
	| 'success'
	| 'success_outlined'
	| 'disabled';
